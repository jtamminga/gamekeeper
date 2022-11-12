import fuzzy from 'fuzzy'
import inquirer, { QuestionCollection } from 'inquirer'
import inquirerPrompt from 'inquirer-autocomplete-prompt'
import { GameKeeperCommand } from '../../GameKeeperCommand'
import { Game, Player, PlayerId, Playthrough, VsGame, PlaythroughFactory, CoopGame } from 'gamekeeper-core'
import chalk from 'chalk'


// command
export default class PlaythroughCommand extends GameKeeperCommand {

  // description
  static description = 'record playthrough of game'

  // aliases
  static aliases = ['record']

  // initialize the auto complete plugin
  protected override async init(): Promise<void> {
    inquirer.registerPrompt('autocomplete', inquirerPrompt)
  }

  public async run(): Promise<void> {

    // get all games
    const game = await this.selectGameFlow()

    // get all games
    const players = await this.gamekeeper.players.all()
    
    let playthrough: Playthrough

    // vs game
    if (game instanceof VsGame) {
      const answers = await this.vsGameFlow(game)
      playthrough = await PlaythroughFactory.createVs({
        game, players, ...answers
      })
    }

    // coop game
    else if (game instanceof CoopGame) {
      const answers = await this.coopGameFlow(game)
      playthrough = await PlaythroughFactory.createCoop({
        game, players, ...answers
      })
    }

    // unsupported game type
    else {
      throw new Error('unsupported game')
    }

    // save the playthrough
    await this.gamekeeper.record(playthrough)

    this.success(`added playthough`)
  }

  /**
   * select game flow
   * this will ask user to select a game
   */
  private async selectGameFlow(): Promise<Game> {
    const games = await this.gamekeeper.games.all()

    // transform into choices for the prompt
    const gameChoices = games.map(game => ({
      value: game.id,
      name: game.name
    }))

    // define fuzzy search
    const search = (_: any, input: string | undefined) =>
      fuzzy
        .filter(input ?? '', gameChoices, { extract: el => el.name })
        .map(el => el.original)
    
    // prompt
    const { game: gameId } = await inquirer.prompt({
      // @ts-ignore
      type: 'autocomplete',
      name: 'game',
      source: search
    })

    // get game
    return games.find(game => game.id === gameId)!
  }

  /**
   * vs game flow
   * this will ask user to select winner and ask scores for each player
   */
  private async vsGameFlow(game: VsGame) {
    const players = await this.gamekeeper.players.all()
    const scores = new Map<Player, number>()

    // only ask for scoring if game requires it
    if (game.hasScoring) {
      // get scores for each player
      const scoreInputs: Record<PlayerId, number | undefined> = await inquirer.prompt(
        players.map(player => ({
          name: player.id,
          message: `${player.name}'s score`,
          ...numberOptions
        }))
      )

      // convert to record to map
      for (const [id, score] of Object.entries(scoreInputs)) {
        if (score === undefined) continue
        scores.set(players.find(p => p.id === id)!, Number(score))
      }
    }

    // try to determine winner
    let winner: Player | undefined
    if (scores.size === players.length) {
      winner = game.determineWinnerFrom(scores)
    }

    // if no winner than ask user for winner
    if (!winner) {
      const winnerInput = await inquirer.prompt({
        type: 'list',
        name: 'winner',
        choices: players.map(p => ({ value: p, name: p.name }))
      })

      winner = winnerInput.winner as Player
    }

    return {
      winner,
      scores: scores.size === 0 ? undefined : scores
    }
  }

  private async coopGameFlow(game: CoopGame) {

    // ask if players won
    const {win} = await inquirer.prompt<{ win: boolean }>({
      type: 'confirm',
      name: 'win'
    })

    // ask for scoring if applicable
    let score: number | undefined
    if (game.hasScoring) {
      const scoreInput = await inquirer.prompt({
        name: 'score',
        ...numberOptions
      })
      score = scoreInput.score
    }

    return {
      playersWon: win,
      score
    }
  }

}


// prompt options for number input
const numberOptions: QuestionCollection<any> = {
  type: 'number',
  transformer: (score: string) =>
    isNaN(Number(score)) ? chalk.gray('(not provided)') : score,
  filter: (score: number) => isNaN(score) ? undefined : score
}