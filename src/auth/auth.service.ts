import { Injectable } from '@nestjs/common'
import { UserService } from 'src/user/user.service'
import * as sha256 from 'crypto-js/sha256'
import { User } from '@prisma/client'
import { UserDto } from 'src/user/user.dto'
import { JwtService } from '@nestjs/jwt'

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.usersService.findOne({
      username,
      password: sha256(password).toString(),
    })
    if (!user) {
      return null
    }
    return user
  }

  async login(user: User) {
    return {
      ...new UserDto(user),
      userId: user.id,
      token: this.jwtService.sign({ userId: user.id }),
    }
  }
}
