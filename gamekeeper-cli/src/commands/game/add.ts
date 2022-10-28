import chalk from 'chalk'
import { GameData, GameFactory, GameKeeper, GameType, ScoringType } from 'gamekeeper'
import inquirer from 'inquirer'
import { GameKeeperCommand } from '../GameKeeperCommand'


// command
export default class AddGame extends GameKeeperCommand {
  
  static description = 'describe the command here'

  static examples = [
    '<%= config.bin %> <%= command.id %>',
  ]

  public async run(): Promise<void> {

    // create root
    const gamekeeper = new GameKeeper()

    // ask user questions
    const gameData = await inquirer.prompt<GameFactory.CreateGameData>([
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

    // create game
    const game = GameFactory.create(gameData)

    // add game
    gamekeeper.games.add(game)

    // feedback
    this.success('added ' + chalk.bold.blue(game.name))
  }
}
