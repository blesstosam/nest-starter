import { Body, Controller, Delete, Get, NotFoundException, Param, ParseIntPipe, Patch, Post, Query, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger'
import { ApiPageResponse } from 'src/common/decorators/api-page-response.decorator'
import { AuthGuard } from '@nestjs/passport'
import { UserService } from './user.service'
import { CreateUserDto, QueryUserDto, UpdateUserDto, UserDto } from './user.dto'

@ApiTags('users')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('users')
export class UserController {
  constructor(
    private readonly selfService: UserService,
  ) {}

  @Get()
  @ApiPageResponse({ type: UserDto })
  async findAll(@Query() query: QueryUserDto) {
    const { pageSize, keyword, skip } = query
    const where = keyword
      ? {
          OR: [
            { username: { contains: keyword } },
            { fullName: { contains: keyword } },
          ],
        }
      : undefined

    const [list, total] = await Promise.all([
      this.selfService.list({
        skip,
        take: pageSize,
        where,
        select: {
          id: true,
          thirdPartyUserId: true,
          username: true,
          fullName: true,
          avatar: true,
          createdAt: true,
          updatedAt: true,
        },
      }),
      this.selfService.count(where),
    ])

    return { list: list.map(i => new UserDto(i)), total }
  }

  @Get(':id')
  @ApiOkResponse({ type: UserDto })
  // 使用ParseIntPipe而非Number(id)的好处：如果parse失败会抛出友好信息错误
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const res = await this.selfService.findUnique({ id }, {
      id: true,
      thirdPartyUserId: true,
      username: true,
      fullName: true,
      avatar: true,
      createdAt: true,
      updatedAt: true,
    })
    if (!res) {
      throw new NotFoundException(`Could not find users with ${id}.`)
    }
    return new UserDto(res)
  }

  @Post()
  @ApiCreatedResponse({ type: UserDto })
  async create(@Body() createDto: CreateUserDto) {
    const user = await this.selfService.create(createDto)
    return new UserDto(user)
  }

  @Delete(':id')
  @ApiOkResponse({ type: UserDto })
  async delete(@Param('id', ParseIntPipe) id: number) {
    const user = await this.selfService.delete({ id })
    return new UserDto(user)
  }

  @Patch(':id')
  @ApiOkResponse({ type: UserDto })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    const user = await this.selfService.update({ where: { id }, data: updateUserDto })
    return new UserDto(user)
  }
}
