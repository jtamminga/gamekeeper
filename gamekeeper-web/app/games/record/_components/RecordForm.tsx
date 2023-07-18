'use client'

import { recordPlaythrough } from './action'
import { Dispatch, Reducer, useMemo, useReducer, useTransition } from 'react'
import { Record } from 'utils/Record'
import type { RecordData } from 'utils/types'
import type { GameData, GameId, PlayerId, VsPlaythroughData } from 'gamekeeper-core'
import { CoopPlaythroughData, GameType } from 'gamekeeper-core/dist/web'


// types
type RecordFormProps = RecordData
type RecordReducer = Reducer<Record.State, Record.Action>


// component
export function RecordForm(props: RecordFormProps) {

  // deconstruct props
  const {players, games} = props

  // convert to arrays
  const playersArr = useMemo(() => Object.values(players), [players])
  const gamesArr = useMemo(() => Object.values(games), [games])

  // setup reducer
  const [state, dispatch] = useReducer<RecordReducer>(
    Record.createReducer(games), Record.init(playersArr.map(p => p.id!))
  )

  const [isPending, startTransition] = useTransition()

  const data = coerceState(state)

  // game
  const game = state.gameId
    ? games[state.gameId]
    : undefined
  
  // render
  return (
    <div>
      {renderBaseForm(gamesArr, state, dispatch)}

      {game?.type === GameType.VS &&
        renderVs(props, state, dispatch)
      }

      {game?.type === GameType.COOP &&
        renderCoop(state, dispatch)
      }

      <button disabled={isPending || !data} onClick={() => startTransition(() => { recordPlaythrough(data!) })}>
        Save
      </button>
    </div>
  )
}


//
// rendering
// =========


// render base form
function renderBaseForm(games: ReadonlyArray<GameData>, state: Record.State, dispatch: Dispatch<Record.Action>) {

  const { playedOn, gameId } = state

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
    </>
  )
}

function renderVs(
  props: RecordData,
  state: Partial<VsPlaythroughData>,
  dispatch: Dispatch<Record.Action>
) {

  // player data collection
  const playerPlaying = (state.playerIds ?? [])
    .map(id => props.players[id])

  const scoreFor = (playerId: PlayerId) => {
    return (state as VsPlaythroughData).scores
      ?.find(s => s.playerId === playerId)
      ?.score
      .toString() ?? ''
  }
  
  // render
  return (
    <>
      {/* scores */}
      <div>
        <label>scores</label>
        {playerPlaying.map(player =>
          <div key={`score-${player.id}`}>
            <label>{player.name}</label>
            <input
              type="number"
              value={scoreFor(player.id!)}
              onChange={e => dispatch(Record.setPlayerScore(player.id!, toScore(e.target.value)))}
            />
          </div>
        )}
      </div>

      {/* winner */}
      <div>
        <label>winner</label>
        <select
          value={state.winnerId ?? ''}
          onChange={e => dispatch(Record.setVsWinner(e.target.value as PlayerId))}
        >
          <option value="" disabled>select winner...</option>
          {playerPlaying.map(player =>
            <option key={player.id} value={player.id}>{player.name}</option>  
          )}
        </select>
      </div>
    </>
  )
}

function renderCoop(
  state: Partial<CoopPlaythroughData>,
  dispatch: Dispatch<Record.Action>
) {

  return (
    <>
      {/* scores */}
      <div>
        <label>scores</label>
        <input
          type="number"
          value={state.score?.toString() ?? ''}
          onChange={e => dispatch(Record.setScore(toScore(e.target.value)))}
        />
      </div>

      {/* players won */}
      <div>
        <label>
          Players Won?
          <input
            type="checkbox"
            checked={state.playersWon ?? false}
            onChange={e => dispatch(Record.setCoopWinner(e.target.checked))}
          />
        </label>
      </div>
    </>
  )
}

function toScore(value: string): number | undefined {
  if (value === '') {
    return undefined
  }
  return Number.parseInt(value)
}

function coerceState(state: Record.State): VsPlaythroughData | CoopPlaythroughData | undefined {
  const coreDataValid =
    state.gameId !== undefined
    && state.playedOn !== undefined
    && state.playerIds !== undefined
    && state.playerIds.length > 0

  if (!coreDataValid) {
    return undefined
  }
  if (Object.hasOwn(state, 'winnerId') && (state as VsPlaythroughData).winnerId !== undefined) {
    return state as VsPlaythroughData
  }
  if (Object.hasOwn(state, 'playersWon') && (state as CoopPlaythroughData).playersWon !== undefined) {
    return state as CoopPlaythroughData
  }
}