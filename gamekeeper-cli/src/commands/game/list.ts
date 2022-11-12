import chalk from 'chalk'
import { format } from 'date-fns'
import { CliUx } from '@oclif/core'
import { CoopStatsData, Game, GameType, Player, PlayerId, StatsData, VsStatData } from 'gamekeeper-core'
import { GameKeeperCommand } from '../../GameKeeperCommand'


// types
type RowData = {
  game: Game,
  stats: StatsData
}


// command
export default class ListGames extends GameKeeperCommand {
  static description = 'list all the games'

  public async run(): Promise<void> {
    const {args, flags} = await this.parse(ListGames)

    // get data
    const [games, players] = await Promise.all([
      this.gamekeeper.games.all(),
      this.gamekeeper.players.asMap()
    ])

    if (games.length === 0) {
      this.muted('(no games)')
      return
    }

    // convert to simple data
    const data: RowData[] = games.map(game => {
      const stats = game.getStats().getData()

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
        get: row => higestWinrate(row, players)
      }
    })
  }
}


// helpers
function higestWinrate({game, stats}: RowData, players: ReadonlyMap<PlayerId, Player>): string {
  if (stats.playCount === 0) {
    return chalk.gray.italic('no plays')
  }

  if (game.type === GameType.COOP) {
    const {playersWinrate} = stats as CoopStatsData
    return 'players: ' + chalk.bold(Math.round(playersWinrate * 100) + '%')
  }
  else if (game.type === GameType.VS) {
    const vsStats = stats as VsStatData
    const { playerId, winrate } = vsStats.bestWinrate!
    const player = players.get(playerId)!
    return player.name + ': ' + chalk.bold(Math.round(winrate * 100) + '%')
  }
  else {
    throw new Error('unsupported game type')
  }
}
