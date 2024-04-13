import { Games } from './game'
import { Players } from './player'
import { Playthroughs } from './playthrough'
import { Stats } from './stats'
import type { GameKeeperDeps } from '@core'
import type { PlaythroughQueryOptions } from '@services'


// game keeper
export class GameKeeper {
  
  public readonly games: Games
  public readonly players: Players
  public readonly playthroughs: Playthroughs
  public readonly stats: Stats

  public constructor(deps: GameKeeperDeps) {
    this.games = new Games(deps)
    this.players = new Players(deps)
    this.playthroughs = new Playthroughs(deps)
    this.stats = new Stats(deps)
  }

  public async hydrate(options?: PlaythroughQueryOptions): Promise<void> {
    const hydrations: Promise<any>[] = [
      this.players.hydrate(),
      this.games.hydrate()
    ]

    if (options) {
      hydrations.push(this.playthroughs.hydrate(options))
    }

    await Promise.all(hydrations)
  }

}