import type { Game, Player } from '@domains/gameplay'
import { type PlaysByDateData, ScoringType } from '@services'
import type { InsightsDeps } from '../Insights'
import type { CoopWinrates } from './CoopWinrates'
import type { OverallStatsQuery } from './Stats'
import type { Winrates } from './Winrates'
import { WinratesFactory } from './WinratesFactory'


type ScoreStats = {
  bestScore: { score: number, player?: Player }
  worstScore: { score: number, player?: Player }
  averageScore: number
}


// vs game stats
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

  public async scoreStats(query?: OverallStatsQuery): Promise<ScoreStats | undefined> {
    // score stats don't make sense for rounds, and obviously if there is no scoring
    if (this.game.scoring === ScoringType.NO_SCORE || this.game.scoring === ScoringType.MOST_ROUNDS) {
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
        score: bestScore.score,
        player: bestScore.playerId === undefined
          ? undefined
          : this._deps.gameplay.players.get(bestScore.playerId)
      },
      worstScore: {
        score: worstScore.score,
        player: worstScore.playerId === undefined
          ? undefined
          : this._deps.gameplay.players.get(worstScore.playerId)
      },
      averageScore: gameResult.averageScore
    }
  }

}