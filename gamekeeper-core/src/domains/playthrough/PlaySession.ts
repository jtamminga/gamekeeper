import { Game, GameId } from '../game'
import { Player, PlayerId } from '../player'


// type
export interface PlaySessionData {
  gameId: GameId
  playerIds: readonly PlayerId[]
  date: Date
}


// session
export class PlaySession {

  protected readonly _gameId: GameId
  protected readonly _playerIds: readonly PlayerId[]
  public readonly date: Date
  
  public constructor(data: PlaySessionData) {
    this._gameId = data.gameId
    this._playerIds = data.playerIds
    this.date = data.date
  }
  
}