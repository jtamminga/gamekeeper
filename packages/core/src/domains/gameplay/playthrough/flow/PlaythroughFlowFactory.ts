import { CoopFlow } from './CoopFlow'
import { PlaythroughFlow } from './PlaythroughFlow'
import { VsFlow } from './VsFlow'
import { VsGame, CoopGame } from '../../game'
import type { GameplayDeps } from '@domains/gameplay'
import type { NewBasePlaythroughData } from '@services'


export namespace PlaythroughFlowFactory {

  export function create(deps: GameplayDeps, data: NewBasePlaythroughData): PlaythroughFlow {
    
    const game = deps.repo.getGame(data.gameId)
    const players = deps.repo.getPlayers(data.playerIds)

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