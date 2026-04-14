import type { Game, Player } from '@domains/gameplay'
import { type HistoricalScoreData, type PlaysByDateData, type PlaythroughId, ScoringType } from '@services'
import type { InsightsDeps } from '../Insights'
import type { CoopWinrates } from './CoopWinrates'
import type { OverallStatsQuery } from './Stats'
import type { Winrates } from './Winrates'
import { WinratesFactory } from './WinratesFactory'


type ScoreStats = {
  bestScore: { playthroughId: PlaythroughId, score: number, player?: Player }
  worstScore: { playthroughId: PlaythroughId, score: number, player?: Player }
  averageScore: number
}


/**
 * Statistics scoped to a single game.
 * Created via `Stats.forGame()`. Supports play counts, last played date,
 * winrates, plays by month/date, and score stats (where applicable).
 */
export class GameStats {

  public constructor(
    private readonly _deps: InsightsDeps,
    public readonly game: Game,
    private readonly _query?: OverallStatsQuery
  ) { }

  public async numPlaythroughs(query?: OverallStatsQuery): Promise<number> {
    const result = await this._deps.service.getNumPlays({ ...this._query, ...query, gameId: this.game.id })
    return result[this.game.id] ?? 0
  }

  public async lastPlaythrough(query?: OverallStatsQuery): Promise<Date | undefined> {
    const result = await this._deps.service.getLastPlayed({ ...this._query, ...query, gameId: this.game.id })
    return result[this.game.id]
  }

  public async winrates(query?: OverallStatsQuery): Promise<Winrates | CoopWinrates> {
    const result = await this._deps.service.getWinrates({ ...this._query, ...query, gameId: this.game.id })
    const winrates = result[this.game.id] ?? []
    return WinratesFactory.create(this._deps, winrates)
  }

  public async playsByMonth(query?: OverallStatsQuery): Promise<number[]> {
    return this._deps.service.getNumPlaysByMonth({ ...this._query, ...query, gameId: this.game.id })
  }

  public async numPlaysByDate(query?: OverallStatsQuery): Promise<PlaysByDateData[]> {
    return this._deps.service.getNumPlaysByDate({ ...this._query, ...query, gameId: this.game.id })
  }

  public async historicalScores(query?: OverallStatsQuery): Promise<ReadonlyArray<HistoricalScoreData>> {
    // only continue if game has scoring
    if (!this.game.hasScoring || this.game.hasRoundBasedScoring) {
      return []
    }

    const result = await this._deps.service.getHistoricalScores({ ...this._query, ...query, gameId: this.game.id })
    return result[this.game.id] ?? []
  }

  public async scoreStats(query?: OverallStatsQuery): Promise<ScoreStats | undefined> {
    // only continue if game has scoring
    if (!this.game.hasScoring || this.game.hasRoundBasedScoring) {
      return undefined
    }

    const result = await this._deps.service.getScoreStats({ ...this._query, ...query, gameId: this.game.id })
    const gameResult = result[this.game.id]
    if (gameResult === undefined) {
      return undefined
    }

    const bestScore = this.game.scoring === ScoringType.HIGHEST_WINS
      ? gameResult.highScore
      : gameResult.lowScore
    const worstScore = this.game.scoring === ScoringType.HIGHEST_WINS
      ? gameResult.lowScore
      : gameResult.highScore
    
    return {
      bestScore: {
        playthroughId: bestScore.playthroughId,
        score: bestScore.score,
        player: bestScore.playerId === undefined
          ? undefined
          : this._deps.gameplay.players.get(bestScore.playerId)
      },
      worstScore: {
        playthroughId: worstScore.playthroughId,
        score: worstScore.score,
        player: worstScore.playerId === undefined
          ? undefined
          : this._deps.gameplay.players.get(worstScore.playerId)
      },
      averageScore: gameResult.averageScore
    }
  }

}