import { GameMap, PlayerMap } from '@repos'
import { startOfYear } from 'date-fns'
import { GameKeeper } from '../GameKeeper'
import { Playthrough } from '../playthrough'


// type
export type YearReportData = {
  players: PlayerMap
  games: GameMap
  playthroughs: ReadonlyArray<Playthrough>

  numPlays: number
  numGamesPlayed: number
}


// class
export class YearReport {

  public constructor(private gameKeeper: GameKeeper) { }

  public async getData(): Promise<YearReportData> {

    // date to start getting playthroughs from
    const fromDate = startOfYear(new Date())

    // get all needed data
    const [players, games, playthroughs] = await Promise.all([
      this.gameKeeper.players.asMap(),
      this.gameKeeper.games.asMap(),
      this.gameKeeper.playthroughs.all({ fromDate })
    ])

    // determine number of games played
    let numGamesPlayed = 0
    games.forEach(game => {
      const gamePlaythroughs = playthroughs
        .filter(p => p.gameId === game.id)

      if (playthroughs.length > 0) {
        numGamesPlayed++
      }

      game.bindPlaythroughs(gamePlaythroughs)
    })

    return {
      players,
      games,
      playthroughs,
      numPlays: playthroughs.length,
      numGamesPlayed: numGamesPlayed
    }
  }

}