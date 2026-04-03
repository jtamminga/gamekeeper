import {
  GameData,
  GameId,
  GameKeeper,
  GameKeeperFactory,
  GameType,
  InMemoryStats,
  InMemoryStatsService,
  NewCoopPlaythroughData,
  NewGameData,
  NewVsPlaythroughData,
  PlayerData,
  PlayerId,
  PlaythroughData,
  PlaythroughId,
  ScoreData,
  ScoringType,
  Services,
  VsPlaythroughData
} from '@gamekeeper/core'
import {
  MemoryDatabase,
  TestGameService,
  TestGoalService,
  TestPlayerService,
  TestPlaythroughService
} from './TestServices'


export namespace Factory {

  export const john: PlayerData = {
    id: '1' as PlayerId,
    name: 'john'
  }
  export const alex: PlayerData = {
    id: '2' as PlayerId,
    name: 'alex'
  }
  const games: GameData[] = [
    {
      id: 'game1' as GameId,
      name: 'Game 1',
      scoring: ScoringType.HIGHEST_WINS,
      type: GameType.VS,
      own: true
    }
  ]
  const playthroughs: VsPlaythroughData[] = [
    {
      id: '1' as PlaythroughId,
      gameId: 'game1' as GameId,
      type: 'vs',
      playedOn: new Date(),
      playerIds: [john.id, alex.id],
      winnerId: alex.id
    }
  ]

  function createTestServices(db: MemoryDatabase): Services {
    const gameService = new TestGameService(db)
    const playerService = new TestPlayerService(db)
    const playthroughService = new TestPlaythroughService(db)
    const goalService = new TestGoalService()
    const inMemoryStats = new InMemoryStats()
    const statsService = new InMemoryStatsService(inMemoryStats, playthroughService)
  
    return {
      gameService,
      playerService,
      playthroughService,
      statsService,
      goalService
    }
  }

  export function createGamekeeper(loadSomeStuff = false): GameKeeper {
    const db = loadSomeStuff
      ? {
        games: [...games],
        players: [john, alex],
        playthroughs: [...playthroughs]
      } : {
        games: [],
        players: [john, alex],
        playthroughs: []
      }

    return GameKeeperFactory.create(createTestServices(db))
  }

  export function createGame({ name, scoring, type }: Pick<NewGameData, 'type'> & Partial<NewGameData>): NewGameData {
    return {
      name: name ?? 'test',
      scoring: scoring ?? ScoringType.HIGHEST_WINS,
      type,
      own: true
    }
  }

  export function createVsGame(opts: Omit<Partial<NewGameData>, 'type'> = {}): NewGameData {
    return createGame({ ...opts, type: GameType.VS })
  }

  export function createCoopGame(opts: Omit<Partial<NewGameData>, 'type'> = {}): NewGameData {
    return createGame({ ...opts, type: GameType.COOP })
  }

  export type CreateVsPlaythroughParams = {
    gameId: GameId
    winnerId: PlayerId | null
    scores?: ScoreData[]
    playerIds?: PlayerId[]
  }

  export type CreateCoopPlaythroughParams = {
    gameId: GameId
    playersWon: boolean
    score?: number
    playerIds?: PlayerId[]
  }

  export function createVsPlaythrough({ gameId, winnerId, scores, playerIds = [john.id, alex.id] }: CreateVsPlaythroughParams): NewVsPlaythroughData {
    return {
      type: 'vs',
      gameId,
      playerIds,
      playedOn: new Date(),
      winnerId,
      scores
    }
  }

  export function createCoopPlaythrough({ gameId, playersWon, score, playerIds = [john.id, alex.id] }: CreateCoopPlaythroughParams): NewCoopPlaythroughData {
    return {
      type: 'coop',
      gameId,
      playerIds,
      playedOn: new Date(),
      playersWon,
      score
    }
  }

  export function createScores(johnsScore: number | undefined, alexsScore: number | undefined): ScoreData[] | undefined {
    const scores: ScoreData[] = []
    if (johnsScore !== undefined) {
      scores.push({ playerId: john.id, score: johnsScore })
    }
    if (alexsScore !== undefined) {
      scores.push({ playerId: alex.id, score: alexsScore })
    }

    if (scores.length === 0) {
      return undefined
    } else {
      return scores
    }
  }

}