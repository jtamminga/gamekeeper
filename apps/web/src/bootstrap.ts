import { ApiServices } from '@gamekeeper/api-services'
import { GameKeeperFactory } from '@gamekeeper/core'


const apiServices = new ApiServices('http://localhost:3000')
const gamekeeper = GameKeeperFactory.create(apiServices)

export { gamekeeper }