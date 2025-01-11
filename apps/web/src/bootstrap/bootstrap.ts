import { ApiServices } from '@gamekeeper/api-services'
import { GameKeeper, GameKeeperFactory } from '@gamekeeper/core'
import { GamekeeperViewService, ViewService } from '@gamekeeper/views'
import { useAuth0 } from '@auth0/auth0-react'


const apiUrl = import.meta.env.VITE_API_URL
if (apiUrl === undefined) {
  throw new Error('API_URL not defined')
}

const authEnabled = import.meta.env.VITE_AUTH === 'true'

let gamekeeper: GameKeeper
let viewService: ViewService

async function initialize(token?: string) {
  console.log('[bootstrap] initializing app')
  if (token) {
    console.log('[bootstrap] token:', token)
  }
  const apiServices = new ApiServices(apiUrl, token)
  gamekeeper = GameKeeperFactory.create(apiServices)
  viewService = new GamekeeperViewService(gamekeeper)

  await gamekeeper.gameplay.hydrate({ limit: 10 })
}

// function constants
// this is so that function instances don't change between renders
const NOOP = () => { }
const getAccessToken = () => Promise.resolve(undefined)

const useAuth = authEnabled
  ? useAuth0
  : () => ({
      isAuthenticated: true,
      isLoading: false,
      user: null,
      error: undefined,
      logout: NOOP,
      loginWithRedirect: NOOP,
      getAccessTokenSilently: getAccessToken,
    })

export { initialize, gamekeeper, viewService, authEnabled, useAuth }