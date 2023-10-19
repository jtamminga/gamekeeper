import { GameKeeperDeps } from '@core'
import { PlaythroughQueryOptions } from '@services'
import { Games } from './game'
import { Players } from './player'
import { Playthroughs } from './playthrough'
import { Reports } from './report'


// game keeper
export class GameKeeper {
  
  public readonly games: Games
  public readonly players: Players
  public readonly playthroughs: Playthroughs
  public readonly reports: Reports

  public constructor(deps: GameKeeperDeps) {
    this.games = new Games(deps)
    this.players = new Players(deps)
    this.playthroughs = new Playthroughs(deps)
    this.reports = new Reports(this)
  }

  public async hydrate(options?: PlaythroughQueryOptions): Promise<void> {
    await Promise.all([
      this.players.hydrate(),
      this.games.hydrate(),
      this.playthroughs.hydrate(options)
    ])
  }

  public getSummary() {
    
  }

}