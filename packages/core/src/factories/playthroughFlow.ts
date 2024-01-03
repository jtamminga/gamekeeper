import { GameKeeperDeps } from '@core'
import { CoopGame, NewBasePlaythroughData, VsGame } from '@domains'
import { CoopFlow, VsFlow } from '@flows'


export namespace PlaythroughFlowFactory {

  export function create(deps: GameKeeperDeps, data: NewBasePlaythroughData): VsFlow | CoopFlow {
    
    const game = deps.store.getGame(data.gameId)
    const players = deps.store.getPlayers(data.playerIds)

    if (game instanceof VsGame) {
      return new VsFlow(deps, data, game, players)
    }
    else if (game instanceof CoopGame) {
      return new CoopFlow(deps, data, game, players)
    }
    else {
      throw new Error('unsupported game type')
    }
    
  }

}