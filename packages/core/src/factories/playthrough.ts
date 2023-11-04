import { GameKeeperDeps } from '@core'
import { CoopPlaythrough, Playthrough, VsPlaythrough } from '@domains'
import { GameType, PlayerId, PlaythroughDto, ScoreDto } from '@services'


export namespace PlaythroughFactory {
  export function create(deps: GameKeeperDeps, dto: PlaythroughDto): Playthrough {

    if (dto.gameType === GameType.VS) {  
      return new VsPlaythrough(deps, {
        id: dto.id,
        gameId: dto.gameId,
        playerIds: dto.players,
        playedOn: dto.playedOn,
        winnerId: dto.result as PlayerId,
        scores: dto.scores as ScoreDto[]
      })
    }
    else if (dto.gameType === GameType.COOP) {  
      return new CoopPlaythrough(deps, {
        id: dto.id,
        gameId: dto.gameId,
        playerIds: dto.players,
        playedOn: dto.playedOn,
        playersWon: dto.result as boolean,
        score: dto.scores as number
      })
    }
    else {
      throw new Error('error creating playthough')
    }
  }

}