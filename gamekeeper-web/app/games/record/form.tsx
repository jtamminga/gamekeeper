"use client"

import { Dispatch, Reducer, useReducer } from 'react'
import { Record } from 'app/utils'
import { RecordData } from 'utils'
import type { GameId, PlayerId } from 'gamekeeper-core'
import { GameType } from 'gamekeeper-core/dist/web'


// types
type RecordFormProps = RecordData
type RecordReducer = Reducer<Record.State, Record.Action>


// component
export function RecordForm(props: RecordFormProps) {

  // setup reducer
  const [state, dispatch] = useReducer<RecordReducer>(
    Record.reducer, Record.init())

  // deconstruct props
  const { games } = props

  // game
  const game = games.find(game =>game.id === state.gameId)
  
  // render
  return (
    <div>
      {renderBaseForm(props, state, dispatch)}

      {game?.type === GameType.VS &&
        renderVs(props, state, dispatch)
      }
    </div>
  )
}


//
// rendering
// =========


// render base form
function renderBaseForm(data: RecordData, state: Record.State, dispatch: Dispatch<Record.Action>) {

  const { games, players } = data
  const { playedOn, gameId, playerIds } = state

  return (
    <>
      {/* date */}
      <div>
        <label>Date</label>
        <input
          type="date"
          value={playedOn?.toISOString().substring(0, 10)}
          onChange={e => dispatch(Record.setDate(new Date(e.target.value)))}
        />
      </div>

      {/* game */}
      <div>
        <label>Game</label>
        <select
          value={gameId ?? ''}
          onChange={e => dispatch(Record.setGame(e.target.value as GameId))}
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
          <div key={`player-${player.id}`}>
            <label>
              {player.name}
              <input
                type="checkbox"
                checked={playerIds?.includes(player.id as PlayerId)}
                onChange={e => dispatch(Record.setPlayer(player.id!, e.target.checked))}
              />
            </label>
          </div>  
        )}
      </div>
    </>
  )
}

function renderVs(data: RecordData, state: Record.State, dispatch: Dispatch<Record.Action>) {

  // player data collection
  const playerPlaying = (state.playerIds ?? []).map(id =>
    data.players.find(player => player.id === id)!)
  
  // render
  return (
    <>
      <div>
        <label>scores</label>
        {playerPlaying.map(player =>
          <div key={`score-${player.id}`}>
            <label>{player.name}</label>
            <input
              type="number"
            />
          </div>
        )}
      </div>
    </>
  )
}