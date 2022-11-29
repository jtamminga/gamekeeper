import { PlayerId } from 'domains/player'
import { CoopPlaythrough } from '../playthrough'
import { GameType } from './Game'
import { GameStats, StatsData } from './GameStats'


// interface
export interface CoopStatsData extends StatsData {
  playersWinrate: number
}


// coop game stats
export class CoopGameStats extends GameStats<CoopPlaythrough> {

  protected isWin(playerId: PlayerId, playthough: CoopPlaythrough): boolean {
    return playthough.playerIds.includes(playerId) && playthough.playersWon
  }

  public override getData(): CoopStatsData {
    // get data
    const data = super.getData()
    
    // calculate players average winrate vs game
    let total = 0
    for (const [_, winrate] of data.winrates) {
      total += winrate
    }

    // return data
    return {
      ...data,
      playersWinrate: total / data.winrates.size
    }
  }

}


// guards
export function isCoopStatsData(data: StatsData): data is CoopStatsData {
  return data.type === GameType.COOP
}