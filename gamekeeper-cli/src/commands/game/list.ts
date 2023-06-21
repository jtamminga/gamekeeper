import chalk from 'chalk'
import { format } from 'date-fns'
import { CliUx } from '@oclif/core'
import { Game, StatsData } from 'gamekeeper-core'
import { GameKeeperCommand } from '../../GameKeeperCommand'
import { Utils } from '../../utils'


// types
type RowData = {
  game: Game,
  stats: StatsData
}


// command
export default class ListGames extends GameKeeperCommand {

  // description
  static description = 'list all the games'

  public async run(): Promise<void> {

    // hydrate
    await this.gamekeeper.hydrate()

    // get games
    const games = this.gamekeeper.games.all()

    // return if no games
    if (games.length === 0) {
      this.muted('(no games)')
      return
    }

    // convert to simple data
    const data: RowData[] = games.map(game => {
      const stats = game.createStats().getData()

      return {
        game,
        stats
      }
    })

    // put data into table
    CliUx.ux.table(data, {
      name: {
        get: row => row.game.name
      },
      plays: {
        get: row => row.stats.playCount
      },
      lastPlayed: {
        header: 'Last Played',
        get: row => row.stats.lastPlayed
          ? format(row.stats.lastPlayed, 'MMM d, yyyy')
          : chalk.gray.italic('never')
      },
      winrate: {
        get: row => {
          if (row.stats.playCount === 0) {
            return chalk.gray.italic('no plays')
          }

          return 'not imp'

          // const { winner, winrate } = Utils.winrate(row.stats, players)
          // return `${winner}: ${winrate}`
        }
      }
    })
  }
}
