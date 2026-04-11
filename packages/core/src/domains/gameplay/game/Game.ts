import { Entity } from '@domains'
import { GameData, GameId, ScoringType, UpdatedGameData } from '@services'
import type { Serializable } from '@core'


/**
 * Abstract base class for a board game in the library.
 * Holds metadata (name, weight, scoring type, ownership).
 */
export abstract class Game
  extends Entity<GameId>
  implements Serializable<GameData> {

  private _name: string
  private _scoring: ScoringType
  private _weight: number | undefined
  private _own: boolean

  public constructor(data: Omit<GameData, 'type'>) {
    super(data.id)
    this._name = data.name
    this._scoring = data.scoring
    this._weight = data.weight
    this._own = data.own
  }

  public get name(): string {
    return this._name
  }

  public get scoring(): ScoringType {
    return this._scoring
  }

  public get weight(): number | undefined {
    return this._weight
  }

  public get own(): boolean {
    return this._own
  }

  public get hasScoring(): boolean {
    return this.scoring !== ScoringType.NO_SCORE
  }

  public get roundBased(): boolean {
    return this.scoring === ScoringType.MOST_ROUNDS
  }

  public update(data: Omit<UpdatedGameData, 'id'>): void {
    this._name = data.name ?? this._name
    this._weight = data.weight ?? this._weight
    this._own = data.own ?? this._own
  }

  public abstract toData(): GameData

  protected toBaseData(): Omit<GameData, 'type'> {
    return {
      id: this.id,
      name: this._name,
      scoring: this._scoring,
      weight: this._weight,
      own: this._own
    }
  }

}