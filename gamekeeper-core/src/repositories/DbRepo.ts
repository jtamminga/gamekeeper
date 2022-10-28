import { DataService } from '@services'
import { container } from 'tsyringe'


// database repository
export class DbRepo {

  protected _dataService: DataService

  public constructor() {
    this._dataService = container.resolve(DataService)
  }

}