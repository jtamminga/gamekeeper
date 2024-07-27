import { ApiError } from './ApiError'
import type { IApiClient } from './IApiClient'


// consts
const BASE_HEADERS = {
  'Content-Type': 'application/json',
}
const BASE_OPTIONS = {
  referrerPolicy: 'no-referrer',
  headers: BASE_HEADERS
} as const


// types
export type ApiResponse<T> = {
  data: T
}


export class ApiClient implements IApiClient {

  public constructor(private baseUrl: string) { }

  public async get<T>(path: string, query?: Record<string, string>): Promise<T> {
    const fullPath = query
      ? path + '?' + new URLSearchParams(query).toString()
      : path

    return this.handledFetch(fullPath, {
      ...BASE_OPTIONS,
      method: 'GET',
    })
  }

  public async post<T>(path: string, data: any): Promise<T> {
    return this.handledFetch(path, {
      ...BASE_OPTIONS,
      method: 'POST',
      body: JSON.stringify(data)
    })
  }

  public async patch<T>(path: string, data: any): Promise<T> {
    return this.handledFetch(path, {
      ...BASE_OPTIONS,
      method: 'PATCH',
      body: JSON.stringify(data)
    })
  }

  public async delete(path: string): Promise<void> {
    return this.handledFetch(path, {
      ...BASE_OPTIONS,
      method: 'DELETE',
    })
  }

  private async handledFetch<T>(path: string, init?: RequestInit | undefined): Promise<T> {
    try {
      const response = await fetch(this.baseUrl + path, init)

      if (response.ok) {
        const result = await response.json() as ApiResponse<T>
        return result.data
      }
  
      throw new ApiError(response.status, await response.text())
    }
    catch (e) {
      if (e instanceof ApiError) {
        throw e
      }

      throw new ApiError(500, 'could not reach server')
    }
  }
}