import { Entity } from '@domains'
import { GameData, GameId, ScoringType, UpdatedGameData } from '@services'
import { Playthrough } from '../playthrough'
import type { GameplayDeps } from '../Gameplay'
import type { Serializable } from '@core'


// class
export abstract class Game<T extends Playthrough = Playthrough>
  extends Entity<GameId>
  implements Serializable<GameData> {

  private _name: string
  private _scoring: ScoringType
  private _weight: number | undefined

  public constructor(protected _deps: GameplayDeps, data: Omit<GameData, 'type'>) {
    super(data.id)
    this._name = data.name
    this._scoring = data.scoring
    this._weight = data.weight
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

  public get hasScoring(): boolean {
    return this.scoring !== ScoringType.NO_SCORE
  }

  public get hasPlays(): boolean {
    return this.playthroughs.length > 0
  }

  public get playthroughs(): ReadonlyArray<T> {
    return this._deps.repo.getPlaythroughs({ gameId: this.id }) as T[]
  }

  public async update(data: Omit<UpdatedGameData, 'id'>): Promise<void> {
    this._name = data.name ?? this._name
    this._weight = data.weight ?? this._weight
    
    await this._deps.repo.updateGame(this)
  }

  public abstract toData(): GameData

  protected toBaseData(): Omit<GameData, 'type'> {
    return {
      id: this.id,
      name: this.name,
      scoring: this.scoring
    }
  }

}