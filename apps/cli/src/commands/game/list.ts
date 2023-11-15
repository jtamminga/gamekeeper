import chalk from 'chalk'
import { format } from 'date-fns'
import { CliUx } from '@oclif/core'
import { Game, GameStats } from 'core'
import { GameKeeperCommand } from '../../GameKeeperCommand'


// types
type RowData = {
  game: Game
  numPlaythroughs: number
  lastPlayed: string
  winrate: string
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

    const data: RowData[] = []
    for (const game of games) {
      const stats = this.gamekeeper.stats.forGame(game)
      const numPlaythroughs = await stats.getNumPlaythroughs()
      const lastPlayed = await stats.getLastPlaythrough()

      data.push({
        game,
        numPlaythroughs,
        lastPlayed: lastPlayed
          ? format(lastPlayed, 'MMM d, yyyy')
          : chalk.gray.italic('never'),
        winrate: 'not implemented'
      })
    }

    // put data into table
    CliUx.ux.table(data, {
      name: {
        get: row => row.game.name
      },
      plays: {
        get: row => row.numPlaythroughs
      },
      lastPlayed: {
        header: 'Last Played'
      },
      winrate: {}
    })
  }
}
