import { GameKeeper } from 'web'

export class YearReport {

  public constructor(private gameKeeper: GameKeeper) { }

  public async getDate() {
    const [players, games] = await Promise.all([
      this.gameKeeper.players.asMap(),
      this.gameKeeper.games.asMap()
    ])
  }

}