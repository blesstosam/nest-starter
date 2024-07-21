import { ApiProperty } from '@nestjs/swagger'
import { UserDto } from 'src/user/user.dto'

export class LoginUserDto {
  @ApiProperty({
    description: 'username',
    example: 'xxx',
  })
  username: string

  @ApiProperty({
    description: 'password',
    example: 'xxx',
  })
  password: string

  @ApiProperty({
    description: 'identityType',
    example: 'PASSWORD',
  })
  identityType: string
}

export class LoginResDto extends UserDto {
  @ApiProperty()
  token: string
}
