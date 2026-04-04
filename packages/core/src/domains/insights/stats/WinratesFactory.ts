import type { CoopWinratesData, PlayerWinrateData } from '@services'
import type { InsightsDeps } from '../Insights'
import { CoopWinrates } from './CoopWinrates'
import { PlayerWinrate } from './PlayerWinrate'
import { Winrates } from './Winrates'
import { Winrate } from './Winrate'


export namespace WinratesFactory {
  export function create(
    deps: InsightsDeps,
    data: readonly PlayerWinrateData[] | CoopWinratesData
  ): Winrates | CoopWinrates {
    return 'game' in data
      ? createCoopWinrates(deps, data)
      : createWinrates(deps, data)
  }

  export function createWinrates(
    deps: InsightsDeps,
    data: readonly PlayerWinrateData[]
  ): Winrates {
    const winrates = data.map(player =>
      new PlayerWinrate(deps.gameplay.players.get(player.playerId), player.winrate, player.plays)
    )
    return new Winrates(winrates)
  }

  export function createCoopWinrates(
    deps: InsightsDeps,
    data: CoopWinratesData
  ): CoopWinrates {
    const gameWinrate = new Winrate(data.game.winrate, data.game.plays)
    const playersWinrate = new Winrate(data.players.winrate, data.players.plays)
    const playerWinrates = data.winrates.map(player =>
      new PlayerWinrate(deps.gameplay.players.get(player.playerId), player.winrate, player.plays)
    )
    return new CoopWinrates(gameWinrate, playersWinrate, playerWinrates)
  }

}
