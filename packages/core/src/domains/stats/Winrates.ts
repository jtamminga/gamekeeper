import { Playthrough } from 'domains/playthrough'
import { Winrate } from './Winrate'
import { GameKeeperDeps } from '@core'
import { PlayerId } from '@services'


type PlayWinData = {
  plays: number
  wins: number
}


export class Winrates {

  public readonly best: Winrate | undefined
  protected readonly _winrates: Map<PlayerId, number>

  public constructor(protected _deps: GameKeeperDeps, playthroughs: ReadonlyArray<Playthrough>) {
    const {winrates, best} = calcWinrates(playthroughs)
    this._winrates = winrates

    if (best) {
      this.best = new Winrate(_deps.builder.data.players[best.playerId], best.winrate)
    }
  }

  public get map(): ReadonlyMap<PlayerId, number> {
    return this._winrates
  }

}


// helper
function calcWinrates(playthroughs: ReadonlyArray<Playthrough>) {
  const playWinData = new Map<PlayerId, PlayWinData>()
  
  // get playcount and wins for each player
  for (const playthough of playthroughs) {
    for (const playerId of playthough.playerIds) {
      const winrateData = playWinData.get(playerId) ?? { plays: 0, wins: 0 }
      winrateData.plays++
      winrateData.wins += playthough.didWinBy(playerId) ? 1 : 0
      playWinData.set(playerId, winrateData)
    }
  }

  // keep track of best
  let bestPlayerId: PlayerId | undefined
  let bestWinrate = 0
  
  // calculate the winrates
  const winrates = new Map<PlayerId, number>()
  for (const [playerId, data] of playWinData) {
    const winrate = data.wins / data.plays
    winrates.set(playerId, winrate)

    if (winrate > bestWinrate) {
      bestPlayerId = playerId
      bestWinrate = winrate
    }
  }

  return {
    winrates,
    best: bestPlayerId ? {
      playerId: bestPlayerId,
      winrate: bestWinrate
    } : undefined
  }
}