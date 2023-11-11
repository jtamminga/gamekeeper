import { Command, Config } from '@oclif/core'
import chalk from 'chalk'
import { DbServices } from 'db-service'
import { GameKeeper, GameKeeperFactory } from 'core'


// base command
export abstract class GameKeeperCommand extends Command {

  // protected gamekeeper: 
  protected gamekeeper: GameKeeper

  constructor(argv: string[], config: Config) {
    super(argv, config)

    const services = new DbServices('gamekeeper.db')
    this.gamekeeper = GameKeeperFactory.create(services)
  }

  public success(message: string) {
    this.log(chalk.green('success') + ' ' + message)
  }

  public muted(message: string) {
    this.log(chalk.gray(message))
  }

}