import { Player, PlayerId } from '@domains'


// type
export type PlayerMap = ReadonlyMap<PlayerId, Player>


// repo
export interface PlayerRepository {
  getPlayers(): Promise<readonly Player[]>
  getPlayersMap(): Promise<PlayerMap>
  addPlayer(player: Player): Promise<void>
  getPlayer(id: PlayerId): Promise<Player>
  findPlayers(ids: PlayerId[]): Promise<readonly Player[]>
}