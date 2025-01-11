import 'dotenv/config'


export type AppConfig = {
  port: string
  dbPath: string
  authEnabled: boolean
  auth0?: {
    audience: string
    issuerBaseURL: string
  }
}


const {
  PORT,
  DB_PATH,
  AUTH_ENABLED,
  AUTH0_AUDIENCE,
  AUTH0_ISSUER_BASE_URL
} = process.env

if (PORT === undefined) {
  throw new Error('PORT not specified')
}
if (DB_PATH === undefined) {
  throw new Error('DB_PATH not specified')
}

const config: AppConfig = {
  port: PORT,
  dbPath: DB_PATH,
  authEnabled: AUTH_ENABLED === 'true',
}

if (AUTH_ENABLED) {
  if (AUTH0_AUDIENCE === undefined) {
    throw new Error('AUTH0_AUDIENCE not defined')
  }
  if (AUTH0_ISSUER_BASE_URL === undefined) {
    throw new Error('AUTH0_ISSUER_BASE_URL not defined')
  }

  config.auth0 = {
    audience: AUTH0_AUDIENCE,
    issuerBaseURL: AUTH0_ISSUER_BASE_URL
  }
}

export { config }