import { Games } from './game'
import { Players } from './player'
import { Playthroughs } from './playthrough'
import type { Logger, PlaythroughQueryOptions } from '@services'
import type { Repository } from '@repos'


// type
export type GameplayDeps = {
  logger: Logger
  repo: Repository
}


// game keeper
export class Gameplay {
  
  public readonly games: Games
  public readonly players: Players
  public readonly playthroughs: Playthroughs

  public constructor(deps: GameplayDeps) {
    this.games = new Games(deps)
    this.players = new Players(deps)
    this.playthroughs = new Playthroughs(deps)
  }

  public async hydrate(options?: PlaythroughQueryOptions): Promise<void> {
    const hydrations: Promise<any>[] = [
      this.players.hydrate(),
      this.games.hydrate(),
    ]

    if (options) {
      hydrations.push(this.playthroughs.hydrate(options))
    }

    await Promise.all(hydrations)
  }

}