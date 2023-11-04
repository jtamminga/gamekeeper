import type { GameKeeperDeps } from '@core'
import { CoopGame, Game, VsGame } from '@domains'
import { type GameDto, GameType } from '@services'


// factory
export namespace GameFactory {

  export function create(deps: GameKeeperDeps, { type, ...data }: GameDto): Game {

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