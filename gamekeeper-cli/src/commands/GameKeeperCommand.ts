import { Command } from '@oclif/core'
import chalk from 'chalk'

export abstract class GameKeeperCommand extends Command {

  public success(message: string) {
    this.log(chalk.green('success') + ' ' + message)
  }

  public muted(message: string) {
    this.log(chalk.gray(message))
  }

}