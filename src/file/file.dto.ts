import { ApiProperty } from '@nestjs/swagger'
import { File } from '@prisma/client'

export class FileDto implements File {
  content: string
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
  createdAt: Date

  @ApiProperty()
  updatedAt: Date
}
