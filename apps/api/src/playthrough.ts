import {
  GameId,
  NewBasePlaythroughData,
  NewCoopPlaythroughData,
  NewPlaythroughData,
  NewVsPlaythroughData,
  NotFoundError,
  PlayerDto,
  PlayerId,
  PlaythroughQueryOptions,
  ScoreData,
  Scores,
  ScoringType,
  Services
} from '@gamekeeper/core'
import { Request } from 'express'


export type InternalApiPlaythroughDto = {
  gameId: GameId
  playerIds: ReadonlyArray<PlayerId>
  playedOn: string
  winnerId?: PlayerId
  scores?: ReadonlyArray<ScoreData>
  playersWon?: boolean
  score?: number
}
export type ExternalScoreData = {
  player: string
  score: number
}
export type ExternalApiPlaythroughDto = {
  game: string
  players: ReadonlyArray<string>
  playedOn?: string
  winner?: string // 
  playersWon?: boolean
  score?: number
  scores?: ReadonlyArray<ExternalScoreData>
}
export type ApiPlaythroughDto =
  | InternalApiPlaythroughDto
  | ExternalApiPlaythroughDto



export function toPlaythroughQueryOptions(req: Request): PlaythroughQueryOptions {
  const {limit, fromDate, toDate, gameId} = req.query
  
  const query: PlaythroughQueryOptions = {}
  if (typeof limit === 'string') {
    query.limit = Number.parseInt(limit)
  }
  if (typeof fromDate === 'string') {
    query.fromDate = new Date(fromDate)
  }
  if (typeof toDate === 'string') {
    query.toDate = new Date(toDate)
  }
  if (typeof gameId === 'string') {
    query.gameId = gameId as GameId
  }

  return query
}

export async function toNewPlaythroughData(
  dto: ApiPlaythroughDto,
  services: Pick<Services, 'playerService' | 'gameService'>
): Promise<NewPlaythroughData> {
  if (isInternalApi(dto)) {
    return fromInternal(dto)
  }
  else {
    return fromExternal(dto, services)
  }
}

export function fromInternal(dto: InternalApiPlaythroughDto): NewPlaythroughData {
  const baseData: NewBasePlaythroughData = {
    gameId: dto.gameId,
    playerIds: dto.playerIds,
    playedOn: new Date(dto.playedOn)
  }

  if (dto.winnerId !== undefined) {
    const vsData: NewVsPlaythroughData = {
      ...baseData,
      winnerId: dto.winnerId
    }
    if (dto.scores !== undefined) {
      vsData.scores = dto.scores
    }
    return vsData
  }

  else if (dto.playersWon !== undefined) {
    const coopData: NewCoopPlaythroughData = {
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

export async function fromExternal(
  dto: ExternalApiPlaythroughDto,
  services: Pick<Services, 'playerService' | 'gameService'>
): Promise<NewPlaythroughData> {

  const [allGames, allPlayers] = await Promise.all([
    services.gameService.getGames(),
    services.playerService.getPlayers()
  ])

  const game = allGames.find(game =>
    game.name.toLowerCase() === dto.game.toLowerCase())

  if (!game) {
    throw new NotFoundError(`cannot find game with name "${dto.game}"`)
  }

  function findPlayer(name: string): PlayerDto {
    const player = allPlayers.find(player =>
      player.name.toLowerCase() === name.toLowerCase())

    if (!player) {
      throw new NotFoundError(`cannot find player with name "${name}"`)
    }

    return player
  }

  const players = dto.players.map(playerName => findPlayer(playerName))

  const baseData: NewBasePlaythroughData = {
    gameId: game.id,
    playerIds: players.map(p => p.id),
    playedOn: dto.playedOn ? new Date(dto.playedOn) : new Date()
  }

  if (dto.winner !== undefined) {
    const vsData: NewVsPlaythroughData = {
      ...baseData,
      winnerId: findPlayer(dto.winner).id
    }
    if (dto.scores !== undefined) {
      vsData.scores = dto.scores.map(({ player, score }) => ({
        playerId: findPlayer(player).id,
        score
      }))
    }
    return vsData
  }
  else if (dto.scores !== undefined) {
    const scores = new Scores(dto.scores.map(({ player, score }) => ({
      playerId: findPlayer(player).id,
      score
    })))

    if (game.scoring === ScoringType.NO_SCORE) {
      throw new Error('no scoring for this game')
    }

    return {
      ...baseData,
      winnerId: scores.winner(game.scoring),
      scores: scores.toData()
    }
  }
  else if (dto.playersWon !== undefined) {
    const coopData: NewCoopPlaythroughData = {
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

export function isInternalApi(dto: ApiPlaythroughDto): dto is InternalApiPlaythroughDto {
  if (Object.hasOwn(dto, 'gameId') && Object.hasOwn(dto, 'playerIds')) {
    return true
  }
  else if (Object.hasOwn(dto, 'game') && Object.hasOwn(dto, 'players')) {
    return false
  }
  else {
    throw new Error('Invalid property combination')
  }
}