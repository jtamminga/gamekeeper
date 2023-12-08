import { GameKeeperDeps } from '@core'
import { VsGame } from '@domains'
import { GameId, PlayerId } from '@services'
import { VsFlow } from './VsFlow'


export type PlaythroughFlowData = {
  deps: GameKeeperDeps
  playedOn: Date
  gameId: GameId
  playerIds: PlayerId[]
}


export namespace PlaythroughFlow {

  export function create(data: PlaythroughFlowData) {
    const game = data.deps.store.getGame(data.gameId)
    if (game instanceof VsGame) {
      return new VsFlow({ ...data, scoring: game.scoring })
    }
  }


}