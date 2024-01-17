import { GameKeeper, StatsResult } from '@domains'


type HydratedData = {
  numPlaysThisYear: number
  numPlaysLastYear: number
  numPlaysAllTime: number
}


export class StatsView {
  
  public async hydrate(gamekeeper: GameKeeper): Promise<HydratedStatsView> {
    const {stats} = gamekeeper
    const year = new Date().getFullYear()

    const [
      numPlaysThisYear,
      numPlaysLastYear,
      numPlaysAllTime
    ] = await Promise.all([
      stats.numPlaythroughs({ year }),
      stats.numPlaythroughs({ year: year - 1 }),
      stats.numPlaythroughs({})
    ])

    return new HydratedStatsView({
      numPlaysThisYear: totalPlays(numPlaysThisYear),
      numPlaysLastYear: totalPlays(numPlaysLastYear),
      numPlaysAllTime: totalPlays(numPlaysAllTime)
    })
  }

}

export class HydratedStatsView {

  public readonly numPlaysThisYear: number
  public readonly numPlaysLastYear: number
  public readonly numPlaysAllTime: number

  public constructor(private _data: HydratedData) {
    this.numPlaysThisYear = _data.numPlaysThisYear
    this.numPlaysLastYear = _data.numPlaysLastYear
    this.numPlaysAllTime = _data.numPlaysAllTime
  }

}


// helpers
function totalPlays(grouped: StatsResult<number>): number {
  return Array.from(grouped.values()).reduce((sum, count) => sum + count)
}