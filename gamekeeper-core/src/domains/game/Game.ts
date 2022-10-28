import { ArrayUtils, Opaque } from '@core'
import { Playthrough } from '../playthrough'
import { Model } from '../Model'


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
  playthroughs?: readonly Playthrough[]
}


// class
export abstract class Game extends Model<GameId> {

  public readonly name: string
  public readonly scoring: ScoringType
  public readonly playthroughs: Playthrough[]

  public constructor(data: GameData) {
    super(data.id)
    this.name = data.name
    this.scoring = data.scoring
    this.playthroughs = [...data.playthroughs ?? []]
  }

  public abstract readonly type: GameType

  public get hasScoring(): boolean {
    return this.scoring !== ScoringType.NO_SCORE
  }

  public get hasPlays(): boolean {
    return this.playthroughs.length > 0
  }

  public getLastPlayed(): Date | undefined {
    if (!this.hasPlays) return
    return ArrayUtils.last(this.playthroughs).playedOn
  }

}