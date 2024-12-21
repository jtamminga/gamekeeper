import { FormattedWinrate } from '@def/models'
import { Game, VsGame, Winrate } from '@gamekeeper/core'
import { formatPercent } from './formatPercent'

export function formatWinrate(winrate: Winrate, game?: Game): FormattedWinrate {
  return {
    percentage: formatPercent(winrate.winrate),
    playerId: game instanceof VsGame ? winrate.player.id : undefined,
    playerName: game instanceof VsGame ? winrate.player.name : 'players'
  }
}