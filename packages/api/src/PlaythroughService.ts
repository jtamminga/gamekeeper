import {
  GameId,
  PlayerId,
  PlaythroughId,
  PlaythroughQueryOptions,
  PlaythroughService,
  ScoreData,
  PlaythroughData,
  BasePlaythroughData
} from '@gamekeeper/core'
import { ApiService } from './ApiService'
import { toCleanQuery } from './utils'
import { Route } from '@gamekeeper/views'


// types
interface ApiPlaythroughDto {
  // base
  id: string
  gameId: string
  playerIds: string[]
  type: string
  playedOn: string
  // vs
  scores?: ScoreData[]
  winnerId?: string | null
  // coop
  playersWon?: boolean
  score?: number
}


// playthrough service
export class ApiPlaythroughService extends ApiService implements PlaythroughService {

  public async getPlaythrough(id: PlaythroughId): Promise<PlaythroughData> {
    const playthrough = await this.apiClient.get<ApiPlaythroughDto>(`${Route.PLAYTHROUGHS}/${id}`)
    return this.transform(playthrough)
  }

  public async getPlaythroughs(options?: PlaythroughQueryOptions): Promise<readonly PlaythroughData[]> {
    const playthroughs = await this.apiClient.get<ApiPlaythroughDto[]>(Route.PLAYTHROUGHS, toCleanQuery(options))
    return playthroughs.map(this.transform)
  }

  public async addPlaythrough(playthrough: PlaythroughData): Promise<PlaythroughData> {
    const newPlaythrough = await this.apiClient.post<ApiPlaythroughDto>(Route.PLAYTHROUGHS, playthrough)
    return this.transform(newPlaythrough)
  }

  public async removePlaythrough(id: PlaythroughId): Promise<void> {
    return this.apiClient.delete(`${Route.PLAYTHROUGHS}/${id}`)
  }

  private transform(dto: ApiPlaythroughDto): PlaythroughData {
    const basePlaythrough: BasePlaythroughData = {
      id: dto.id as PlaythroughId,
      gameId: dto.gameId.toString() as GameId,
      playerIds: dto.playerIds as PlayerId[],
      playedOn: new Date(dto.playedOn),
    }
  
    if (dto.type === 'vs') {
      return {
        ...basePlaythrough,
        type: 'vs',
        winnerId: dto.winnerId! as PlayerId | null,
        scores: dto.scores
      }
    }
  
    else if (dto.type === 'coop') {
      return {
        ...basePlaythrough,
        type: 'coop',
        playersWon: dto.playersWon!,
        score: dto.score
      }
    }
  
    else {
      throw new Error(`supported playthrough type ${dto.type}`)
    }
  }

}