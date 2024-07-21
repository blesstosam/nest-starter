import { BadRequestException } from '@nestjs/common'
import { ApiProperty } from '@nestjs/swagger'
import { Transform } from 'class-transformer'

export function parseIntPipe({ value }) {
  const val = Number.parseInt(value, 10)
  if (Number.isNaN(val)) {
    throw new BadRequestException('Validation failed (numeric string is expected)')
  }
  return val
}

export class BastQueryDto {
  @ApiProperty({ description: '模糊搜索', example: '', required: false })
  keyword?: string

  @ApiProperty({ description: '每页个数', example: 20, required: false })
  @Transform(parseIntPipe, { toClassOnly: true })
  pageSize: number = 20

  @ApiProperty({ description: '页数', example: 1, required: false })
  @Transform(parseIntPipe, { toClassOnly: true })
  current: number = 1

  get skip(): number {
    return (this.current - 1) * this.pageSize
  }
}
