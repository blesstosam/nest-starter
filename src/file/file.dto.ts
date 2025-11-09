import { ApiProperty } from '@nestjs/swagger'
import { File } from '../generated/prisma/client'

export class FileDto implements File {
  @ApiProperty()
  id: number

  @ApiProperty()
  key: string

  @ApiProperty()
  name: string

  @ApiProperty()
  size: bigint

  @ApiProperty()
  type: string

  @ApiProperty()
  url: string

  @ApiProperty()
  content: string

  @ApiProperty()
  createdAt: Date

  @ApiProperty()
  updatedAt: Date
}
