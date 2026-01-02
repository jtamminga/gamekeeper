import { PlayerView, GameWithWinrate as GameWithWinrateView } from '@def/views'
import { Game, GameKeeper, PlayerId, StatsResult, Winrate, Winrates } from '@gamekeeper/core'
import { formatPercent } from '../formatters'


export class PlayerViewFactory {
  public constructor(private readonly gamekeeper: GameKeeper) { }


  public async create(playerId: PlayerId, year?: number): Promise<PlayerView> {
    const { stats } = this.gamekeeper.insights
    const player = this.gamekeeper.gameplay.players.get(playerId)
    const currentYear = new Date().getFullYear()
    year = year ?? currentYear

    const [
      winratesAllTime,
      winratesThisYear,
      // numPlaythroughs
    ] = await Promise.all([
      stats.winrates({}),
      stats.winrates({ year })
      // stats.numPlaythroughs({})
    ])

    return {
      year,
      player,
      topGamesAllTime: sortBest(getTopGames(playerId, winratesAllTime)).map(formatTopGame),
      topGamesThisYear: sortBest(getTopGames(playerId, winratesThisYear)).map(formatTopGame),
      worstGamesAllTime: sortWorst(getTopGames(playerId, winratesAllTime)).map(formatTopGame),
      worstGamesThisYear: sortWorst(getTopGames(playerId, winratesThisYear)).map(formatTopGame)
    }
  }
}


function getTopGames(playerId: PlayerId, winrates: StatsResult<Winrates>): GameWithWinrate[] {
  const gamesWithWinrates: GameWithWinrate[] = []
  winrates.forEach((winrates, game) => {
    const winrate = winrates.for(playerId)
    if (winrate !== undefined) {
      gamesWithWinrates.push({ game, winrate })
    }
  })

  return gamesWithWinrates
}

function sortBest(gamesWithWinrates: GameWithWinrate[]): GameWithWinrate[] {
  return gamesWithWinrates.sort((a, b) => {

    // primary sort
    if (b.winrate.winrate !== a.winrate.winrate) {
      return b.winrate.winrate - a.winrate.winrate
    }

    // secondary sort
    return b.winrate.plays - a.winrate.plays
  }).slice(0, 5)
}

function sortWorst(gamesWithWinrates: GameWithWinrate[]): GameWithWinrate[] {
  return gamesWithWinrates.sort((a, b) => {

    // primary sort
    if (a.winrate.winrate !== b.winrate.winrate) {
      return a.winrate.winrate - b.winrate.winrate
    }

    // secondary sort
    return b.winrate.plays - a.winrate.plays
  }).slice(0, 5)
}

function formatTopGame({ game, winrate }: GameWithWinrate): GameWithWinrateView {
  return {
    gameId: game.id,
    gameName: game.name,
    numPlays: winrate.plays,
    percentage: formatPercent(winrate.winrate)
  }
}


type GameWithWinrate = {
  game: Game
  winrate: Winrate
}