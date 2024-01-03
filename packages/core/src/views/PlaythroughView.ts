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


export class PlaythroughView {

  public constructor(public readonly playthrough: Playthrough) { }

  public async hydrate(gamekeeper: GameKeeper): Promise<HydratedPlaythroughView> {
    const stats = gamekeeper.stats.forGame(this.playthrough.game)
    const [numPlaythroughs, winrates] = await Promise.all([
      stats.getNumPlaythroughs(),
      stats.getWinrates(),
      gamekeeper.playthroughs.hydrate({ gameId: this.playthrough.gameId, limit: 5 })
    ])

    return new HydratedPlaythroughView(
      gamekeeper,
      this.playthrough,
      numPlaythroughs,
      winrates
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
    public readonly numPlaythroughs: number,
    private readonly _winrates: Winrates,
  ) {
    super(playthrough)

    this._latestPlaythroughs = _gamekeeper.playthroughs.latest(5)
  }

  public get latestPlaythroughs(): FormattedPlaythrough[] {
    return this._latestPlaythroughs.map(playthrough => ({
      id: playthrough.id,
      playedOn: formatDate(playthrough.playedOn),
      winner: this.winnerNameFor(playthrough),
      scores: this.scoresFor(playthrough)
    }))
  }

  public get winrates(): FormattedWinrate[] {
    return this._winrates.winrates.map(winrate => ({
      name: winrate.player.name,
      winrate: winrate.winrate.toLocaleString('en-US', { style: 'percent' })
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