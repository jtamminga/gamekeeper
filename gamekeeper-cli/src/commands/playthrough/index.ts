import fuzzy from 'fuzzy'
import inquirer, { QuestionCollection } from 'inquirer'
import inquirerPrompt from 'inquirer-autocomplete-prompt'
import { GameKeeperCommand } from '../../GameKeeperCommand'
import { Game, PlayerId, Playthrough, VsGame, CoopGame, StatsData } from 'gamekeeper-core'
import chalk from 'chalk'
import { Utils } from '../../utils'


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

    // get all players
    const players = await this.gamekeeper.players.asMap()
    const playerIds = Array.from(players.keys())

    // assumed played today
    const playedOn = new Date()
    
    // if there is a winner explicity inputted
    let explicitWinner = false

    // create a playthrough
    let playthrough: Playthrough

    // vs game
    if (game instanceof VsGame) {
      const {
        explicitWinner: winnerSet,
        ...answers
      } = await this.vsGameFlow(game)
      playthrough = game.record({
        playerIds,
        playedOn,
        ...answers
      })
      explicitWinner = winnerSet
    }

    // coop game
    else if (game instanceof CoopGame) {
      const answers = await this.coopGameFlow(game)
      playthrough = game.record({
        playerIds,
        playedOn,
        ...answers
      })
      explicitWinner = true
    }

    // unsupported game type
    else {
      throw new Error('unsupported game')
    }

    // show winner if not explicity inputed
    if (!explicitWinner) {
      this.log(
        chalk.green('> ')
        + chalk.bold('winner: ')
        + chalk.cyanBright(Utils.winner(playthrough, players))
      )
    }

    // save the playthrough
    await this.gamekeeper.playthroughs.add(playthrough)

    // show successfully saved
    this.success(`added playthough`)

    // create stats data
    const stats = game
      .createStats()
      .getData()

    // show stats summary
    this.showSummary(stats)
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
    const scores = new Map<PlayerId, number>()
    // if winner is explicity inputted
    let explicitWinner = false

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
        scores.set(id as PlayerId, Number(score))
      }
    }

    // try to determine winner
    let winnerId: PlayerId | undefined
    if (scores.size === players.length) {
      winnerId = game.determineWinnerFrom(scores)
    }

    // if no winner than ask user for winner
    if (!winnerId) {
      const winnerInput = await inquirer.prompt({
        type: 'list',
        name: 'winner',
        choices: players.map(p => ({ value: p.id, name: p.name }))
      })

      winnerId = winnerInput.winner as PlayerId
      explicitWinner = true
    }

    return {
      winnerId,
      scores: scores.size === 0 ? undefined : scores,
      explicitWinner
    }
  }

  /**
   * coop game flow
   * this will ask user who won, game or players
   */
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

  private showSummary(stats: StatsData) {
    this.log()
    this.log(chalk.bold('latest stats:'))
    this.log(`plays:   ${stats.playCount}`)
    // const {winner, winrate} = Utils.winrate(stats, players)
    // this.log(`winrate: ${winner} ${winrate}`)
  }

}


// prompt options for number input
const numberOptions: QuestionCollection<any> = {
  type: 'number',
  transformer: (score: string) =>
    isNaN(Number(score)) ? chalk.gray('(not provided)') : score,
  filter: (score: number) => isNaN(score) ? undefined : score
}