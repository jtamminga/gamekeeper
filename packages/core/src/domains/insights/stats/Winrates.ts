import { Winrate } from './Winrate'
import type { InsightsDeps } from '../Insights'
import type { PlayerId, WinrateDto } from '@services'


export class Winrates {

  public constructor(public readonly winrates: ReadonlyArray<Winrate>) { }

  public get highest(): Winrate | undefined {
    let highestWinrate = this.winrates[0]
    for (let i = 1; i < this.winrates.length; i++) {
      if (this.winrates[i].winrate > highestWinrate.winrate) {
        highestWinrate = this.winrates[i]
      }
    }

    return highestWinrate
  }

  public for(id: PlayerId): Winrate | undefined {
    return this.winrates.find(winrate => winrate.player.id === id)
  }

  public winrateFor(id: PlayerId): number | undefined {
    return this.for(id)?.winrate
  }

  public static from(winrates: ReadonlyArray<WinrateDto>, deps: InsightsDeps): Winrates {
    return new Winrates(winrates.map(winrate => new Winrate(winrate, deps)))
  }

}