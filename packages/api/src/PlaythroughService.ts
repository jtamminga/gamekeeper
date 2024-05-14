import { CoopPlaythroughData, GameId, GameType, PlayerId, PlaythroughDto, PlaythroughId, PlaythroughQueryOptions, PlaythroughService, ScoreDto, VsPlaythroughData, Route } from '@gamekeeper/core'
import { ApiService } from './ApiService'
import { toCleanQuery } from './utils'


// types
interface ApiPlaythroughDto {
  id: string
  gameId: string
  gameType: number
  playedOn: string
  result: string | boolean | null
  players: string[]
  scores: ScoreDto[]
}


// playthrough service
export class ApiPlaythroughService extends ApiService implements PlaythroughService {

  public async getPlaythrough(id: PlaythroughId): Promise<PlaythroughDto> {
    const playthrough = await this.apiClient.get<ApiPlaythroughDto>(`${Route.PLAYTHROUGHS}/${id}`)
    return transform(playthrough)
  }

  public async getPlaythroughs(options?: PlaythroughQueryOptions): Promise<readonly PlaythroughDto[]> {
    const playthroughs = await this.apiClient.get<ApiPlaythroughDto[]>(Route.PLAYTHROUGHS, toCleanQuery(options))
    return playthroughs.map(transform)
  }

  public async addPlaythrough(playthrough: VsPlaythroughData | CoopPlaythroughData): Promise<PlaythroughDto> {
    const newPlaythrough = await this.apiClient.post<ApiPlaythroughDto>(Route.PLAYTHROUGHS, playthrough)
    return transform(newPlaythrough)
  }

  public async removePlaythrough(id: PlaythroughId): Promise<void> {
    return this.apiClient.delete(`${Route.PLAYTHROUGHS}/${id}`)
  }

}


// helper
function transform(dto: ApiPlaythroughDto): PlaythroughDto {
  return {
    id: dto.id as PlaythroughId,
    gameId: dto.gameId as GameId,
    gameType: dto.gameType as GameType,
    playedOn: new Date(dto.playedOn),
    result: transformResult(dto.result),
    players: dto.players as PlayerId[],
    scores: dto.scores
  }
}

function transformResult(result: ApiPlaythroughDto['result']): PlaythroughDto['result'] {
  if (typeof result === 'string') {
    return result as PlayerId
  }

  return result
}