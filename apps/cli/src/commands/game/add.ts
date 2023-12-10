import chalk from 'chalk'
import { GameData, GameType, ScoringType } from '@gamekeeper/core'
import inquirer from 'inquirer'
import { GameKeeperCommand } from '../../GameKeeperCommand'


// command
export default class AddGame extends GameKeeperCommand {
  
  // description
  static description = 'add new game'

  public async run(): Promise<void> {

    // ask user questions
    const gameData = await inquirer.prompt<GameData>([
      {
        type: 'input',
        name: 'name',
        message: 'the name of the game'
      },
      {
        type: 'list',
        name: 'type',
        message: 'the type of game',
        choices: [
          { value: GameType.VS, name: 'verses' },
          { value: GameType.COOP, name: 'cooperative' }
        ]
      },
      {
        type: 'list',
        name: 'scoring',
        message: 'high or low score wins?',
        choices: [
          { value: ScoringType.HIGHEST_WINS, name: 'high score wins' },
          { value: ScoringType.LOWEST_WINS, name: 'low score wins' },
          { value: ScoringType.NO_SCORE, name: 'no scoring' }
        ]
      }
    ])

    // add game
    const game = await this.gamekeeper.games.create(gameData)

    // feedback
    this.success('added ' + chalk.bold.blue(game.name))
  }
}
