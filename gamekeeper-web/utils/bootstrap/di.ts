import pathUtils from 'path'
import { GameKeeperFactory } from 'gamekeeper-core'
import * as dotenv from 'dotenv'

// parse and config dot env
dotenv.config({ override: true })

// resolve path
const path = pathUtils.resolve(process.env.DB_PATH!)

// create shared instances
export const gamekeeper = GameKeeperFactory.create(path)
