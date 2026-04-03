import type { PlayerId } from '@services'
import type { GameWinrate } from './GameWinrate'
import type { PlayerWinrate } from './PlayerWinrate'


export class CoopWinrates {

  public constructor(
    public readonly gameWinrate: GameWinrate,
    public readonly winrates: ReadonlyArray<PlayerWinrate>
  ) { }

  public get highest(): PlayerWinrate | GameWinrate | undefined {
    const highestPlayer = this.winrates.reduce<PlayerWinrate | undefined>(
      (best, current) => best === undefined || current.winrate > best.winrate ? current : best,
      undefined
    )

    if (highestPlayer === undefined) {
      return this.gameWinrate
    }

    return highestPlayer.winrate > this.gameWinrate.winrate
      ? highestPlayer
      : this.gameWinrate
  }

  public for(id: PlayerId): PlayerWinrate | undefined {
    return this.winrates.find(winrate => winrate.player.id === id)
  }

  public winrateFor(id: PlayerId): number | undefined {
    return this.for(id)?.winrate
  }

}