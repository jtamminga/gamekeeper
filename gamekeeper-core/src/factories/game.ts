import { CoopGame, Game, GameData, GameType, VsGame } from '@domains'


// factory
export namespace GameFactory {

  export function create({ type, ...data }: GameData): Game {

    if (type === GameType.VS) {
      return new VsGame(data)
    }

    else if (type === GameType.COOP) {
      return new CoopGame(data)
    }

    else {
      throw new Error('game factory: unsupported game type')
    }
  }

}