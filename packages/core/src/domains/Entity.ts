export type NewData<T extends { id: unknown }> = Omit<T, 'id'>


export abstract class Entity<IdType> {

  public constructor(private _id: IdType) { }

  public get id(): IdType {
    return this._id
  }

}