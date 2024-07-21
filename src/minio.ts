import * as stream from 'node:stream'
import * as Minio from 'minio'
import { Logger } from '@nestjs/common'
import { MINIO_BUCKET, MINIO_ENDPOINT_FE } from './common/constants'

export class MinioHelper {
  private logger = new Logger('MinioHelper')

  client: Minio.Client

  bucket: string

  useSSL: boolean

  constructor(bucket: string) {
    this.bucket = bucket
    this.useSSL = false
    this.client = new Minio.Client({
      endPoint: process.env.MINIO_ENDPOINT,
      port: Number(process.env.MINIO_PORT),
      accessKey: process.env.MINIO_ACCESS,
      secretKey: process.env.MINIO_SECRET,
      useSSL: this.useSSL,
    })
  }

  async ensureBucket() {
    const { bucket } = this
    // bucketExists报错 Valid and authorized credentials required
    // 使用listBuckets替代
    // const exists = await this.client.bucketExists(bucket)
    const bucketList = await this.listBuckets()
    if (bucketList.find(i => i.name === bucket)) {
      this.logger.log(`Bucket ${bucket} exists.`)
    }
    else {
      await this.client.makeBucket(bucket)
      this.logger.log(`Bucket ${bucket} created`)
    }
  }

  async listBuckets() {
    return this.client.listBuckets()
  }

  // If an object with the same name exists,
  // it is updated with new data
  async fPutObject(destination: string, sourcePath: string) {
    await this.client.fPutObject(this.bucket, destination, sourcePath)
  }

  async putObject(destination: string, stream: stream.Readable) {
    await this.client.putObject(this.bucket, destination, stream)
  }

  genFileUrl(filekey: string) {
    return `${this.useSSL ? 'https' : 'http'}://${process.env.MINIO_ENDPOINT}/${this.bucket}/${filekey}`
  }

  async presignedUrl(filekey: string) {
    const url = await this.client.presignedUrl('GET', this.bucket, filekey, 24 * 60 * 60)
    return url.replace(process.env.MINIO_ENDPOINT, MINIO_ENDPOINT_FE)
  }

  async presignedUrlFromUri(uri: string) {
    const fileKey = uri.split('/').pop()
    return this.presignedUrl(fileKey)
  }
}

let instance: MinioHelper
export function getInstance() {
  if (!instance) {
    instance = new MinioHelper(MINIO_BUCKET)
  }
  return instance
}
