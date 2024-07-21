declare interface UploadFileRes {
  fieldname: string
  originalname: string
  encoding: string
  mimetype: string
  destination: string
  filename: string
  path: string
  size: number
}

interface MultipartRequest extends FastifyRequest {
  parts: () => AsyncIterableIterator<any>
}
