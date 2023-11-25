import { CoopPlaythroughData, GameId, PlayerId, PlaythroughData, ScoreData, VsPlaythroughData } from 'core'


export type ApiPlaythroughDto = {
  gameId: GameId
  playerIds: ReadonlyArray<PlayerId>
  playedOn: string
  winnerId?: PlayerId
  scores?: ReadonlyArray<ScoreData>
  playersWon?: boolean
  score?: number
}

export function toPlaythroughData(dto: ApiPlaythroughDto): VsPlaythroughData | CoopPlaythroughData {
  const baseData: PlaythroughData = {
    gameId: dto.gameId,
    playerIds: dto.playerIds,
    playedOn: new Date(dto.playedOn)
  }

  if (dto.winnerId !== undefined) {
    const vsData: VsPlaythroughData = {
      ...baseData,
      winnerId: dto.winnerId
    }
    if (dto.scores !== undefined) {
      vsData.scores = dto.scores
    }
    return vsData
  }

  else if (dto.playersWon !== undefined) {
    const coopData: CoopPlaythroughData = {
      ...baseData,
      playersWon: dto.playersWon
    }
    if (dto.score !== undefined) {
      coopData.score = dto.score
    }
    return coopData
  }

  else {
    throw new Error('invalid playthrough data')
  }
}