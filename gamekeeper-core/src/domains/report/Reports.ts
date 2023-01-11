import { GameKeeper } from 'web'
import { YearReport, YearReportData } from './YearReport'

export class Reports {

  public constructor(private gameKeeper: GameKeeper) { }

  public forYear(): Promise<YearReportData> {
    return new YearReport(this.gameKeeper).getData()
  }

}