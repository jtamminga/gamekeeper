import { CoopPlaythrough, GameKeeper, Playthrough, VsPlaythrough, Winrates } from '@domains'
import { formatDate } from './utils'


// types
type FormattedPlaythrough = {
  id: string
  playedOn: string
  winner: string
  scores: FormattedScore[]
}
type FormattedScore = { name: string, score: string }
type FormattedWinrate = {
  name: string,
  winrate: string
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
      gamekeeper.playthroughs.hydrate({ gameId: this.playthrough.gameId, limit: 5 })
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
    private _gamekeeper: GameKeeper,
    playthrough: Playthrough,
    private _data: HydratedData
  ) {
    super(playthrough)

    this._latestPlaythroughs = _gamekeeper.playthroughs.latest(5)
  }

  public get stats(): FormattedStat[] {
    const {
      numPlaythroughsAllTime,
      numPlaythroughsThisYear,
      winratesAllTime,
      winratesThisYear
    } = this._data

    // start with initial stat
    const formattedStats: FormattedStat[] = [
      {
        name: 'Plays',
        valueAllTime: numPlaythroughsAllTime.toString(),
        valueThisYear: numPlaythroughsThisYear.toString()
      }
    ]

    // add winrates to stats
    for (const player of this.playthrough.players) {
      formattedStats.push({
        name: player.name,
        valueAllTime: winratesAllTime.winrates
          .find(wr => wr.player === player)?.winrate.toLocaleString('en-US', { style: 'percent' }) ?? '',
        valueThisYear: winratesThisYear.winrates
          .find(wr => wr.player === player)?.winrate.toLocaleString('en-US', { style: 'percent' }) ?? ''
      })
    }

    return formattedStats
  }

  public get latestPlaythroughs(): FormattedPlaythrough[] {
    return this._latestPlaythroughs.map(playthrough => ({
      id: playthrough.id,
      playedOn: formatDate(playthrough.playedOn),
      winner: this.winnerNameFor(playthrough),
      scores: this.scoresFor(playthrough)
    }))
  }

  private scoresFor(playthrough: Playthrough): FormattedScore[] {
    if (playthrough instanceof VsPlaythrough) {
      const data = playthrough.scores?.toData()
      if (!data) {
        return []
      }

      return data.map(row => ({
        name: this._gamekeeper.players.get(row.playerId).name,
        score: row.score.toString()
      }))
    }
  
    else if (playthrough instanceof CoopPlaythrough) {
      if (playthrough.score === undefined) {
        return []
      }
      else {
        return [{ name: 'players', score: playthrough.score.toString() }]
      }
    }
  
    else {
      throw new Error('unsupported playthrough type')
    }
  }
}