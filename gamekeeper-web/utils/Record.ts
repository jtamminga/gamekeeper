import {
  CoopPlaythroughData,
  GameData,
  GameId,
  PlayerId,
  ScoringType,
  VsPlaythroughData
} from 'gamekeeper-core/dist/web'


// namespace
export namespace Record {


  //
  // types
  // =====


  export type State = Partial<VsPlaythroughData | CoopPlaythroughData>

  type ActionType =
    | 'setDate' 
    | 'setGame'
    | 'setPlayer'
    | 'setPlayerScore'
    | 'setVsWinner'
    | 'setCoopWinner'
    | 'setScore'

  export interface Action {
    type: ActionType
    payload?: any
  }

  
  //
  // action types
  // ============


  interface SetGameAction extends Action {
    type: 'setGame'
    payload: {
      gameId: GameId
    }
  }
  interface SetDateAction extends Action {
    type: 'setDate',
    payload: {
      playedOn: Date
    }
  }
  interface SetPlayerAction extends Action {
    type: 'setPlayer',
    payload: {
      playerId: PlayerId,
      included: boolean
    }
  }
  interface SetPlayerScoreAction extends Action {
    type: 'setPlayerScore',
    payload: {
      playerId: PlayerId
      score: number | undefined
    }
  }
  interface SetVsWinnerAction extends Action {
    type: 'setVsWinner'
    payload: {
      winner: PlayerId
    }
  }
  interface SetCoopWinnerAction extends Action {
    type: 'setCoopWinner',
    payload: {
      playersWon: boolean
    }
  }
  interface SetScoreAction extends Action {
    type: 'setScore',
    payload: {
      score: number | undefined
    }
  }


  //
  // action creators
  // ===============


  export function setGame(gameId: GameId): SetGameAction {
    return {
      type: 'setGame',
      payload: { gameId }
    }
  }

  export function setDate(playedOn: Date): SetDateAction {
    return {
      type: 'setDate',
      payload: { playedOn }
    }
  }

  export function setPlayer(playerId: PlayerId, included: boolean): SetPlayerAction {
    return {
      type: 'setPlayer',
      payload: { playerId, included }
    }
  }

  export function setPlayerScore(playerId: PlayerId, score: number | undefined): SetPlayerScoreAction {
    return {
      type: 'setPlayerScore',
      payload: { playerId, score }
    }
  }
  
  export function setVsWinner(winner: PlayerId): SetVsWinnerAction {
    return {
      type: 'setVsWinner',
      payload: { winner }
    }
  }

  export function setScore(score: number | undefined): SetScoreAction {
    return {
      type: 'setScore',
      payload: { score }
    }
  }

  export function setCoopWinner(playersWon: boolean): SetCoopWinnerAction {
    return {
      type: 'setCoopWinner',
      payload: { playersWon }
    }
  }


  //
  // functions
  // =========


  export function init(playerIds: ReadonlyArray<PlayerId>): State {
    return {
      playedOn: new Date(),
      gameId: undefined,
      playerIds
    }
  }

  export function createReducer(games: Record<GameId, GameData>) {
    return function reducer(preState: State, action: Action): State {
      switch(action.type) {
        case 'setGame': {
          const { payload } = action as SetGameAction
          return {
            ...preState,
            gameId: payload.gameId,
            // clear other data
            winnerId: undefined,
            playersWon: undefined,
            score: undefined,
            scores: undefined
          }
        }
        case 'setDate': {
          const { payload } = action as SetDateAction
          return {
            ...preState,
            playedOn: payload.playedOn
          }
        }
        case 'setPlayer': {
          const { payload: { playerId, included } } = action as SetPlayerAction
          
          // create updated player id array
          let playerIds = included
            ? [...preState.playerIds ?? [], playerId]
            : preState.playerIds?.filter(id => id !== playerId)

          return {
            ...preState,
            playerIds
          }
        }
        case 'setPlayerScore': {
          const { payload: { playerId, score } } = action as SetPlayerScoreAction
          let scores = (preState as VsPlaythroughData).scores ?? []

          scores = scores.filter(s => s.playerId !== playerId)
          if (score !== undefined) {
            scores = [ ...scores, { playerId, score } ]
          }

          let winnerId = (preState as VsPlaythroughData).winnerId
          if (scores.length === preState.playerIds?.length) {
            const game = games[preState.gameId!]
            if (game.scoring === ScoringType.HIGHEST_WINS) {
              winnerId = scores.reduce((highest, i) => i.score > highest.score ? i : highest).playerId
            }
            else if (game.scoring === ScoringType.LOWEST_WINS) {
              winnerId = scores.reduce((highest, i) => i.score < highest.score ? i : highest).playerId
            }
          }

          return {
            ...preState,
            scores,
            winnerId
          }
        }
        case 'setVsWinner': {
          const { payload } = action as SetVsWinnerAction

          return {
            ...preState,
            winnerId: payload.winner
          }
        }
        case 'setCoopWinner': {
          const { payload } = action as SetCoopWinnerAction

          return {
            ...preState,
            playersWon: payload.playersWon 
          }
        }
        case 'setScore': {
          const { payload } = action as SetScoreAction

          return {
            ...preState,
            score: payload.score
          }
        }
      }
    }
  }

}

