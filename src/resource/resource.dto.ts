import { ApiProperty } from '@nestjs/swagger'
import { IsEnum, IsOptional } from 'class-validator'
import { BastQueryDto } from 'src/common/base-query.dto'
import { File, Resource } from '@prisma/client'
import { getInstance } from 'src/minio'
import { BadRequestException } from '@nestjs/common'

export enum ResourceType {
  Svg = 'Svg',
  Image = 'Image',
  Font = 'Font',
}

// 前端传ResourceType 数据库存ResourceTypeForDB
export enum ResourceTypeForDB {
  Svg,
  Image,
  Font,
}

export class CreateResourceDto {
  @ApiProperty({
    description: '资源类型',
    example: ResourceType.Svg,
  })
  // @IsEnum(ResourceType)
  type: ResourceType

  get typeForDB() {
    return ResourceTypeForDB[this.type]
  }

  // 只是给swagger增加上传文件参数
  @ApiProperty({ type: 'string', format: 'binary' })
  file: any

  constructor(data: Record<string, any>) {
    if (ResourceType[data.type]) {
      this.type = data.type
    }
    else {
      throw new BadRequestException(`type must be one of ${Object.keys(ResourceType).join(',')}`)
    }
  }
}

export class QueryResourceDto extends BastQueryDto {
  @ApiProperty({ description: '资源类型', example: 'Svg', required: false })
  @IsEnum(ResourceType)
  @IsOptional()
  type?: ResourceType

  get typeForDB() {
    return ResourceTypeForDB[this.type]
  }
}

export class ResourceDto implements Partial<Resource> {
  @ApiProperty()
  id: number

  @ApiProperty()
  type: number

  @ApiProperty({ required: false, nullable: true })
  space: string | null

  @ApiProperty({ required: false, nullable: true })
  shareSpaces: string | null

  @ApiProperty({ required: false, nullable: true })
  url?: string

  @ApiProperty({ required: false, nullable: true })
  content?: string

  @ApiProperty()
  createdAt: Date

  @ApiProperty()
  updatedAt: Date

  constructor(resource: Resource & { file: File }) {
    this.id = resource.id
    this.type = resource.type
    this.space = resource.space
    this.shareSpaces = resource.shareSpaces
    this.url = resource.file?.url
    this.content = resource.file?.content
    this.createdAt = resource.createdAt
    this.updatedAt = resource.updatedAt
  }
}

export class ResourceListDto {
  data: ResourceDto[]

  constructor(resourceList: (Resource & { file: File })[]) {
    this.data = resourceList.map(i => new ResourceDto(i))
  }

  async buildList() {
    const urls: string[] = await Promise.all(
      this.data.map(i => i.url
        ? getInstance().presignedUrlFromUri(i.url)
        : Promise.resolve(null)),
    )
    const res = this.data.map((i, index) => ({ ...i, url: urls[index] }))
    return res
  }
}
