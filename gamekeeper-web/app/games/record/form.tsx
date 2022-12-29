"use client"

import { Reducer, useReducer } from 'react'
import { Record } from 'app/utils'
import { RecordData } from 'utils'


// types
type RecordFormProps = RecordData
type RecordReducer = Reducer<Record.State, Record.Action>


// component
export function RecordForm({ games, players }: RecordFormProps) {

  // setup reducer
  const [state, dispatch] = useReducer<RecordReducer>(
    Record.reducer, Record.init())

  return (
    <div>
      test: {state.gameId}

      {/* date */}
      <div>
        <label>Date</label>
        <input
          type="date"
          value={state.date.toISOString().substring(0, 10)}
          onChange={e => Record.setDate(new Date(e.target.value))}
        />
      </div>

      {/* game */}
      <div>
        <label>Game</label>
        <select
          value={state.gameId ?? ''}
          onChange={e => dispatch(Record.setGame(e.target.value))}
        >
          <option value="" disabled>select game...</option>
          {games.map(game =>
            <option key={game.id} value={game.id}>{game.name}</option>
          )}
        </select>
      </div>

      {/* players */}
      <div>
        <label>players</label>
        {players.map(player =>
          <div>
            <label>
              {player.name}
              <input type="checkbox" value={player.id} />
            </label>
          </div>  
        )}
      </div>

      
    </div>
  )
}