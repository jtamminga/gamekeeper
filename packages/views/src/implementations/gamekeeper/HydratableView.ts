export interface HydratableView<T> {
  hydrate(): Promise<T>
}