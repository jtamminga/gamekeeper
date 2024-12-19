import { ApiServices } from '@gamekeeper/api-services'
import { GameKeeperFactory } from '@gamekeeper/core'
import { GamekeeperViewService, ViewService } from '@gamekeeper/views'


const apiUrl = import.meta.env.VITE_API_URL
if (apiUrl === undefined) {
  throw new Error('API_URL not defined')
}


const apiServices = new ApiServices(apiUrl)
const gamekeeper = GameKeeperFactory.create(apiServices)
const viewService: ViewService = new GamekeeperViewService(gamekeeper)


export { gamekeeper, viewService }