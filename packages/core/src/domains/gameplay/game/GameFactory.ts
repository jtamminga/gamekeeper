import { CoopGame } from './CoopGame'
import { VsGame } from './VsGame'
import type { Game } from './Game'
import type { GameplayDeps } from '../Gameplay'
import { type GameData, GameType } from '@services'


// factory
export namespace GameFactory {

  export function create(deps: GameplayDeps, { type, ...data }: GameData): Game {

    if (type === GameType.VS) {
      return new VsGame(deps, data)
    }

    else if (type === GameType.COOP) {
      return new CoopGame(deps, data)
    }

    else {
      throw new Error('game factory: unsupported game type')
    }
  }

}