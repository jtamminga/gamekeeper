import { CoopPlaythroughData, GameId, GameType, PlayerId, PlaythroughDto, PlaythroughId, PlaythroughQueryOptions, PlaythroughService, ScoreDto, VsPlaythroughData } from '@gamekeeper/core'
import { ApiService } from './ApiService'
import { Route } from './Route'
import { toCleanQuery } from './utils'


// types
interface ApiPlaythroughDto {
  id: string
  gameId: string
  gameType: number
  playedOn: string
  result: number
  players: string[]
  scores: ScoreDto[]
}


// playthrough service
export class ApiPlaythroughService extends ApiService implements PlaythroughService {

  public async getPlaythroughs(options?: PlaythroughQueryOptions): Promise<readonly PlaythroughDto[]> {
    const playthroughs = await this.apiClient.get<ApiPlaythroughDto[]>(Route.PLAYTHROUGHS, toCleanQuery(options))
    return playthroughs.map(transform)
  }

  public async addPlaythrough(playthrough: VsPlaythroughData | CoopPlaythroughData): Promise<PlaythroughDto> {
    const newPlaythrough = await this.apiClient.post<ApiPlaythroughDto>(Route.PLAYTHROUGHS, playthrough)
    return transform(newPlaythrough)
  }

}


// helper
function transform(dto: ApiPlaythroughDto): PlaythroughDto {
  return {
    id: dto.id as PlaythroughId,
    gameId: dto.gameId as GameId,
    gameType: dto.gameType as GameType,
    playedOn: new Date(dto.playedOn),
    result: dto.gameType === GameType.VS
      ? dto.result.toString() as PlayerId
      : dto.result === 1,
    players: dto.players as PlayerId[],
    scores: dto.scores
  }
}