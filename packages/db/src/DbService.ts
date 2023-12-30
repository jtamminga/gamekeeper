import { DataService } from './DataService'

export abstract class DbService {

  public constructor(protected readonly _dataService: DataService) { }

}