/**
 * Abstract base class for all domain entities.
 * Provides a type-safe identity via a generic `IdType`, ensuring each entity
 * subclass uses its own branded ID type rather than a plain string.
 */
export abstract class Entity<IdType> {

  public constructor(private _id: IdType) { }

  public get id(): IdType {
    return this._id
  }

}