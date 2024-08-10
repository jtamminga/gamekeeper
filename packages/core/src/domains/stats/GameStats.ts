import { Winrates } from './Winrates'
import type { Game } from '../game'
import type { GameKeeperDeps } from '@core'
import type { OverallStatsQuery } from './Stats'
import { ScoringType, type StatsService } from '@services'
import { Player } from '../player'


type ScoreStats = {
  bestScore: { score: number, player?: Player }
  averageScore: number
}


// vs game stats
export class GameStats {

  private _statsService: StatsService

  public constructor(
    private readonly _deps: GameKeeperDeps,
    public readonly game: Game,
    private readonly _query?: OverallStatsQuery
  ) {
    this._statsService = _deps.services.statsService
  }

  public async numPlaythroughs(query?: OverallStatsQuery): Promise<number> {
    const result = await this._statsService.getNumPlays({ ...this._query, ...query, gameId: this.game.id })
    return result[this.game.id] ?? 0
  }

  public async lastPlaythrough(query?: OverallStatsQuery): Promise<Date | undefined> {
    const result = await this._statsService.getLastPlayed({ ...this._query, ...query, gameId: this.game.id })
    return result[this.game.id]
  }

  public async winrates(query?: OverallStatsQuery): Promise<Winrates> {
    const result = await this._statsService.getWinrates({ ...this._query, ...query, gameId: this.game.id })
    const winrates = result[this.game.id] ?? []
    return Winrates.from(winrates, this._deps)
  }

  public async playsByMonth(query?: OverallStatsQuery): Promise<number[]> {
    return this._deps.services.statsService.getNumPlaysByMonth({ ...this._query, ...query, gameId: this.game.id })
  }

  public async scoreStats(query?: OverallStatsQuery): Promise<ScoreStats | undefined> {
    if (this.game.scoring === ScoringType.NO_SCORE) {
      return undefined
    }

    const result = await this._statsService.getScoreStats({ ...this._query, ...query, gameId: this.game.id })
    const gameResult = result[this.game.id]
    if (gameResult === undefined) {
      return undefined
    }

    const bestScore = this.game.scoring === ScoringType.HIGHEST_WINS
      ? gameResult.highScore
      : gameResult.lowScore
    
    return {
      bestScore: {
        score: bestScore.score,
        player: bestScore.playerId === undefined
          ? undefined
          : this._deps.store.getPlayer(bestScore.playerId)
      },
      averageScore: gameResult.averageScore
    }
  }

}