import { basename as basenameFn, extname as extnameFn, join } from 'node:path'
import { writeFileSync } from 'node:fs'
import { Controller, Get, HttpCode, HttpStatus, Post, Req } from '@nestjs/common'
import { ApiBody, ApiConsumes, ApiProperty, ApiTags } from '@nestjs/swagger'
import { AppService } from './app.service'
import { getInstance } from './minio'

class CreateUploadDto {
  @ApiProperty({ type: 'string', format: 'binary' })
  file: any
}

@ApiTags('common')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello()
  }

  @Get('buckets')
  async getAllBuckets() {
    return await getInstance().listBuckets()
  }

  @Post('upload')
  @HttpCode(HttpStatus.CREATED)
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'File to upload',
    type: CreateUploadDto,
  })
  async uploadFile(@Req() request: MultipartRequest) {
    const uploadDir = join(__dirname, '../public/upload')
    const parts = request.parts()
    const files = []

    for await (const part of parts) {
      if (part.file) {
        const extname = extnameFn(part.filename)
        const basename = basenameFn(part.filename, extname)
        const filename = `${basename}_${Date.now()}${extname}`
        const filepath = join(uploadDir, filename)

        let size = 0
        part.file.on('data', (chunk) => {
          size += chunk.length
        })

        await part.toBuffer().then((buffer) => {
          writeFileSync(filepath, buffer)
        })

        files.push({
          filename: part.filename,
          mimetype: part.mimetype,
          size,
          path: filepath,
        })
      }
    }
    return { files }
  }
}
