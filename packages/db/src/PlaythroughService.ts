import { DbService } from './DbService'
import { BasePlaythroughData, CoopPlaythroughData, GameId, GameType, NewPlaythroughData, NotFoundError, PlayerId, PlaythroughData, PlaythroughId, PlaythroughQueryOptions, PlaythroughService, ScoreData, VsPlaythroughData } from '@gamekeeper/core'
import { UserId, whereUserId } from './User'


// type
export interface DbPlaythroughDto {
  id: number
  gameId: number
  gameType: number
  playedOn: string
  result: number | null // player id or 1 for win 
  players: string // json
  scores: string | null // json
}
type DbScoreDto = {
  id: string
  s: number
}


// repository
export class DbPlaythroughService extends DbService implements PlaythroughService {

  public async getPlaythrough(id: PlaythroughId, userId?: UserId): Promise<PlaythroughData> {
    const query = `
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
      WHERE p.id=? AND p.${whereUserId(userId)}
    `

    const dto = await this._dataService.get<DbPlaythroughDto>(query, id, userId)
    if (!dto) {
      throw new NotFoundError(`cannot find game with id "${id}"`)
    }
    
    return this.toData(dto)
  }

  public async getPlaythroughs(
    options: PlaythroughQueryOptions = {},
    userId?: UserId
  ): Promise<readonly PlaythroughData[]> {

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

    const conditions: string[] = [`p.${whereUserId(userId, ':user_id')}`]
    if (fromDate) {
      conditions.push('p.played_on >= :from_date')
    }
    if (toDate) {
      conditions.push('p.played_on <= :to_date')
    }
    if (gameId) {
      conditions.push('p.game_id = :game_id')
    }
    query += ' WHERE ' + conditions.join(' AND ')
    query += ' ORDER BY p.played_on DESC'
    if (limit) {
      query += ' LIMIT :limit'
    }

    // execute query
    const dtos = await this._dataService.all<DbPlaythroughDto>(query, {
      ':limit': limit,
      ':from_date': fromDate?.toISOString(),
      ':to_date': toDate?.toISOString(),
      ':game_id': gameId,
      ':user_id': userId
    })

    return dtos.map(dto => this.toData(dto))
  }

  public async addPlaythrough(playthrough: NewPlaythroughData, userId?: UserId): Promise<PlaythroughData> {
    const dto = this.toDto(playthrough)

    const query = `
      INSERT INTO playthroughs
      (user_id, game_id, played_on, players, scores, result)
      VALUES (?, ?, ?, ?, ?, ?)
    `

    const values = [
      userId,
      dto.gameId,
      dto.playedOn,
      dto.players,
      dto.scores,
      dto.result
    ]

    const id = await this._dataService.insert(query, ...values)
    return this.toData({ ...dto, id })
  }

  public async removePlaythrough(id: PlaythroughId, userId?: UserId): Promise<void> {
    const query = `DELETE FROM playthroughs WHERE id=? AND ${whereUserId(userId)}`
    return this._dataService.run(query, id, userId)
  }

  private toData(playthrough: DbPlaythroughDto): PlaythroughData {
    const basePlaythrough: BasePlaythroughData = {
      id: playthrough.id.toString() as PlaythroughId,
      gameId: playthrough.gameId.toString() as GameId,
      playerIds: JSON.parse(playthrough.players) as PlayerId[],
      playedOn: new Date(playthrough.playedOn),
    }
  
    if (playthrough.gameType === GameType.VS) {
      return {
        ...basePlaythrough,
        type: 'vs',
        winnerId: playthrough.result === null
          ? null
          : playthrough.result.toString() as PlayerId,
        scores: playthrough.scores
          ? this.parseScores(playthrough.scores)
          : undefined
      } satisfies VsPlaythroughData
    }
  
    if (playthrough.gameType === GameType.COOP) {
      return {
        ...basePlaythrough,
        type: 'coop',
        playersWon: playthrough.result === 1,
        score: playthrough.scores === null
          ? undefined
          : Number.parseInt(playthrough.scores)
      } satisfies CoopPlaythroughData
    }
  
    throw new Error(`unsupported game type "${playthrough.gameType}"`)
  }
  
  private toDto(playthrough: NewPlaythroughData): Omit<DbPlaythroughDto, 'id'> {
    const base = {
      gameId: Number(playthrough.gameId),
      playedOn: playthrough.playedOn.toISOString(),
      players: JSON.stringify(playthrough.playerIds)
    }
  
    if (VsPlaythroughData.guardNew(playthrough)) {
      return {
        ...base,
        gameType: GameType.VS,
        result: playthrough.winnerId === null
          ? null
          : parseInt(playthrough.winnerId),
        scores: playthrough.scores
          ? this.serializeScores(playthrough.scores)
          : null
      }
    }
    else {
      return {
        ...base,
        gameType: GameType.COOP,
        result: playthrough.playersWon ? 1 : 0,
        scores: playthrough.score?.toString() ?? null
      }
    }
  }
  
  private serializeScores(scores: readonly ScoreData[]): string {
    return JSON.stringify(scores.map<DbScoreDto>(score => ({
      id: score.playerId,
      s: score.score
    })))
  }
  
  private parseScores(scores: string): readonly ScoreData[] {
    const collection = JSON.parse(scores) as DbScoreDto[]
    return collection.map(score => ({playerId: score.id as PlayerId, score: score.s}))
  }
  
}