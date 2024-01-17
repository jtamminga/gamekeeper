import { CoopPlaythrough, GameKeeper, Playthrough, VsPlaythrough, Winrates } from '@domains'
import { formatDate } from './utils'


// types
type FormattedScore = { name: string, score: string }
type FormattedPlaythrough = {
  id: string
  playedOn: string
  winner: string
  scores: FormattedScore[]
}
type FormattedStat = {
  name: string
  valueAllTime: string,
  valueThisYear: string
}
type HydratedData = {
  numPlaythroughsAllTime: number
  numPlaythroughsThisYear: number
  winratesAllTime: Winrates,
  winratesThisYear: Winrates
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
      numPlaythroughsAllTime,
      numPlaythroughsThisYear,
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

    return new HydratedPlaythroughView(
      gamekeeper,
      this.playthrough,
      {
        numPlaythroughsAllTime,
        numPlaythroughsThisYear,
        winratesAllTime,
        winratesThisYear
      }
    )
  }

  public get winner(): string {
    return this.winnerNameFor(this.playthrough)
  }

  protected winnerNameFor(playthrough: Playthrough): string {
    if (playthrough instanceof VsPlaythrough) {
      return playthrough.winner.name
    }
  
    else if (playthrough instanceof CoopPlaythrough) {
      return playthrough.playersWon
        ? 'players'
        : 'game'
    }
  
    else {
      throw new Error('unsupported playthrough type')
    }
  }

}

export class HydratedPlaythroughView extends PlaythroughView {

  private readonly _latestPlaythroughs: ReadonlyArray<Playthrough>

  public constructor(
    gamekeeper: GameKeeper,
    playthrough: Playthrough,
    private _data: HydratedData
  ) {
    super(playthrough)

    this._latestPlaythroughs = gamekeeper.playthroughs
      .latest(NUM_HISTORICAL_PLAYTHROUGHS, playthrough.gameId)
  }

  public get numPlaythroughs(): FormattedStat {
    const {
      numPlaythroughsAllTime,
      numPlaythroughsThisYear,
    } = this._data

    return {
      name: 'Plays',
      valueThisYear: numPlaythroughsThisYear.toString(),
      valueAllTime: numPlaythroughsAllTime.toString()
    }
  }

  public get winrates(): FormattedStat[] {
    const {
      winratesAllTime,
      winratesThisYear
    } = this._data

    return this.playthrough.players.map(player => ({
      name: player.name,
      valueAllTime: formatPercent(winratesAllTime.winrates.find(wr => wr.player === player)?.winrate),
      valueThisYear: formatPercent(winratesThisYear.winrates.find(wr => wr.player === player)?.winrate)
    }))
  }

  public get stats(): FormattedStat[] {
    return [
      this.numPlaythroughs,
      ...this.winrates
    ]
  }

  public get latestPlaythroughs(): FormattedPlaythrough[] {
    return this._latestPlaythroughs.map(playthrough => ({
      id: playthrough.id,
      playedOn: formatDate(playthrough.playedOn),
      winner: this.winnerNameFor(playthrough),
      scores: scoresFor(playthrough)
    }))
  }

  
}


// helpers
function formatPercent(value: number | undefined): string {
  return value?.toLocaleString('en-US', { style: 'percent' }) ?? ''
}
function scoresFor(playthrough: Playthrough): FormattedScore[] {
  if (playthrough instanceof VsPlaythrough) {
    return playthrough.scores.all.map(score => ({
      name: score.player.name,
      score: score.value.toString()
    }))
  }
  else if (playthrough instanceof CoopPlaythrough) {
    return playthrough.score === undefined
      ? []
      : [{ name: 'players', score: playthrough.score.toString() }]
  }
  else {
    throw new Error('unsupported playthrough type')
  }
}