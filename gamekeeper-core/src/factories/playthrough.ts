import { GameKeeperDeps } from '@core'
import { CoopPlaythrough, GameId, GameType, PlayerId, Playthrough, PlaythroughId, ScoreData, VsPlaythrough } from '@domains'
import { PlaythroughDto } from '@services'


type SerializedScore = {
  id: string
  s: number
}

export namespace PlaythroughFactory {

  export function create(deps: GameKeeperDeps, dto: PlaythroughDto): Playthrough {

    // grab values
    const id = dto.id.toString() as PlaythroughId
    const gameId = dto.gameId.toString() as GameId
    const playerIds = JSON.parse(dto.players) as PlayerId[]
    const playedOn = new Date(dto.playedOn)
  
    if (dto.gameType === GameType.VS) {
      const winner = dto.result.toString() as PlayerId
      let scores = dto.scores ? deserializeScores(dto.scores) : undefined
  
      return new VsPlaythrough(deps, {
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
  
      return new CoopPlaythrough(deps, {
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

  function deserializeScores(scores: string): readonly ScoreData[] {
    const parsed = JSON.parse(scores) as SerializedScore[]
    return parsed.map<ScoreData>(score => ({
      playerId: score.id as PlayerId,
      score: score.s
    }))
  }
}