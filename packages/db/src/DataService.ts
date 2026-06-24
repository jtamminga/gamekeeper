import { Database, open } from 'sqlite'
import sqlite3 from 'sqlite3'


export class DataService {

  private _db?: Promise<Database>

  public constructor(
    private _path: string,
    private _initSql?: string
  ) { }

  private async openDb(): Promise<Database> {
    const db = await open({
      filename: this._path,
      driver: sqlite3.Database
    })

    if (this._initSql) {
      await db.exec(this._initSql)
    }

    return db
  }

  private async db(): Promise<Database> {
    if (!this._db) {
      this._db = this.openDb()
    }
    return this._db
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