import { Controller, Get, Headers, HttpCode, HttpStatus, Logger, Post, Query, Req, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOkResponse, ApiTags } from '@nestjs/swagger'
import { FileService } from 'src/file/file.service'
import { nanoid } from 'nanoid'
import { CurrentUser } from 'src/common/decorators/current-user.decorator'
import { User } from '@prisma/client'
import { AuthGuard } from '@nestjs/passport'
import { API_PREFIX } from 'src/common/constants'
import { FileDto } from 'src/file/file.dto'
import { SpacecodeHeader } from '../common/decorators/spacecode-header.decorator'
import { ApiPageResponse } from '../common/decorators/api-page-response.decorator'
import { getInstance } from '../minio'
import { CreateResourceDto, QueryResourceDto, ResourceDto, ResourceListDto, ResourceType } from './resource.dto'
import { ResourceService } from './resource.service'

@ApiTags('资源')
@ApiBearerAuth()
// jwt和accessToken的顺序不能动 否则报错 why？
@UseGuards(AuthGuard(['jwt', 'accessToken']))
@Controller('resource')
export class ResourceController {
  private minio = getInstance()

  constructor(
    private readonly selfService: ResourceService,
    private readonly fileService: FileService,
  ) {}

  @Get()
  @ApiPageResponse({ type: ResourceDto })
  @SpacecodeHeader()
  async findAll(
    @Query() query: QueryResourceDto,
    @CurrentUser() user: User,
    @Headers('X-Space-Code') spaceCode?: string,
  ) {
    const { pageSize, skip, typeForDB } = query
    const where = typeForDB != null ? { space: spaceCode, type: typeForDB } : { space: spaceCode }
    const [list, total] = await Promise.all([
      this.selfService.list({
        skip,
        take: pageSize,
        where,
        include: {
          file: {
            select: {
              url: true,
              content: true,
            },
          },
        },
      }),
      this.selfService.count(where),
    ])

    // 将部分逻辑封装到DTO中去
    const dtoList = await new ResourceListDto(list).buildList()

    return {
      list: dtoList,
      total,
    }
  }

  @Post()
  @ApiOkResponse({ type: ResourceDto })
  @HttpCode(HttpStatus.CREATED)
  @SpacecodeHeader()
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'File to upload',
    type: CreateResourceDto,
  })
  async create(
    @Req() request: MultipartRequest,
    @CurrentUser() user: User,
    @Headers('X-Space-Code') spaceCode?: string,
  ) {
    const parts = request.parts()

    let buf: any
    const fileObj: { key: string, name: string, type: string } = {
      key: '',
      name: '',
      type: '',
    }
    const dto: Record<string, any> = {}
    for await (const part of parts) {
      if (part.type === 'file') {
        fileObj.key = `${nanoid(10)}_${part.filename}`
        fileObj.name = part.filename
        fileObj.type = part.mimetype
        buf = await part.toBuffer()
      }
      else {
        dto[part.fieldname] = part.value
      }
    }

    const createDto = new CreateResourceDto(dto)

    let fileRes: FileDto
    // 如果是svg 写一条file即可
    if (createDto.type === ResourceType.Svg) {
      fileRes = await this.fileService.create({
        ...fileObj,
        size: buf.length,
        content: buf.toString('utf8'),
      })
    }
    else {
    // 如果是其他 上传到minio 再写一条file
      await this.minio.putObject(fileObj.key, buf)

      const url = `/files/fetch/${fileObj.key}`
      fileRes = await this.fileService.create({
        ...fileObj,
        size: buf.length,
        url,
      })
    }

    const res = await this.selfService.create({
      type: createDto.typeForDB,
      space: spaceCode,
      ownerId: user.id,
      file: {
        connect: { id: fileRes.id },
      },
    })

    return { ...res, file: fileRes }
  }
}
