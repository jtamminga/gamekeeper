import { DataService } from './DataService'

export abstract class DbService {

  public constructor(protected readonly _dataService: DataService) { }

  protected buildUpdate(
    data: Record<string, unknown>,
    mapping: Record<string, string>,
    transform?: (dbKey: string, value: unknown) => unknown
  ): { setStatements: string; values: unknown[] } {
    const originalKeys = Object.keys(data).filter(key => key in mapping)
    const mappedKeys = originalKeys.map(key => mapping[key])
    const setStatements = mappedKeys.map(key => `${key} = ?`).join(',')
    const values = originalKeys.map((key, i) => {
      const value = data[key]
      return transform ? transform(mappedKeys[i], value) : value
    })
    
    return { setStatements, values }
  }

}