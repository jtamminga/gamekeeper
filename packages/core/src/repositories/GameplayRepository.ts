import type { Game, Player, Playthrough } from '@domains/gameplay'
import type { GameId, NewGameData, NewPlayerData, NewPlaythroughData, PlayerId, PlaythroughId, PlaythroughQueryOptions } from '@services'


export interface GameplayRepository {

  // players
  players: ReadonlyArray<Player>
  hydratePlayers(): Promise<ReadonlyArray<Player>>
  getPlayer(id: PlayerId): Player
  getPlayers(ids: ReadonlyArray<PlayerId>): ReadonlyArray<Player>
  createPlayer(data: NewPlayerData): Promise<Player>
  updatePlayer(player: Player): Promise<void>

  // games
  games: ReadonlyArray<Game>
  hydrateGames(): Promise<ReadonlyArray<Game>>
  getGame(id: GameId): Game
  createGame(data: NewGameData): Promise<Game>
  updateGame(game: Game): Promise<void>
  
  // playthroughs
  playthroughs: ReadonlyArray<Playthrough>
  hydratePlaythroughs(options?: PlaythroughQueryOptions): Promise<ReadonlyArray<Playthrough>>
  getPlaythrough(id: PlaythroughId): Playthrough
  createPlaythrough<T extends Playthrough = Playthrough>(data: NewPlaythroughData): Promise<T>
  getPlaythroughs(options?: PlaythroughQueryOptions): ReadonlyArray<Playthrough>
  removePlaythrough(id: PlaythroughId): Promise<void>

}