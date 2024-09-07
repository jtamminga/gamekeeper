import { Game, Player } from '@domains/gameplay'
import { formatNumber, formatPercent } from './utils'
import { type FormattedPlaythroughs, formatPlaythroughs } from './FormattedPlaythroughs'
import { HydratableView } from './HydratableView'
import type { PlayerId } from '@services'
import { GameKeeper } from '@domains'


// types
interface FormattedStat {
  name: string
  valueAllTime: string,
  valueThisYear: string
}
interface FormattedPlayerStat extends FormattedStat {
  playerId: PlayerId
}
export type FormattedScoreStats = {
  average: string
  best: { score: string, player?: string, playerId?: PlayerId }
}
export interface HydratedGameView {
  readonly game: Game
  readonly numPlaythroughs: FormattedStat
  readonly winrates: ReadonlyArray<FormattedPlayerStat>
  readonly stats: ReadonlyArray<FormattedStat>
  readonly scoreStats: FormattedScoreStats | undefined
  readonly latestPlaythroughs: FormattedPlaythroughs
  readonly hasMorePlaythroughs: boolean
}


// constants
const NUM_HISTORICAL_PLAYTHROUGHS = 5


export class GameView implements HydratableView<HydratedGameView> {

  public constructor(public readonly game: Game, private players?: ReadonlyArray<Player>) { }

  public async hydrate(gamekeeper: GameKeeper): Promise<HydratedGameView> {
    const gameStats = gamekeeper.insights.stats.forGame(this.game)
    const year = new Date().getFullYear()

    // fetch data
    const [
      numPlaysAllTime,
      numPlaysThisYear,
      winratesAllTime,
      winratesThisYear,
      scoreStats
    ] = await Promise.all([
      gameStats.numPlaythroughs(),
      gameStats.numPlaythroughs({ year }),
      gameStats.winrates(),
      gameStats.winrates({ year }),
      gameStats.scoreStats(),
      gamekeeper.gameplay.playthroughs.hydrate({
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
      : gamekeeper.gameplay.players.all()

    const winrates: FormattedPlayerStat[] = players.map(player => ({
      name: player.name,
      playerId: player.id,
      valueAllTime: formatPercent(winratesAllTime.winrates.find(wr => wr.player === player)?.winrate),
      valueThisYear: formatPercent(winratesThisYear.winrates.find(wr => wr.player === player)?.winrate)
    }))

    let formattedScoreStats: FormattedScoreStats | undefined
    if (scoreStats !== undefined) {
      formattedScoreStats = {
        average: formatNumber(scoreStats.averageScore),
        best: {
          score: formatNumber(scoreStats.bestScore.score),
          playerId: scoreStats.bestScore.player?.id,
          player: scoreStats.bestScore.player?.name
        }
      }
    }

    return {
      game: this.game,
      numPlaythroughs,
      winrates,
      stats: [numPlaythroughs, ...winrates],
      scoreStats: formattedScoreStats,
      hasMorePlaythroughs: numPlaysAllTime > NUM_HISTORICAL_PLAYTHROUGHS,
      latestPlaythroughs: formatPlaythroughs(
        gamekeeper
          .gameplay
          .playthroughs
          .latest(NUM_HISTORICAL_PLAYTHROUGHS, this.game.id)
      , { scores: true })
    }
  }

}