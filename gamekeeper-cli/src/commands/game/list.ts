import { CliUx, Command, Flags } from '@oclif/core'
import chalk from 'chalk'
import { GameKeeper, GameType, ScoringType } from 'gamekeeper'
import { GameKeeperCommand } from '../GameKeeperCommand'


export default class ListGames extends GameKeeperCommand {
  static description = 'list all the games'

  public async run(): Promise<void> {
    const {args, flags} = await this.parse(ListGames)

    // create root
    const gamekeeper = new GameKeeper()

    // get games
    const games = await gamekeeper.games.all()

    if (games.length === 0) {
      this.muted('(no games)')
      return
    }

    // convert to simple data
    const data = games.map(game => ({
      name: game.name,
      type: GameType[game.type],
      scoring: scoringToString(game.scoring)
    }))

    // put data into table
    CliUx.ux.table(data, {
      name: {},
      type: {}
    })
  }
}

function scoringToString(scoring: ScoringType): string {
  switch (scoring) {
    case ScoringType.HIGHEST_WINS:
      return 'highest wins'
    case ScoringType.LOWEST_WINS:
      return 'lowest wins'
    default:
      return chalk.gray('n/a')
  }
}
