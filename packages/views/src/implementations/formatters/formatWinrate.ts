import type { FormattedWinrate } from '@def/models'
import { HighestCoopWinrate, PlayerWinrate } from '@gamekeeper/core'
import { formatPercent } from './formatPercent'

export function formatWinrate(winrate: PlayerWinrate | HighestCoopWinrate): FormattedWinrate {
  const percentage = formatPercent(winrate.winrate)

  if (winrate instanceof PlayerWinrate) {
    return {
      percentage,
      playerId: winrate.player.id,
      name: winrate.player.name
    }
  }

  else {
    return {
      percentage,
      name: winrate.type
    }
  }
}