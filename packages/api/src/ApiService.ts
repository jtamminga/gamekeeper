import { ApiClient } from 'ApiClient'

export abstract class ApiService {

  public constructor(protected readonly apiClient: ApiClient) { }

}