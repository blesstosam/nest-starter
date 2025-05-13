import { Controller, Get, Logger, NotFoundException, Param, Query, Res } from '@nestjs/common'
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
  private logger = new Logger(FileController.name)

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

    const fileStream = await this.minio.getFileStream(key)
    const fileType = file.type
    const filename = file.name

    // TODO 测试 https://docs.nestjs.com/techniques/streaming-files#streamable-file-class

    // 使用promise包一层能解决偶尔报错问题
    // https://github.com/fastify/fastify/discussions/4764
    // https://github.com/fastify/fastify/issues/3994
    return new Promise((resolve, reject) => {
      res
        .header('Content-Type', fileType)
        .header(
          'Content-Disposition',
          fileType.startsWith('application/') ? `attachment; filename*=UTF-8''${encodeURIComponent(filename)}` : 'inline',
        )

      // 处理文件流错误
      fileStream.on('error', (err) => {
        this.logger.error('文件流错误:', err)
        reject(err)
      })
      return res.send(fileStream)
    })
  }
}
