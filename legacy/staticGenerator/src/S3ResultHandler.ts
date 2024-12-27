import { ResultHandler } from './ResultHandler'
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3'

export class S3ResultHandler implements ResultHandler {
  public constructor(private bucketName: string) {

  }

  public async handle(viewName: string, contents: Record<string, any>): Promise<void> {
    const s3Client = new S3Client({

    })
    await s3Client.send(new PutObjectCommand({
      Bucket: this.bucketName,
      Key: viewName + '.json',
      Body: JSON.stringify(contents),
      ContentType: 'application/json'
    }))
  }
}