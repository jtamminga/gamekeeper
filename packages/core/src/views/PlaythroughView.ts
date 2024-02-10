import { GameKeeper, Playthrough, VsPlaythrough } from '@domains'
import { formatPercent } from './utils'
import { FormattedPlaythrough, formatPlaythroughs, formatWinner } from './PlaythroughPreview'


// types
type FormattedStat = {
  name: string
  valueAllTime: string,
  valueThisYear: string
}
export interface HydratedPlaythroughView {
  readonly numPlaythroughs: FormattedStat
  readonly winrates: ReadonlyArray<FormattedStat>
  readonly stats: ReadonlyArray<FormattedStat>
  readonly latestPlaythroughs: ReadonlyArray<FormattedPlaythrough>
}


// constants
const NUM_HISTORICAL_PLAYTHROUGHS = 5


export class PlaythroughView {

  public constructor(public readonly playthrough: Playthrough) { }

  public async hydrate(gamekeeper: GameKeeper): Promise<HydratedPlaythroughView> {
    const stats = gamekeeper.stats.forGame(this.playthrough.game)
    const year = new Date().getFullYear()

    // fetch data
    const [
      numPlaysAllTime,
      numPlaysThisYear,
      winratesAllTime,
      winratesThisYear
    ] = await Promise.all([
      stats.getNumPlaythroughs(),
      stats.getNumPlaythroughs({ year }),
      stats.getWinrates(),
      stats.getWinrates({ year }),
      gamekeeper.playthroughs.hydrate({
        gameId: this.playthrough.gameId,
        limit: NUM_HISTORICAL_PLAYTHROUGHS
      })
    ])

    const numPlaythroughs: FormattedStat = {
      name: 'Plays',
      valueThisYear: numPlaysThisYear.toString(),
      valueAllTime: numPlaysAllTime.toString()
    }

    const winrates: FormattedStat[] = this.playthrough.players.map(player => ({
      name: player.name,
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
          .latest(NUM_HISTORICAL_PLAYTHROUGHS, this.playthrough.gameId)
      )
    }
  }

  public get winner(): string {
    return formatWinner(this.playthrough)
  }

  public get tied(): boolean {
    if (this.playthrough instanceof VsPlaythrough) {
      return this.playthrough.tied
    }

    return false
  }

}