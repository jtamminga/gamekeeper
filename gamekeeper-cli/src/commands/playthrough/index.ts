import fuzzy from 'fuzzy'
import inquirer, { QuestionCollection } from 'inquirer'
import inquirerPrompt from 'inquirer-autocomplete-prompt'
import { GameKeeperCommand } from '../../GameKeeperCommand'
import { Game, PlayerId, Playthrough, VsGame, CoopGame, StatsData, isVsStatsData, ArrayUtils, Scores, ScoreData, GameKeeper } from 'gamekeeper-core'
import chalk from 'chalk'
import { Utils } from '../../utils'
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
    const game = await this.selectGameFlow()

    // hydrate playthroughs for selected game
    await this.gamekeeper.playthroughs.hydrate({ gameId: game.id })

    // get player ids
    const playerIds = this.gamekeeper.players.all()
      .map(player => player.id!)

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


      playthrough = await game.record({
        playerIds,
        playedOn,
        ...answers
      })
      explicitWinner = winnerSet
    }

    // coop game
    else if (game instanceof CoopGame) {
      const answers = await this.coopGameFlow(game)
      playthrough = await game.record({
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
        + chalk.cyanBright(playthrough.winnerName)
      )
    }

    // show successfully saved
    this.success(`added playthough`)

    // create stats data
    const stats = game
      .createStats()
      .getData()

    // show stats summary
    this.showStats(stats)
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
    const scores: ScoreData[] = []
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
        scores.push({ playerId: id as PlayerId, score: Number(score) })
      }
    }

    // try to determine winner
    let winnerId: PlayerId | undefined
    if (scores.length === players.length) {
      winnerId = game.determineWinner(new Scores(scores)).playerId
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
      scores: scores.length === 0 ? undefined : scores,
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

  private showStats(stats: StatsData) {
    this.log()
    this.log(chalk.cyanBright('latest stats:'))

    // play count
    this.logItem('plays', stats.playCount)

    // show best win rate
    const {winner, winrate} = Utils.winrate(stats, this.gamekeeper)
    this.logItem('winrate', `${chalk.underline(winner)} ${winrate}`)

    // winsteak info if any
    const winstreak = this.winstreakDesc(stats)
    if (winstreak) {
      this.logItem('streak', winstreak)
    }
  }

  private winstreakDesc(stats: StatsData): string | undefined {
    if (!isVsStatsData(stats)) {
      return
    }

    const numStreaks = stats.winstreaks.length

    const lastStreak = ArrayUtils.last(stats.winstreaks)
    if (lastStreak) {
      const {playerId, streak} = lastStreak
      const playerName = this.gamekeeper.players.get(playerId).name
      if (streak > 1) {
        return `${chalk.underline(playerName)} has a winstreak of ${chalk.yellow(streak)}!`
      }
    } 

    if (numStreaks >= 2) {
      const last = stats.winstreaks[numStreaks - 1]
      const secondLast = stats.winstreaks[numStreaks - 2]
      if (last.streak === 1 && secondLast.streak > 1) {
        const lastPlayer = this.gamekeeper.players.get(last.playerId).name
        const secondLastPlayer = this.gamekeeper.players.get(secondLast.playerId).name
        return `${chalk.underline(lastPlayer)} stopped ${chalk.underline(secondLastPlayer)}'s winstreak of ${chalk.yellow(secondLast.streak)}!`
      }
    }
  }

  private logItem(label: string, value: string | number) {
    const padding = 10 - label.length
    this.log(
      chalk.green('> ')
      + chalk.bold(label) + ':'
      + Array(padding).join(' ')
      + value.toString()
    )
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