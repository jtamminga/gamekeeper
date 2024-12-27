export interface ResultHandler {
  handle(viewName: string, contents: Record<string, any>): Promise<void>
}