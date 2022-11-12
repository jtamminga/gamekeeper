import { ArrayUtils, Opaque } from '@core'
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
export abstract class Game<T extends Playthrough = Playthrough> extends Model<GameId> {

  public readonly name: string
  public readonly scoring: ScoringType
  private _playthroughs: T[] | undefined

  public constructor(data: Omit<GameData, 'type'>) {
    super(data.id)
    this.name = data.name
    this.scoring = data.scoring
    this._playthroughs = data.playthroughs as T[] | undefined
  }

  public abstract readonly type: GameType

  public abstract getStats(): GameStats<T>

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
    this._playthroughs = [...playthroughs]
  }

  protected addPlaythrough(playthrough: T) {
    if (!this._playthroughs) {
      this._playthroughs = []
    }

    this._playthroughs.push(playthrough)
  }

}