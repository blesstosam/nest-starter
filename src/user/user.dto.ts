import { ApiProperty, PartialType } from '@nestjs/swagger'
import { User } from '@prisma/client'
import { Transform } from 'class-transformer'
import * as sha256 from 'crypto-js/sha256'
import { IsInt } from 'class-validator'
import { METACODE_ENDPOINT_FE } from 'src/common/constants'
import { BastQueryDto } from '../common/base-query.dto'

export class CreateUserDto {
  @ApiProperty({ example: 1 })
  @IsInt()
  userId: number

  @ApiProperty()
  username: string

  @ApiProperty({ required: false, nullable: true })
  fullName?: string

  @ApiProperty({ required: false, nullable: true })
  avatar?: string

  @ApiProperty({ example: 123 })
  @Transform(({ value }) => sha256(value).toString(), { toClassOnly: true })
  password: string

  // 使用new来创建对象需要定义constructor
  // nestjs使用@Body装饰器也会调用该方法 但是不会传参数 所以payload为可选的
  constructor(payload?: {
    userId: number
    username: string
    fullName?: string
    avatar?: string
    password: string
  }) {
    if (payload) {
      const { userId, username, fullName, avatar, password } = payload
      this.userId = userId
      this.username = username
      this.avatar = avatar
      this.fullName = fullName
      this.password = sha256(password).toString()
    }
  }
}

export class UpdateUserDto extends PartialType(CreateUserDto) {}

export class QueryUserDto extends BastQueryDto {}

export class UserDto implements Partial<User> {
  @ApiProperty()
  id: number

  @ApiProperty()
  userId: number

  @ApiProperty()
  username: string

  @ApiProperty({ required: false, nullable: true })
  fullName: string

  @ApiProperty({ required: false, nullable: true })
  avatar: string

  @ApiProperty()
  createdAt: Date

  @ApiProperty()
  updatedAt: Date

  constructor(user: User) {
    this.id = user.id
    this.userId = user.userId
    this.username = user.username
    this.fullName = user.fullName
    this.avatar = METACODE_ENDPOINT_FE + user.avatar
    this.createdAt = user.createdAt
    this.updatedAt = user.updatedAt
  }
}
