import type { CoopWinratesData, PlayerWinrateData } from '@services'
import type { InsightsDeps } from '../Insights'
import { CoopWinrates } from './CoopWinrates'
import { GameWinrate } from './GameWinrate'
import { PlayerWinrate } from './PlayerWinrate'
import { Winrates } from './Winrates'


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
    const playerWinrates = data.map(player =>
      new PlayerWinrate(deps.gameplay.players.get(player.playerId), player.winrate, player.plays)
    )
    return new Winrates(playerWinrates)
  }

  export function createCoopWinrates(
    deps: InsightsDeps,
    data: CoopWinratesData
  ): CoopWinrates {
    const playerWinrates = data.players.map(player =>
      new PlayerWinrate(deps.gameplay.players.get(player.playerId), player.winrate, player.plays)
    )
    const gameWinrate = new GameWinrate(data.game.winrate, data.game.plays)
    return new CoopWinrates(gameWinrate, playerWinrates)
  }

}
