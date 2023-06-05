import { endOfYear, setYear, startOfYear } from 'date-fns'
import { GameKeeper } from '../GameKeeper'
import { SummaryReport, SummaryReportData } from './SummaryReport'


// class
export class Reports {

  public constructor(private gameKeeper: GameKeeper) { }

  public forYear(year?: number): Promise<SummaryReportData> {

    // date right now
    const now = new Date()

    // date with the specified year set
    // default to current year
    const date = year ? setYear(now, year) : now

    // date range for year
    const range = {
      from: startOfYear(date),
      to: endOfYear(date)
    }
    
    // create report
    return new SummaryReport(this.gameKeeper, range).getData()
  }

}