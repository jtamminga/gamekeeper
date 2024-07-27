import type { IApiClient } from './IApiClient'

export abstract class ApiService {

  public constructor(protected readonly apiClient: IApiClient) { }

}