import { Player, PlayerId } from '@domains'

export interface PlayerRepository {
  getPlayers(): Promise<readonly Player[]>
  getPlayersMap(): Promise<ReadonlyMap<PlayerId, Player>>
  addPlayer(player: Player): Promise<void>
  getPlayer(id: PlayerId): Promise<Player>
  findPlayers(ids: PlayerId[]): Promise<readonly Player[]>
}