export abstract class Entity<IdType> {

  public constructor(private _id?: IdType) { }

  public get id(): IdType | undefined {
    return this._id
  }

  public bindId(id: IdType) {
    // throw if already set
    if (this._id !== undefined) {
      throw new Error('Id already set')
    }

    this._id = id
  }

}