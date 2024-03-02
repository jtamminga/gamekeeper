import { Game, GameKeeper, Player } from '@domains'
import { formatPercent } from './utils'
import { FormattedPlaythrough, formatPlaythroughs } from './PlaythroughPreview'
import { HydratableView } from './HydratableView'
import type { PlayerId } from '@services'


// types
interface FormattedStat {
  name: string
  valueAllTime: string,
  valueThisYear: string
}
interface FormattedPlayerStat extends FormattedStat {
  playerId: PlayerId
} 
export interface HydratedGameView {
  readonly numPlaythroughs: FormattedStat
  readonly winrates: ReadonlyArray<FormattedPlayerStat>
  readonly stats: ReadonlyArray<FormattedStat>
  readonly latestPlaythroughs: ReadonlyArray<FormattedPlaythrough>
}


// constants
const NUM_HISTORICAL_PLAYTHROUGHS = 5


export class GameView implements HydratableView<HydratedGameView> {

  public constructor(public readonly game: Game, private players?: ReadonlyArray<Player>) { }

  public async hydrate(gamekeeper: GameKeeper): Promise<HydratedGameView> {
    const stats = gamekeeper.stats.forGame(this.game)
    const year = new Date().getFullYear()

    // fetch data
    const [
      numPlaysAllTime,
      numPlaysThisYear,
      winratesAllTime,
      winratesThisYear
    ] = await Promise.all([
      stats.numPlaythroughs(),
      stats.numPlaythroughs({ year }),
      stats.winrates(),
      stats.winrates({ year }),
      gamekeeper.playthroughs.hydrate({
        gameId: this.game.id,
        limit: NUM_HISTORICAL_PLAYTHROUGHS
      })
    ])

    const numPlaythroughs: FormattedStat = {
      name: 'Plays',
      valueThisYear: numPlaysThisYear.toString(),
      valueAllTime: numPlaysAllTime.toString()
    }

    const players = this.players
      ? this.players
      : gamekeeper.players.all()

    const winrates: FormattedPlayerStat[] = players.map(player => ({
      name: player.name,
      playerId: player.id,
      valueAllTime: formatPercent(winratesAllTime.winrates.find(wr => wr.player === player)?.winrate),
      valueThisYear: formatPercent(winratesThisYear.winrates.find(wr => wr.player === player)?.winrate)
    }))

    return {
      numPlaythroughs,
      winrates,
      stats: [numPlaythroughs, ...winrates],
      latestPlaythroughs: formatPlaythroughs(
        gamekeeper
          .playthroughs
          .latest(NUM_HISTORICAL_PLAYTHROUGHS, this.game.id)
      )
    }
  }

}