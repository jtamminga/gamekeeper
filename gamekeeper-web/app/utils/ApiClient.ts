import { GameData } from 'gamekeeper-core'
import { GameApiResponse, RecordApiResponse, RecordData } from 'utils'



// constants
const API_URL = 'http://localhost:3000/api'


// service
export class ApiClient {

  public async getGames(): Promise<ReadonlyArray<GameData>> {
    const response = await fetch(`${API_URL}/games`)
    const data = await response.json() as GameApiResponse

    // return all games
    return data.games
  }

  public async getGame(id: string): Promise<GameData> {
    const response = await fetch(`${API_URL}/games?id=${id}`)
    const data = await response.json() as GameApiResponse

    // return just the single game that comes back
    return data.games[0]
  }

  public async getRecord(): Promise<RecordData> {
    const response = await fetch(`${API_URL}/record`)
    const data = await response.json() as RecordApiResponse
    return data
  }

}