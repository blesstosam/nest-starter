import { Body, Controller, Delete, Get, NotFoundException, Param, ParseIntPipe, Patch, Post, Query } from '@nestjs/common'
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger'
import { ApiPageResponse } from 'src/common/decorators/api-page-response.decorator'
import { TagService } from './tag.service'
import { CreateTagDto, QueryTagDto, TagDto, UpdateTagDto } from './tag.dto'

@ApiTags('标签')
@Controller('tag')
export class TagController {
  constructor(
    private readonly selfService: TagService,
  ) {}

  @Get()
  @ApiPageResponse({ type: TagDto })
  async findAll(@Query() query: QueryTagDto) {
    const { pageSize, keyword, skip } = query
    const where = keyword
      ? {
          OR: [
            { name: { contains: keyword } },
            { email: { contains: keyword } },
          ],
        }
      : undefined

    const [list, total] = await Promise.all([
      this.selfService.list({
        skip,
        take: pageSize,
        where,
      }),
      this.selfService.count(where),
    ])

    return { list, total }
  }

  @Get(':id')
  @ApiOkResponse({ type: TagDto })
  // 使用ParseIntPipe而非Number(id)的好处：如果parse失败会抛出友好信息错误
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const res = await this.selfService.findUnique({ id })
    if (!res) {
      throw new NotFoundException(`Could not find tag with ${id}.`)
    }
    return res
  }

  @Post()
  @ApiCreatedResponse({ type: TagDto })
  create(@Body() createDto: CreateTagDto) {
    return this.selfService.create(createDto)
  }

  @Delete(':id')
  @ApiOkResponse({ type: TagDto })
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.selfService.delete({ id })
  }

  @Patch(':id')
  @ApiOkResponse({ type: TagDto })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateTagDto,
  ) {
    return this.selfService.update({ where: { id }, data: updateDto })
  }
}
