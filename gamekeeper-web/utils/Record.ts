import type {
  CoopPlaythroughData,
  GameId,
  PlayerId,
  VsPlaythroughData
} from 'gamekeeper-core'


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
  interface SetScoreAction extends Action {
    type: 'setScore',
    payload: {
      playerId: PlayerId
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

  export function setScore(playerId: PlayerId, score: number | undefined): SetScoreAction {
    return {
      type: 'setScore',
      payload: { playerId, score }
    }
  }


  //
  // functions
  // =========


  export function init(): State {
    return {
      playedOn: new Date(),
      gameId: undefined,
      playerIds: []
    }
  }

  export function reducer(preState: State, action: Action): State {
    switch(action.type) {
      case 'setGame': {
        const { payload } = action as SetGameAction
        return {
          ...preState,
          gameId: payload.gameId
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
      case 'setScore': {
        const { payload: { playerId, score } } = action as SetScoreAction

        return {
          ...preState,
        }
      }
    }
  }

}

