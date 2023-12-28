import fuzzy from 'fuzzy'
import inquirer, { QuestionCollection } from 'inquirer'
import inquirerPrompt from 'inquirer-autocomplete-prompt'
import { GameKeeperCommand } from '../../GameKeeperCommand'
import { Game, PlayerId, StatsData, ArrayUtils, Scores, GameId, VsFlow, CoopFlow } from '@gamekeeper/core'
import chalk from 'chalk'
import { format, isMatch, parse } from 'date-fns'


// constants
const DATE_FORMAT = 'yyyy-MM-dd'


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

    // hydrate players and games
    await Promise.all([
      this.gamekeeper.players.hydrate(),
      this.gamekeeper.games.hydrate()
    ])

    // get the date played on
    const playedOn = await this.selectDateFlow()

    // get all games
    const gameId = await this.selectGameFlow()

    // // hydrate playthroughs for selected game
    // await this.gamekeeper.playthroughs.hydrate({ gameId })

    // get player ids
    const playerIds = this.gamekeeper.players.all()
      .map(player => player.id!)

    const flow = this.gamekeeper.playthroughs.startFlow({
      gameId,
      playedOn,
      playerIds
    })

    // vs game
    if (flow instanceof VsFlow) {
      await this.vsGameFlow(flow)
    }

    // coop game
    else if (flow instanceof CoopFlow) {
      await this.coopGameFlow(flow)
    }

    // unsupported game type
    else {
      throw new Error('unsupported game')
    }

    // add playthrough
    this.gamekeeper.playthroughs.create(flow.build())

    // show successfully saved
    this.success(`added playthough`)
  }

  private async selectDateFlow(): Promise<Date> {

    // current date & time
    const now = new Date()
    const nowFormatted = format(now, DATE_FORMAT)

    // ask player to enter date, default to today
    const {playedOn} = await inquirer.prompt<{playedOn: string}>({
      type: 'input',
      name: 'playedOn',
      message: 'played on',
      validate: validateDate,
      default: nowFormatted
    })

    // if the default value is provided then use "now"
    if (playedOn === nowFormatted) {
      return now
    }

    // otherwise convert input to a date
    return parse(playedOn, DATE_FORMAT, now)
  }

  /**
   * select game flow
   * this will ask user to select a game
   */
  private async selectGameFlow(): Promise<GameId> {
    
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
    return gameId
  }

  /**
   * vs game flow
   * this will ask user to select winner and ask scores for each player
   */
  private async vsGameFlow(flow: VsFlow) {

    const scores = new Scores()
    const players = await this.gamekeeper.players.all()

    // only ask for scoring if game requires it
    if (flow.game.hasScoring) {
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

      flow.setScores(scores)
    }
    
    // show winner if not explicity inputed
    if (flow.winner) {
      this.log(
        chalk.green('> ')
        + chalk.bold('winner: ')
        + chalk.cyanBright(flow.winner.name)
      )
    }

    // if no winner than ask user for winner
    else {
      const winnerInput = await inquirer.prompt({
        type: 'list',
        name: 'winner',
        choices: players.map(p => ({ value: p.id, name: p.name }))
      })

      flow.setWinner(winnerInput.winner)
    }
  }

  /**
   * coop game flow
   * this will ask user who won, game or players
   */
  private async coopGameFlow(flow: CoopFlow) {

    // ask if players won
    const {win} = await inquirer.prompt<{ win: boolean }>({
      type: 'confirm',
      name: 'win'
    })
    flow.setPlayersWon(win)

    // ask for scoring if applicable
    if (flow.game.hasScoring) {
      const scoreInput = await inquirer.prompt({
        name: 'score',
        ...numberOptions
      })
      flow.setScore(scoreInput.score)
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

// validate if date string is valid
function validateDate(input: string): boolean | string {
  return isMatch(input, DATE_FORMAT) || 'please enter a valid date'
}