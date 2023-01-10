import { ArrayUtils, Opaque, Serializable } from '@core'
import { Playthrough } from '../playthrough'
import { Model } from '../Model'
import { GameStats } from './GameStats'


// enum
export enum GameType {
  VS = 1,
  COOP = 2
}
export enum ScoringType {
  HIGHEST_WINS = 1,
  LOWEST_WINS = 2,
  NO_SCORE = 3
}


// types
export type GameId = Opaque<string, 'GameId'>
export interface GameData {
  id?: GameId
  name: string
  scoring: ScoringType
  type: GameType
  playthroughs?: readonly Playthrough[]
}


// class
export abstract class Game<T extends Playthrough = Playthrough>
  extends Model<GameId>
  implements Serializable<GameData> {

  public readonly name: string
  public readonly scoring: ScoringType
  private _playthroughs: T[] | undefined

  public constructor(data: Omit<GameData, 'type'>) {
    super(data.id)
    this.name = data.name
    this.scoring = data.scoring

    if (data.playthroughs) {
      this.bindPlaythroughs(data.playthroughs as T[])
    }
  }

  public abstract readonly type: GameType

  public abstract createStats(): GameStats<T>

  public get hasScoring(): boolean {
    return this.scoring !== ScoringType.NO_SCORE
  }

  public get hasPlays(): boolean {
    if (!this._playthroughs) {
      throw new Error('playthroughs not loaded')
    }

    return this._playthroughs.length > 0
  }

  public get playthroughs(): ReadonlyArray<T> {
    if (!this._playthroughs) {
      throw new Error('playthroughs not loaded')
    }

    return this._playthroughs
  }

  public bindPlaythroughs(playthroughs: ReadonlyArray<T>) {
    this._playthroughs = playthroughs
      .filter(playthrough => playthrough.gameId === this.id)
      .sort(playthroughCompareFn)
  }

  protected addPlaythrough(playthrough: T) {
    if (!this._playthroughs) {
      this._playthroughs = [playthrough]
      return
    }

    const index = ArrayUtils.sortedIndex(this._playthroughs,
      playthrough, playthroughCompareFn)

    this._playthroughs.splice(index, 0, playthrough)
  }

  public toData(): GameData {
    return {
      id: this.id!,
      name: this.name,
      type: this.type,
      scoring: this.scoring
    }
  }

}


// helper
function playthroughCompareFn(a: Playthrough, b: Playthrough): number {
  return a.playedOn.getTime() - b.playedOn.getTime()
}