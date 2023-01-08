import { DataService } from '@services'
import { CoopPlaythrough, Game, GameId, GameType, PlayerId, Playthrough, PlaythroughId, ScoreData, VsPlaythrough } from 'domains'
import { injectable } from 'tsyringe'
import { PlaythroughAllOptions, PlaythroughRepository } from './PlaythroughRepository'


// type
export interface PlaythroughDto {
  id: number
  gameId: number
  playedOn: string
  result: number // player id or 1 for win 
  players: string // json
  scores?: string // json
}
type SerializedScore = {
  id: string
  s: number
}
export interface PlaythroughWithGameDto extends PlaythroughDto {
  gameName: string
  gameType: number
}


// repository
@injectable()
export class DbPlaythroughRepository implements PlaythroughRepository {

  public constructor(
    private _dataService: DataService
  ) { }

  public static create(dto: PlaythroughWithGameDto): Playthrough {

    // grab values
    const id = dto.id.toString() as PlaythroughId
    const gameId = dto.gameId.toString() as GameId
    const playerIds = JSON.parse(dto.players) as PlayerId[]
    const playedOn = new Date(dto.playedOn)
  
    if (dto.gameType === GameType.VS) {
      const winner = dto.result.toString() as PlayerId
      let scores = dto.scores ? deserializeScores(dto.scores) : undefined
  
      return new VsPlaythrough({
        id,
        gameId,
        playerIds,
        playedOn,
        winnerId: winner,
        scores
      })
    }
    else if (dto.gameType === GameType.COOP) {
      const playersWon = dto.result === 1
      const score = dto.scores === undefined ? undefined : Number(dto.scores)
  
      return new CoopPlaythrough({
        id,
        gameId,
        playerIds,
        playedOn,
        playersWon,
        score
      })
    }
    else {
      throw new Error('error creating playthough')
    }
  }

  public async getPlaythroughs(
    options?: PlaythroughAllOptions
  ): Promise<readonly Playthrough[]> {

    const limit = options?.limit

    let query = `
      SELECT
        p.id,
        p.game_id as "gameId",
        g.name as "gameName",
        g.type as "gameType",
        p.played_on as "playedOn",
        p.players,
        p.scores,
        p.result
      FROM playthroughs p
      JOIN games g ON g.id = p.game_id
      ORDER BY p.played_on DESC
    `

    if (limit) {
      query += ' LIMIT ?'
    }

    const dtos = await this._dataService.all<PlaythroughWithGameDto>(query, limit)

    return dtos.map(dto =>
      DbPlaythroughRepository.create(dto))
  }

  public async getPlaythroughsForGame(game: Game): Promise<readonly Playthrough[]> {
    throw new Error('Method not implemented.')
  }

  public async addPlaythrough(playthrough: Playthrough): Promise<void> {
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
    playthrough.bindId(id.toString() as PlaythroughId)
  }
  
}


//
// helpers
// =======


function toDto(playthrough: Playthrough): Omit<PlaythroughDto, 'id'> {
  const base = {
    gameId: Number(playthrough.gameId),
    playedOn: playthrough.playedOn.toISOString(),
    players: JSON.stringify(playthrough.playerIds)
  }

  if (playthrough instanceof VsPlaythrough) {
    return {
      ...base,
      result: Number(playthrough.winnerId),
      scores: playthrough.scores && playthrough.scores.hasScore
        ? serializeScores(playthrough.scores.toData())
        : undefined
    }
  }
  else if (playthrough instanceof CoopPlaythrough) {
    return {
      ...base,
      result: playthrough.playersWon ? 1 : 0,
      scores: playthrough.score?.toString()
    }
  }

  throw new Error('unsupported playthrough type')
}

function serializeScores(scores: readonly ScoreData[]): string {
  return JSON.stringify(scores.map<SerializedScore>(score => ({
    id: score.playerId,
    s: score.score
  })))
}

function deserializeScores(scores: string): readonly ScoreData[] {
  const parsed = JSON.parse(scores) as SerializedScore[]
  return parsed.map<ScoreData>(score => ({
    playerId: score.id as PlayerId,
    score: score.s
  }))
}