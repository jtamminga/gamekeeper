import { LimitError } from '@core'
import { NewPlayerData, PlayerData, PlayerId } from '@services'
import type { GameplayDeps } from '../Gameplay'
import type { Player } from './Player'


const MAX_PLAYERS = 100


/**
 * Collection manager for all players.
 * Handles hydration, lookup, creation, and persistence.
 * Enforces a hard limit on the total number of players.
 */
export class Players {

  public constructor(
    private _deps: GameplayDeps
  ) { }

  public async hydrate(): Promise<Players> {
    await this._deps.repo.hydratePlayers()
    return this
  }

  public all(): ReadonlyArray<Player> {
    return this._deps.repo.players
  }

  public get(id: PlayerId): Player {
    return this._deps.repo.getPlayer(id)
  }

  public sortedBy(option: PlayerSortOption): ReadonlyArray<Player> {
    switch (option) {
      case 'recentlyPlayed':
        return this.sortByRecentlyPlayed()
    }
  }

  public async create(data: NewPlayerData): Promise<Player> {
    NewPlayerData.throwIfInvalid(data)
    if (this._deps.repo.players.length >= MAX_PLAYERS) {
      throw new LimitError(`Cannot create more than ${MAX_PLAYERS} players`)
    }

    return this._deps.repo.createPlayer(data)
  }

  public async save(player: Player): Promise<void> {
    const updatedData = player.toData()
    PlayerData.throwIfInvalid(updatedData)
    
    await this._deps.repo.updatePlayer(updatedData)
  }

  public toData(): ReadonlyArray<PlayerData> {
    return this.all().map(player => player.toData())
  }

  private sortByRecentlyPlayed(): ReadonlyArray<Player> {
    const playCount = new Map<Player, number>()
    const playthroughs = this._deps.repo.getPlaythroughs()

    // determine play count for each of the latest playthroughs
    for (const playthrough of playthroughs) {
      for (const player of playthrough.players) {
        const count = playCount.get(player) ?? 0
        playCount.set(player, count + 1)
      }
    }

    // get players ordered by play count
    const orderedPlayers = [...playCount.entries()]
      .sort(([,a], [,b]) => b - a)
      .map(([player]) => player)

    // return all players
    return [
      ...orderedPlayers,

      // add remaining players
      ...this.all().filter(player => !playCount.has(player))
    ]
  }

}


// types
export type PlayerSortOption =
 | 'recentlyPlayed'