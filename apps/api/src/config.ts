import 'dotenv/config'


export type AppConfig = {
  port: string
  dbPath: string
  authEnabled: boolean
  auth0: {
    audience: string
    issuerBaseURL: string
  }
}


if (process.env.PORT === undefined) {
  throw new Error('port not specified')
}
if (process.env.DB_PATH === undefined) {
  throw new Error('database path not specified')
}


export const config: AppConfig = {
  port: process.env.PORT,
  dbPath: process.env.DB_PATH,
  authEnabled: process.env.AUTH_ENABLED === 'true',
  auth0: {
    audience: process.env.AUTH0_AUDIENCE!,
    issuerBaseURL: process.env.AUTH0_ISSUER_BASE_URL!
  }
}