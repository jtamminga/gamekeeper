import { CliUx } from '@oclif/core'
import { format } from 'date-fns'
import { CoopPlaythrough, Player, PlayerId, Playthrough, VsPlaythrough } from 'gamekeeper-core'
import { GameKeeperCommand } from '../../GameKeeperCommand'


// command
export default class ListPlaythroughs extends GameKeeperCommand {
  static description = 'list latest playthroughs'

  public async run(): Promise<void> {
    const [playthroughs, games, players] = await Promise.all([
      this.gamekeeper.playthroughs.all(),
      this.gamekeeper.games.asMap(),
      this.gamekeeper.players.asMap()
    ])

    if (playthroughs.length === 0) {
      this.muted('(no games)')
    }

    const data = playthroughs.slice(0,10).map(playthrough => {

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
        get: row => winner(row.playthrough, players)
      }
    })
  }
}


// helpers
function winner(playthrough: Playthrough, players: ReadonlyMap<PlayerId, Player>): string {
  if (playthrough instanceof CoopPlaythrough) {
    return playthrough.playersWon
      ? 'players'
      : 'game'
  }
  else if (playthrough instanceof VsPlaythrough) {
    return players.get(playthrough.winnerId)!.name
  }
  else {
    throw new Error('unsupported playthrough type')
  }
}