export namespace Record {
  
  //
  // types
  // =====


  export type State = {
    date: Date,
    gameId: string | undefined
  }

  type ActionType =
    | 'setDate' 
    | 'setGame'

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
      gameId: string
    }
  }
  interface SetDateAction extends Action {
    type: 'setDate',
    payload: {
      date: Date
    }
  }


  //
  // action creators
  // ===============


  export function setGame(gameId: string): SetGameAction {
    return {
      type: 'setGame',
      payload: { gameId }
    }
  }

  export function setDate(date: Date): SetDateAction {
    return {
      type: 'setDate',
      payload: { date }
    }
  }


  //
  // functions
  // =========


  export function init(): State {
    return {
      date: new Date(),
      gameId: undefined
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
          date: payload.date
        }
      }
    }
  }

}

