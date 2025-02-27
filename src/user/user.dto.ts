import { ApiProperty, PartialType } from '@nestjs/swagger'
import { User } from '@prisma/client'
import { Transform } from 'class-transformer'
import * as sha256 from 'crypto-js/sha256'
import { IsInt } from 'class-validator'
import { BaseQueryDto } from '../common/base-query.dto'

export class CreateUserDto {
  @ApiProperty({ example: 'user1' })
  username: string

  @ApiProperty({ example: 123 })
  @Transform(({ value }) => sha256(value).toString(), { toClassOnly: true })
  password: string

  @ApiProperty({ required: false, nullable: true })
  fullName?: string

  @ApiProperty({ required: false, nullable: true })
  avatar?: string

  thirdPartyUserId?: number

  // 使用new来创建对象需要定义constructor
  // nestjs使用@Body装饰器也会调用该方法 但是不会传参数 所以payload为可选的
  constructor(payload?: {
    username: string
    fullName?: string
    avatar?: string
    password: string
    thirdPartyUserId?: number
  }) {
    if (payload) {
      const { username, fullName, avatar, password, thirdPartyUserId } = payload
      this.username = username
      this.avatar = avatar
      this.fullName = fullName
      this.password = sha256(password).toString()
      this.thirdPartyUserId = thirdPartyUserId
    }
  }
}

export class UpdateUserDto extends PartialType(CreateUserDto) {}

export class QueryUserDto extends BaseQueryDto {}

export class UserDto implements Partial<User> {
  @ApiProperty()
  id: number

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
    this.username = user.username
    this.fullName = user.fullName
    this.avatar = user.avatar
    this.createdAt = user.createdAt
    this.updatedAt = user.updatedAt
  }
}
