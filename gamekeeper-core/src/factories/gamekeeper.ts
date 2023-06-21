import { GameKeeper } from '@domains'
import { DataBuilder, DataService, GameKeeperService } from '@services'


// factory
export namespace GameKeeperFactory {
  export function create(path: string) {

    const dataService = new DataService(path)
    const service = new GameKeeperService(dataService)
    const builder = new DataBuilder(service)

    return new GameKeeper({ service, builder })
  }
}