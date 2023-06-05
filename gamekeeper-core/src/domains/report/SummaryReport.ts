import { Range } from '@core'
import { GameMap, PlayerMap } from '@repos'
import { GameKeeper } from '../GameKeeper'
import { Playthrough } from '../playthrough'
import {
  totalGamesPlayed,
  totalPlays
} from './calculation'


// type
export type SummaryReportData = {
  players: PlayerMap
  games: GameMap
  playthroughs: ReadonlyArray<Playthrough>
  numPlays: number
  numGamesPlayed: number
}


// class
export class SummaryReport {

  public constructor(
    private gameKeeper: GameKeeper,
    private dateRange: Range<Date>
  ) { }

  public async getData(): Promise<SummaryReportData> {

    // get all needed data
    const [players, games, playthroughs] = await Promise.all([
      this.gameKeeper.players.asMap(),
      this.gameKeeper.games.asMap(),
      this.gameKeeper.playthroughs.all({
        fromDate: this.dateRange.from,
        toDate: this.dateRange.to
      })
    ])

    // data for calculations
    const data = { games, playthroughs }

    // return
    return {
      players,
      games,
      playthroughs,
      numPlays: totalPlays(data),
      numGamesPlayed: totalGamesPlayed(data)
    }
  }

}