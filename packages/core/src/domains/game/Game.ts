import { GameKeeperDeps, Serializable } from '@core'
import { Playthrough, Playthroughs } from '../playthrough'
import { NewData, Entity } from '../Entity'
import { GameId, GameType, ScoringType } from '@services'


// types
export interface GameData {
  id: GameId
  name: string
  scoring: ScoringType
  type: GameType
  weight?: number
}
export type NewGameData = NewData<GameData>
export type UpdatedGameData = {
  id: GameId
  name?: string
  weight?: number
}


// class
export abstract class Game<T extends Playthrough = Playthrough>
  extends Entity<GameId>
  implements Serializable<GameData> {

  private _name: string
  private _scoring: ScoringType
  private _weight: number | undefined

  public constructor(protected _deps: GameKeeperDeps, data: Omit<GameData, 'type'>) {
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
    return this._deps.store.playthroughs
      .filter(playthrough => playthrough.gameId === this.id)
      .sort(Playthroughs.sortLastPlayedFirst) as T[]
  }

  public async update(data: Omit<UpdatedGameData, 'id'>): Promise<void> {
    this._name = data.name ?? this._name
    this._weight = data.weight ?? this._weight
    await this._deps.services.gameService.updateGame(this)
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