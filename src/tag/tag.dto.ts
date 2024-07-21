import { ApiProperty, PartialType } from '@nestjs/swagger'
import { Tag } from '@prisma/client'
import { IsNotEmpty } from 'class-validator'
import { BastQueryDto } from '../common/base-query.dto'

export class CreateTagDto {
  @ApiProperty({
    description: 'tag name',
    example: 'tag',
  })
  @IsNotEmpty()
  name: string

  @ApiProperty({
    description: 'tag desc',
    example: 'desc',
    required: false,
  })
  desc: string
}

export class UpdateTagDto extends PartialType(CreateTagDto) {}

export class QueryTagDto extends BastQueryDto {}

export class TagDto implements Tag {
  @ApiProperty()
  id: number

  @ApiProperty()
  name: string

  @ApiProperty({ required: false, nullable: true })
  desc: string

  @ApiProperty()
  createdAt: Date

  @ApiProperty()
  updatedAt: Date
}
