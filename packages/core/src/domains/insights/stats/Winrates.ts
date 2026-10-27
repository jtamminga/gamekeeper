import type { NonNullableObject } from '@core'
import type { PlayerId } from '@services'
import type { PlayerWinrate } from './PlayerWinrate'


/**
 * Collection of player win rates for a vs game.
 * Exposes the individual rates and pre-computes the highest for quick access.
 */
export class Winrates {

  public readonly highest: PlayerWinrate | undefined

  public constructor(public readonly winrates: ReadonlyArray<PlayerWinrate>) {

    const definedWinrates = winrates.filter(winrate => winrate.winrate !== undefined) as Array<NonNullableObject<PlayerWinrate>>
    let highestWinrate = definedWinrates[0]
    for (let i = 1; i < definedWinrates.length; i++) {
      if (definedWinrates[i].winrate > highestWinrate.winrate) {
        highestWinrate = definedWinrates[i]
      }
    }

    this.highest = highestWinrate ?? winrates[0]
  }

  public for(id: PlayerId): PlayerWinrate | undefined {
    return this.winrates.find(winrate => winrate.player.id === id)
  }

  public winrateFor(id: PlayerId): number | undefined {
    return this.for(id)?.winrate
  }

}