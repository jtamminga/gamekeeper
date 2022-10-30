import { GameKeeper } from '@domains'
import { DbGameRepository, DbPlayerRepository, DbPlaythroughRepository } from '@repos'
import { DataService } from '@services'


// factory
export namespace GameKeeperFactory {
  export function create(path: string): GameKeeper {

    const dataService = new DataService(path)

    return new GameKeeper({
      gameRepo: new DbGameRepository(dataService),
      playerRepo: new DbPlayerRepository(dataService),
      playthroughRepo: new DbPlaythroughRepository(dataService)
    })
  }
}