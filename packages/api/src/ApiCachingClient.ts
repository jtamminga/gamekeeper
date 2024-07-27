import { IApiClient } from './IApiClient'

export class ApiCachingClient implements IApiClient {

  private cache: Map<string, any>

  public constructor(private baseClient: IApiClient) {
    this.cache = new Map<string, any>()
  }

  public async get<T>(path: string, query?: Record<string, string>): Promise<T> {
    const hash = this.createRequestHash(path, query)
    const cachedResult = this.cache.get(hash)

    if (cachedResult !== undefined) {
      console.debug(`[ApiCache] cache hit: ${hash}`)
      return cachedResult
    }

    console.debug(`[ApiCache] cache miss: ${hash}`)
    const result = await this.baseClient.get<T>(path, query)
    this.cache.set(hash, result)
    return result
  }

  public async post<T>(path: string, data: any): Promise<T> {
    console.debug('[ApiCache] cache cleared')
    this.cache.clear()
    return this.baseClient.post(path, data)
  }

  public async patch<T>(path: string, data: any): Promise<T> {
    console.debug('[ApiCache] cache cleared')
    this.cache.clear()
    return this.baseClient.patch(path, data)
  }

  public async delete(path: string): Promise<void> {
    console.debug('[ApiCache] cache cleared')
    this.cache.clear()
    return this.baseClient.delete(path)
  }

  private createRequestHash(path: string, query?: Record<string, string>): string {
    return path + (query ? JSON.stringify(query) : '')
  }
}