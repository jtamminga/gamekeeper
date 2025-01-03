import { ApiServices } from '@gamekeeper/api-services'
import { GameKeeper, GameKeeperFactory } from '@gamekeeper/core'
import { GamekeeperViewService, ViewService } from '@gamekeeper/views'
import { StaticViewService } from './StaticViewService'


const apiUrl = import.meta.env.VITE_API_URL
if (apiUrl === undefined) {
  throw new Error('API_URL not defined')
}

const staticMode = import.meta.env.VITE_STATIC_DATA === 'true'

let gamekeeper: GameKeeper
let viewService: ViewService

if (staticMode) {
  viewService = new StaticViewService()
} else {
  const apiServices = new ApiServices(apiUrl)
  gamekeeper = GameKeeperFactory.create(apiServices)
  viewService = new GamekeeperViewService(gamekeeper)
}

async function initialize() {
  if (!staticMode) {
    await gamekeeper.gameplay.hydrate({ limit: 10 })
  }
}


export { initialize, gamekeeper, viewService }