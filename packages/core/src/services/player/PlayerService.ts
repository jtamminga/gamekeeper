import type { NewPlayerData, PlayerData } from './PlayerData'


export interface PlayerService {

  addPlayer(player: NewPlayerData): Promise<PlayerData>

  getPlayers(): Promise<readonly PlayerData[]>
  
}
