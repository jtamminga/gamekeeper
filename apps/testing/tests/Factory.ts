import { GameId, GameKeeper, GameKeeperFactory, GameType, NewCoopPlaythroughData, NewGameData, NewPlaythroughData, NewVsPlaythroughData, PlayerData, PlayerId, ScoringType, Services, SimpleStatsService } from '@gamekeeper/core'
import { MemoryDatabase, TestGameService, TestPlayerService, TestPlaythroughService } from './TestServices'

export namespace Factory {

  export const john: PlayerData = {
    id: '1' as PlayerId,
    name: 'john'
  }
  export const alex: PlayerData = {
    id: '2' as PlayerId,
    name: 'alex'
  }

  function createTestServices(): Services {
    const db: MemoryDatabase = {
      games: [],
      players: [john, alex],
      playthroughs: []
    }
  
    const gameService = new TestGameService(db)
    const playerService = new TestPlayerService(db)
    const playthroughService = new TestPlaythroughService(db)
    const statsService = new SimpleStatsService(playthroughService)
  
    return {
      gameService,
      playerService,
      playthroughService,
      statsService
    }
  }

  export function createGamekeeper(): GameKeeper {
    return GameKeeperFactory.create(createTestServices())
  }

  export function createGame({ name, scoring, type }: Partial<NewGameData> = {}): NewGameData {
    return {
      name: name ?? 'test',
      scoring: scoring ?? ScoringType.HIGHEST_WINS,
      type: type ?? GameType.VS
    }
  }

  export function createVsPlaythrough(gameId: GameId, winnerId: PlayerId | null): NewVsPlaythroughData {
    return {
      gameId,
      playerIds: [john.id, alex.id],
      playedOn: new Date(),
      winnerId
    }
  }

  export function createCoopPlaythrough(gameId: GameId, playersWon: boolean): NewCoopPlaythroughData {
    return {
      gameId,
      playerIds: [john.id, alex.id],
      playedOn: new Date(),
      playersWon
    }
  }

}