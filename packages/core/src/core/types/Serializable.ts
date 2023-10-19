export interface Serializable<T extends object> {

  toData(): T

}