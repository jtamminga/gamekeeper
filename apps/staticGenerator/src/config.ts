import 'dotenv/config'


export type AppConfig = {
  dbPath: string
}


if (process.env.DB_PATH === undefined) {
  throw new Error('database path not specified')
}


export const config: AppConfig = {
  dbPath: process.env.DB_PATH
}