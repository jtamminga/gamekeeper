import { join } from 'path'
import { ResultHandler } from './ResultHandler'
import { promises as fs } from 'fs'


export class FileResultHandler implements ResultHandler {
  public constructor(private readonly outputDir: string) {}

  public async handle(viewName: string, contents: Record<string, any>): Promise<void> {
    await fs.mkdir(this.outputDir, { recursive: true })

    const filePath = join(this.outputDir, viewName + '.json')
    await fs.writeFile(filePath, JSON.stringify(contents))
  }
}