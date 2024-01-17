import { ApiServices } from '@gamekeeper/api-services'
import { GameKeeperFactory } from '@gamekeeper/core'

const apiUrl = import.meta.env.VITE_API_URL
if (apiUrl === undefined) {
  throw new Error('API_URL not defined')
}

const apiServices = new ApiServices(apiUrl)
const gamekeeper = GameKeeperFactory.create(apiServices)

export { gamekeeper }