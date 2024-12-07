import { Games } from './game'
import { Players } from './player'
import { Playthroughs } from './playthrough'
import type { Logger, PlaythroughQueryOptions } from '@services'
import type { GameplayRepository } from '@repos'


// type
export type GameplayDeps = {
  logger: Logger
  repo: GameplayRepository
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
    // first hydrate players and games,
    // they each are independent sets of data that don't relate to each other
    await Promise.all([
      this.players.hydrate(),
      this.games.hydrate(),
    ])

    // always hydrate playthroughs last,
    // playthrough data has relations to player and game data
    if (options) {
      await this.playthroughs.hydrate(options)
    }
  }

}