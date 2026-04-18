import type { IApiClient } from '../client/IApiClient'

export abstract class ApiService {

  public constructor(protected readonly apiClient: IApiClient) { }

}