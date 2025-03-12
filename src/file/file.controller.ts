import { Controller, Get, NotFoundException, Param, Res } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { FastifyReply } from 'fastify'
import { getInstance } from '../minio'
import { FileService } from './file.service'

@ApiTags('文件')
@Controller('file')
export class FileController {
  private minio = getInstance()

  constructor(
    private readonly selfService: FileService,
  ) {}

  @Get()
  findAll() {
    return []
  }

  @Get('fetch/:key')
  async fetch(@Param('key') _key: string, @Res() res: FastifyReply) {
    const key = globalThis.decodeURIComponent(_key)

    const file = await this.selfService.findUnique({ key })
    if (!file) {
      throw new NotFoundException(`Could not find file ${key}.`)
    }

    // ddyGOG58ak_#screenshot-20240318-110736.png
    // http://localhost:8010/api/files/fetch/ddyGOG58ak_%23screenshot-20240318-110736.png

    const fileStream = await this.minio.getFileStream(key)
    const fileType = file.type
    const filename = file.name

    res
      .header('Content-Type', fileType)
      .header(
        'Content-Disposition',
        fileType.startsWith('application/') ? `attachment; filename="${filename}"` : 'inline',
      )

    return res.send(fileStream)
  }
}
