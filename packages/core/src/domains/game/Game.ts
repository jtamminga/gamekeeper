import { GameKeeperDeps, Serializable } from '@core'
import { Playthrough, playthroughCompareFn } from '../playthrough'
import { Model } from '../Model'
import { GameStats } from './GameStats'
import { GameId, GameType, ScoringType } from '@services'


// types
export interface GameData {
  id?: GameId
  name: string
  scoring: ScoringType
  type: GameType
}


// class
export abstract class Game<T extends Playthrough = Playthrough>
  extends Model<GameId>
  implements Serializable<GameData> {

  public readonly name: string
  public readonly scoring: ScoringType

  public constructor(protected _deps: GameKeeperDeps, data: Omit<GameData, 'type'>) {
    super(data.id)
    this.name = data.name
    this.scoring = data.scoring
  }

  public abstract readonly type: GameType

  public abstract getStats(): GameStats<T>

  public get hasScoring(): boolean {
    return this.scoring !== ScoringType.NO_SCORE
  }

  public get hasPlays(): boolean {
    return this.playthroughs.length > 0
  }

  public get playthroughs(): ReadonlyArray<T> {
    return Object.values(this._deps.builder.data.playthroughs)
      .filter(playthrough => playthrough.gameId === this.id)
      .sort(playthroughCompareFn) as T[]
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