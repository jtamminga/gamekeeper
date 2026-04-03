import type { PlayerId } from '@services'
import type { PlayerWinrate } from './PlayerWinrate'


export class Winrates {

  public constructor(public readonly winrates: ReadonlyArray<PlayerWinrate>) { }

  public get highest(): PlayerWinrate | undefined {
    let highestWinrate = this.winrates[0]
    for (let i = 1; i < this.winrates.length; i++) {
      if (this.winrates[i].winrate > highestWinrate.winrate) {
        highestWinrate = this.winrates[i]
      }
    }

    return highestWinrate
  }

  public for(id: PlayerId): PlayerWinrate | undefined {
    return this.winrates.find(winrate => winrate.player.id === id)
  }

  public winrateFor(id: PlayerId): number | undefined {
    return this.for(id)?.winrate
  }

}