export interface IApiClient {
  get<T>(path: string, query?: Record<string, string>): Promise<T>
  post<T>(path: string, data: any): Promise<T>
  patch<T>(path: string, data: any): Promise<T>
  delete(path: string): Promise<void>
}