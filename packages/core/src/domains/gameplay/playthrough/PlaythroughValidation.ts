import { InvalidState } from '@core'
import { NewBasePlaythroughData, NewPlaythroughData } from '@services'

export namespace PlaythroughValidation {
  export function startFlow(data: NewBasePlaythroughData) {
    if (!data.gameId) {
      throw new InvalidState('gameId')
    }
    if (!data.playedOn) {
      throw new InvalidState('playedOn')
    }
    if (!data.playerIds) {
      throw new InvalidState('playerIds')
    }
    if (data.playerIds.length === 0) {
      throw new InvalidState('playerIds', 'need at least one player')
    }
  }

  export function create(data: NewPlaythroughData) {
    startFlow(data)
    if (!data.type || (data.type !== 'coop' && data.type !== 'vs')) {
      throw new InvalidState('type')
    }
  }
}