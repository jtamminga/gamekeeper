import { CliUx } from '@oclif/core'
import { format } from 'date-fns'
import { GameKeeperCommand } from '../../GameKeeperCommand'
import { Utils } from '../../utils'


// command
export default class ListPlaythroughs extends GameKeeperCommand {
  static description = 'list latest playthroughs'

  public async run(): Promise<void> {
    const [playthroughs, games, players] = await Promise.all([
      this.gamekeeper.playthroughs.all({ limit: 10 }),
      this.gamekeeper.games.asMap(),
      this.gamekeeper.players.asMap()
    ])

    if (playthroughs.length === 0) {
      this.muted('(no playthroughs)')
    }

    const data = playthroughs.map(playthrough => {

      return {
        game: games.get(playthrough.gameId)!,
        playthrough
      }
    })

    CliUx.ux.table(data, {
      game: {
        get: row => row.game.name
      },
      played: {
        get: row => format(row.playthrough.playedOn, 'MMM d, yyyy')
      },
      winner: {
        get: row => Utils.winnerName(row.playthrough, players)
      }
    })
  }
}