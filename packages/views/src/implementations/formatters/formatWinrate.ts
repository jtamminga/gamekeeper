import type { FormattedWinrate } from '@def/models'
import { Game, GameWinrate, PlayerWinrate, VsGame } from '@gamekeeper/core'
import { formatPercent } from './formatPercent'

export function formatWinrate(winrate: PlayerWinrate | GameWinrate, game?: Game): FormattedWinrate {
  const percentage = formatPercent(winrate.winrate)

  if (game === undefined || game instanceof VsGame) {

    if (!(winrate instanceof PlayerWinrate)) {
      throw new Error('winrate invalid type')
    }

    return {
      percentage,
      playerId: winrate.player.id,
      name: winrate.player.name
    }
  }

  else {
    return {
      percentage,
      playerId: undefined,
      name: winrate instanceof PlayerWinrate
        ? 'players'
        : 'game'
    }
  }
}