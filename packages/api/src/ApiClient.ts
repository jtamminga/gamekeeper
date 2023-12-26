import { ApiError } from "ApiError"


// consts
const BASE_HEADERS = {
  'Content-Type': 'application/json',
}


// types
export type ApiResponse<T> = {
  data: T
}


export class ApiClient {

  public constructor(private baseUrl: string) { }

  public async get<T>(path: string): Promise<T> {
    return this.handledFetch(path, {
      referrerPolicy: 'no-referrer',
      method: 'GET',
      headers: BASE_HEADERS
    })
  }

  public async post<T>(path: string, data: any): Promise<T> {
    return this.handledFetch(path, {
      referrerPolicy: 'no-referrer',
      method: 'POST',
      headers: BASE_HEADERS,
      body: JSON.stringify(data)
    })
  }

  protected async handledFetch<T>(path: string, init?: RequestInit | undefined): Promise<T> {
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