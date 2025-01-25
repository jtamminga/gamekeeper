import 'dotenv/config'


export type AppConfig = {
  port: string
  dbPath: string
  authEnabled: boolean
  auth0?: {
    audience: string
    issuerBaseURL: string
  }
  httpsEnabled: boolean
  https?: {
    keyPath: string
    certPath: string
    caPath: string
  }
}


const {
  PORT,
  DB_PATH,
  AUTH_ENABLED,
  AUTH0_AUDIENCE,
  AUTH0_ISSUER_BASE_URL,
  HTTPS_ENABLED,
  PRIVATE_KEY_PATH,
  CERTIFICATE_PATH,
  CA_PATH
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
  httpsEnabled: HTTPS_ENABLED === 'true'
}

if (config.authEnabled) {
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

if (config.httpsEnabled) {
  if (PRIVATE_KEY_PATH === undefined) {
    throw new Error('PRIVATE_KEY_PATH not defined')
  }
  if (CERTIFICATE_PATH === undefined) {
    throw new Error('CERTIFICATE_PATH not defined')
  }
  if (CA_PATH === undefined) {
    throw new Error('CA_PATH not defined')
  }

  config.https = {
    keyPath: PRIVATE_KEY_PATH,
    certPath: CERTIFICATE_PATH,
    caPath: CA_PATH
  }
}

export { config }