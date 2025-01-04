import { GameView } from '@def/views'
import { GameId, GameKeeper, VsGame } from '@gamekeeper/core'
import { FormattedPlayerStat, FormattedScoreStats, FormattedStat } from '@def/models'
import { formatNumber, formatPercent, formatPlaythroughs } from '../formatters'
import { toNumPlaysPerDay } from '../transforms'


// constants
const NUM_HISTORICAL_PLAYTHROUGHS = 5


export class GameViewFactory {

  public constructor(
    private readonly gamekeeper: GameKeeper,
  ) { }

  public async create(gameId: GameId): Promise<GameView> {
    const game = this.gamekeeper.gameplay.games.get(gameId)
    const gameStats = this.gamekeeper.insights.stats.forGame(game)
    const year = new Date().getFullYear()
    const gameTypeLabel = game instanceof VsGame
      ? 'VS'
      : 'Coop'
    const weightLabel = game.weight
      ? `Weight: ${game.weight} / 5`
      : undefined

    // fetch data
    const [
      numPlaysAllTime,
      numPlaysThisYear,
      winratesAllTime,
      winratesThisYear,
      scoreStats,
      numPlaysByDateThisYear
    ] = await Promise.all([
      gameStats.numPlaythroughs(),
      gameStats.numPlaythroughs({ year }),
      gameStats.winrates(),
      gameStats.winrates({ year }),
      gameStats.scoreStats(),
      gameStats.numPlaysByDate({ year }),
      this.gamekeeper.gameplay.playthroughs.hydrate({
        gameId: game.id,
        limit: NUM_HISTORICAL_PLAYTHROUGHS
      })
    ])

    const numPlaythroughs: FormattedStat = {
      name: 'Plays',
      valueThisYear: numPlaysThisYear.toString(),
      valueAllTime: numPlaysAllTime.toString()
    }

    const players = this.gamekeeper.gameplay.players.all()

    const winrates: FormattedPlayerStat[] = players.map(player => ({
      name: player.name,
      playerId: player.id,
      valueAllTime: formatPercent(winratesAllTime.winrates.find(wr => wr.player === player)?.winrate),
      valueThisYear: formatPercent(winratesThisYear.winrates.find(wr => wr.player === player)?.winrate)
    }))

    let formattedScoreStats: FormattedScoreStats | undefined
    if (scoreStats !== undefined) {
      formattedScoreStats = {
        average: formatNumber(scoreStats.averageScore),
        best: {
          score: formatNumber(scoreStats.bestScore.score),
          playerId: scoreStats.bestScore.player?.id,
          player: scoreStats.bestScore.player?.name
        }
      }
    }

    return {
      year,
      game,
      gameTypeLabel,
      weightLabel,
      numPlaythroughs,
      winrates,
      stats: [numPlaythroughs, ...winrates],
      scoreStats: formattedScoreStats,
      hasMorePlaythroughs: numPlaysAllTime > NUM_HISTORICAL_PLAYTHROUGHS,
      latestPlaythroughs: formatPlaythroughs(
        this.gamekeeper
          .gameplay
          .playthroughs
          .latest(NUM_HISTORICAL_PLAYTHROUGHS, game.id)
      , { scores: true }),
      numPlaysPerDayThisYear: {
        ...toNumPlaysPerDay(numPlaysByDateThisYear, year)
      }
    }
  }

}