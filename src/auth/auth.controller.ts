import { Body, Controller, HttpException, InternalServerErrorException, Logger, Post } from '@nestjs/common'
import { ApiOkResponse, ApiTags } from '@nestjs/swagger'
import { HttpService } from '@nestjs/axios'
import { JwtService } from '@nestjs/jwt'
import { UserService } from 'src/user/user.service'
import { CreateUserDto, UserDto } from 'src/user/user.dto'
import { LoginResDto, LoginUserDto } from './auth.dto'

@ApiTags('鉴权')
@Controller('auth')
export class AuthController {
  private logger = new Logger('AuthController')

  constructor(
    private httpService: HttpService,
    private jwtService: JwtService,
    private userService: UserService,
  ) {}

  @Post('login')
  @ApiOkResponse({ type: LoginResDto })
  async login(@Body() body: LoginUserDto): Promise<LoginResDto> {
    const existUser = await this.userService.findOne({ username: body.username })
    if (existUser) {
      return {
        ...new UserDto(existUser),
        token: this.jwtService.sign({ userId: existUser.userId }),
      }
    }

    try {
      const res = await this.httpService.axiosRef({
        url: `${process.env.METACODE_ENDPOINT}/api/login`,
        method: 'post',
        data: body,
        headers: {
          'Content-Type': 'application/json',
        },
      })

      const { userId, username, fullName, avatar, password } = res.data
      const createUserDto = new CreateUserDto({
        userId,
        username,
        fullName,
        avatar,
        password,
      })

      const user = await this.userService.create(createUserDto)

      return {
        ...new UserDto(user),
        token: this.jwtService.sign({ userId: res.data.userId }),
      }
    }
    catch (e) {
      this.logger.error('Login error', e)
      throw new InternalServerErrorException(`Login to metacode failed: ${JSON.stringify(e)}`)
    }
  }

  @Post('logout')
  logout() {
    return true
  }
}
