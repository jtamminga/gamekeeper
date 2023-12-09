import { CoopPlaythroughData, GameId, GameType, PlayerId, PlaythroughDto, PlaythroughId, PlaythroughQueryOptions, PlaythroughService, ScoreDto, VsPlaythroughData } from '@gamekeeper/core'
import { DataService } from './DataService'


// type
export interface DbPlaythroughDto {
  id: number
  gameId: number
  gameType: number
  playedOn: string
  result: number // player id or 1 for win 
  players: string // json
  scores?: string // json
}
type SerializedScore = {
  id: string
  s: number
}




// repository
export class DbPlaythroughService implements PlaythroughService {

  public constructor(
    private _dataService: DataService
  ) { }

  public async getPlaythroughs(
    options: PlaythroughQueryOptions = {}
  ): Promise<readonly PlaythroughDto[]> {

    const {limit, fromDate, toDate, gameId} = options

    // build query
    let query = `
      SELECT
        p.id,
        p.game_id as "gameId",
        g.type as "gameType",
        p.played_on as "playedOn",
        p.players,
        p.scores,
        p.result
      FROM playthroughs p
      JOIN games g ON g.id = p.game_id
    `

    const conditions: string[] = []
    if (fromDate) {
      conditions.push('p.played_on >= :from_date')
    }
    if (toDate) {
      conditions.push('p.played_on <= :to_date')
    }
    if (gameId) {
      conditions.push('p.game_id = :game_id')
    }
    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ')
    }

    query += ' ORDER BY p.played_on DESC'
    if (limit) {
      query += ' LIMIT :limit'
    }

    // execute query
    const dtos = await this._dataService.all<DbPlaythroughDto>(query, {
      ':limit': limit,
      ':from_date': fromDate?.toISOString(),
      ':to_date': toDate?.toISOString(),
      ':game_id': gameId
    })

    return dtos.map(dto => toPlaythroughDto(dto))
  }

  public async addPlaythrough(playthrough: VsPlaythroughData | CoopPlaythroughData): Promise<PlaythroughDto> {
    const dto = toDto(playthrough)

    const query = `
      INSERT INTO playthroughs
      (game_id, played_on, players, scores, result)
      VALUES (?, ?, ?, ?, ?)
    `

    const values = [
      dto.gameId,
      dto.playedOn,
      dto.players,
      dto.scores,
      dto.result
    ]

    const id = await this._dataService.insert(query, ...values)
    return toPlaythroughDto({ ...dto, id })
  }
  
}


//
// helpers
// =======


function toPlaythroughDto(playthrough: DbPlaythroughDto): PlaythroughDto {
  const isVsPlaythrough = playthrough.gameType === GameType.VS
  return {
    id: playthrough.id.toString() as PlaythroughId,
    gameId: playthrough.gameId.toString() as GameId,
    gameType: playthrough.gameType as GameType,
    playedOn: new Date(playthrough.playedOn),
    result: isVsPlaythrough
      ? playthrough.result.toString() as PlayerId
      : playthrough.result === 1,
    players: JSON.parse(playthrough.players) as PlayerId[],
    scores: playthrough.scores
      ? isVsPlaythrough
        ? parseScores(playthrough.scores)
        : Number.parseInt(playthrough.scores)
      : undefined
  }
}

function parseScores(scores: string): readonly ScoreDto[] {
  const collection = JSON.parse(scores) as SerializedScore[]
  return collection.map(score => ({playerId: score.id as PlayerId, score: score.s}))
}

function toDto(playthrough: VsPlaythroughData | CoopPlaythroughData): Omit<DbPlaythroughDto, 'id'> {
  const base = {
    gameId: Number(playthrough.gameId),
    playedOn: playthrough.playedOn.toISOString(),
    players: JSON.stringify(playthrough.playerIds)
  }

  if (VsPlaythroughData.guard(playthrough)) {
    return {
      ...base,
      gameType: GameType.VS,
      result: Number(playthrough.winnerId),
      scores: playthrough.scores
        ? serializeScores(playthrough.scores)
        : undefined
    }
  }
  else {
    return {
      ...base,
      gameType: GameType.COOP,
      result: playthrough.playersWon ? 1 : 0,
      scores: playthrough.score?.toString()
    }
  }
}

function serializeScores(scores: readonly ScoreDto[]): string {
  return JSON.stringify(scores.map<SerializedScore>(score => ({
    id: score.playerId,
    s: score.score
  })))
}