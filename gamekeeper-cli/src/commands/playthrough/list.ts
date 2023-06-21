import { CliUx } from '@oclif/core'
import { format } from 'date-fns'
import { GameKeeperCommand } from '../../GameKeeperCommand'


// command
export default class ListPlaythroughs extends GameKeeperCommand {

  // description
  static description = 'list latest playthroughs'

  public async run(): Promise<void> {
    
    await this.gamekeeper.hydrate({ limit: 10 })

    const playthroughs = this.gamekeeper.playthroughs.all()

    if (playthroughs.length === 0) {
      this.muted('(no playthroughs)')
    }

    const data = playthroughs.map(playthrough => ({
      playthrough
    }))

    CliUx.ux.table(data, {
      game: {
        get: row => row.playthrough.game.name
      },
      played: {
        get: row => format(row.playthrough.playedOn, 'MMM d, yyyy')
      },
      winner: {
        get: row => row.playthrough.winnerName
      }
    })
  }
}