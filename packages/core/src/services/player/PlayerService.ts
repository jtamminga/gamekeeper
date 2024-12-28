import type { NewPlayerData, PlayerData, UpdatedPlayerData } from './PlayerData'


export interface PlayerService {

  addPlayer(player: NewPlayerData): Promise<PlayerData>

  getPlayers(): Promise<readonly PlayerData[]>

  updatePlayer(player: UpdatedPlayerData): Promise<PlayerData>
  
}
