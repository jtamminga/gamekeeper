import type { PlayerId } from '@services'
import { HighestCoopWinrate } from './HighestCoopWinrate'
import type { PlayerWinrate } from './PlayerWinrate'
import type { Winrate } from './Winrate'


export class CoopWinrates {

  public readonly highest: HighestCoopWinrate

  public constructor(
    public readonly game: Winrate,
    public readonly players: Winrate,
    public readonly winrates: ReadonlyArray<PlayerWinrate>
  ) {

    // game winrate higher
    if (game.winrate > players.winrate) {
      this.highest = new HighestCoopWinrate('game', game.winrate, game.plays)
    }

    // players winrate higher
    else {
      this.highest = new HighestCoopWinrate('players', players.winrate, players.plays)
    }
  }

  public for(id: PlayerId): PlayerWinrate | undefined {
    return this.winrates.find(winrate => winrate.player.id === id)
  }

  public winrateFor(id: PlayerId): number | undefined {
    return this.for(id)?.winrate
  }

}