import { GameKeeperDeps } from '@core'
import { CoopGame, Game, GameId, GameType, VsGame } from '@domains'
import { GameDto } from '@services'


// factory
export namespace GameFactory {

  export function create(deps: GameKeeperDeps, { id: gameId, type, ...data }: GameDto): Game {
    const id = gameId.toString() as GameId

    if (type === GameType.VS) {
      return new VsGame(deps, {id, ...data})
    }

    else if (type === GameType.COOP) {
      return new CoopGame(deps, {id, ...data})
    }

    else {
      throw new Error('game factory: unsupported game type')
    }
  }

}