import { Controller, Get, NotFoundException, Param, Query, Res } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { FastifyReply } from 'fastify'
import { BaseQueryDto } from 'src/common/base-query.dto'
import { ApiPageResponse } from 'src/common/decorators/api-page-response.decorator'
import { getInstance } from '../minio'
import { FileService } from './file.service'
import { FileDto } from './file.dto'

@ApiTags('文件')
@Controller('file')
export class FileController {
  private minio = getInstance()

  constructor(
    private readonly selfService: FileService,
  ) {}

  @Get()
  @ApiPageResponse({ type: FileDto })
  async findAll(@Query() query: BaseQueryDto) {
    const { pageSize, skip } = query
    const [list, total] = await Promise.all([
      this.selfService.list({
        skip,
        take: pageSize,
      }),
      this.selfService.count(),
    ])

    return { list, total }
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
        fileType.startsWith('application/') ? `attachment; filename*=UTF-8''${globalThis.encodeURIComponent(filename)}` : 'inline',
      )

    return res.send(fileStream)
  }
}
