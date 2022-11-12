import { Command, Config } from '@oclif/core'
import chalk from 'chalk'
import { GameKeeper, GameKeeperFactory } from 'gamekeeper-core'
import path from 'path'


// base command
export abstract class GameKeeperCommand extends Command {

  protected gamekeeper: GameKeeper

  constructor(argv: string[], config: Config) {
    super(argv, config)
    console.log('db path:', process.env.DB_PATH)
    const fullPath = path.normalize(process.env.DB_PATH!)
    this.gamekeeper = GameKeeperFactory.create(fullPath)
  }

  public success(message: string) {
    this.log(chalk.green('success') + ' ' + message)
  }

  public muted(message: string) {
    this.log(chalk.gray(message))
  }

}