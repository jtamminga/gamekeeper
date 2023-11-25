import 'dotenv/config'


export type AppConfig = {
  port: string
  dbPath: string
}


if (process.env.PORT === undefined) {
  throw new Error('port not specified')
}
if (process.env.DB_PATH === undefined) {
  throw new Error('database path not specified')
}


export const config: AppConfig = {
  port: process.env.PORT,
  dbPath: process.env.DB_PATH
}