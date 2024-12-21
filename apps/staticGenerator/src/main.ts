import { GameKeeperFactory } from '@gamekeeper/core'
import { DbServices } from '@gamekeeper/db-services'
import { config } from './config'
import { GamekeeperViewService } from '@gamekeeper/views'
import { ViewGenerator } from './ViewGenerator'
import { FileResultHandler } from './FileResultHandler'


const services = new DbServices(config.dbPath)
const gamekeeper = GameKeeperFactory.create(services)
const viewService = new GamekeeperViewService(gamekeeper)
const resultHandler = new FileResultHandler('view-data')
const generator = new ViewGenerator(viewService, resultHandler)


async function main(): Promise<void> {
  await gamekeeper.gameplay.hydrate()
  await generator.generate()
}
main()