import { DataService } from '@services'
import { CoopPlaythrough, CoopPlaythroughData, GameId, GameType, PlayerId, Playthrough, PlaythroughData, PlaythroughId, ScoreData, VsPlaythrough, VsPlaythroughData } from 'domains'


// type
export interface PlaythroughDto {
  id: number
  gameId: string
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
export type PlaythroughQueryOptions = {
  limit?: number
  fromDate?: Date
  toDate?: Date
  gameId?: GameId
}



// repository
export class PlaythroughService {

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
    return this._dataService.all<PlaythroughDto>(query, {
      ':limit': limit,
      ':from_date': fromDate?.toISOString(),
      ':to_date': toDate?.toISOString(),
      ':game_id': gameId
    })
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
    return { ...dto, id }
  }
  
}


//
// helpers
// =======


function toDto(playthrough: VsPlaythroughData | CoopPlaythroughData): Omit<PlaythroughDto, 'id'> {
  const base = {
    gameId: playthrough.gameId,
    playedOn: playthrough.playedOn.toISOString(),
    players: JSON.stringify(playthrough.playerIds)
  }

  if (isVsPlaythroughData(playthrough)) {
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

function serializeScores(scores: readonly ScoreData[]): string {
  return JSON.stringify(scores.map<SerializedScore>(score => ({
    id: score.playerId,
    s: score.score
  })))
}

function isVsPlaythroughData(data: VsPlaythroughData | CoopPlaythroughData): data is VsPlaythroughData {
  return Object.hasOwn(data, 'winnerId')
}