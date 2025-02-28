import { open, Database } from 'sqlite'
import sqlite3 from 'sqlite3'

sqlite3.verbose()


export class DataService {

  private _db?: Database

  public constructor(
    private _path: string
  ) { }

  public async open(): Promise<void> {
    this._db = await open({
      filename: this._path,
      driver: sqlite3.Database
    })

    // this._db.on('trace', (sql: any) => {
    //   console.debug('SQL:', sql)
    // })
  }

  private async db(): Promise<Database> {
    if (!this._db) {
      await this.open()
    }
    return this._db!
  }

  public async get<T>(sql: string, ...params: any[]): Promise<T | undefined> {
    const db = await this.db()
    return await db.get<T>(sql, ...params)
  }

  public async all<T>(sql: string, ...params: any[]): Promise<T[]> {
    const db = await this.db()
    return await db.all<T[]>(sql, ...params)
  }

  public async insert(sql: string, ...params: any): Promise<number> {
    const db = await this.db()
    const result = await db.run(sql, ...params)
    return result.lastID!
  }

  public async run(sql: string, ...params: any[]): Promise<void> {
    const db = await this.db()
    await db.run(sql, ...params)
  }

}