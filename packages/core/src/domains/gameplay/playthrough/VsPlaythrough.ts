import { Playthrough } from './Playthrough'
import { VsPlaythroughScores } from './VsPlaythroughScores'
import type { Player } from '../player'
import type { PlayerId, VsPlaythroughData } from '@services'
import type { VsGame } from '../game'


export type VsPlaythroughArgs = Omit<VsPlaythroughData, 'gameId' | 'playerIds' | 'scores'> & {
  game: VsGame
  players: ReadonlyArray<Player>
  scores: VsPlaythroughScores
}


/**
 * A recorded session of a competitive (vs) game.
 * Captures the winner (or null for a tie) and optional per-player scores.
 */
export class VsPlaythrough extends Playthrough {

  public readonly winnerId: PlayerId | null
  public readonly scores: VsPlaythroughScores

  public constructor(data: VsPlaythroughArgs) {
    super(data)
    this.winnerId = data.winnerId
    this.scores = data.scores
  }

  public get game(): VsGame {
    return super.game as VsGame
  }

  public get winner(): Player | undefined {
    return this.winnerId === null
      ? undefined
      : this.players.find(p => p.id === this.winnerId)
  }

  public get tied(): boolean {
    return this.winnerId === null
  }

  public override toData(): VsPlaythroughData {
    const data: VsPlaythroughData = {
      ...super.toData(),
      type: 'vs',
      winnerId: this.winnerId
    }
    if (!this.scores.empty) {
      data.scores = this.scores.toData()
    }
    return data
  }

}
