import { Body, Controller, HttpException, InternalServerErrorException, Logger, Post, UseGuards } from '@nestjs/common'
import { ApiOkResponse, ApiTags } from '@nestjs/swagger'
import { HttpService } from '@nestjs/axios'
import { JwtService } from '@nestjs/jwt'
import { UserService } from 'src/user/user.service'
import { CreateUserDto, UserDto } from 'src/user/user.dto'
import { AuthGuard } from '@nestjs/passport'
import { CurrentUser } from 'src/common/decorators/current-user.decorator'
import { User } from '@prisma/client'
import { LoginResDto, LoginUserDto } from './auth.dto'
import { AuthService } from './auth.service'

@ApiTags('鉴权')
@Controller('auth')
export class AuthController {
  private logger = new Logger('AuthController')

  constructor(
    private httpService: HttpService,
    private jwtService: JwtService,
    private userService: UserService,
    private selfService: AuthService,
  ) {}

  @UseGuards(AuthGuard(['local']))
  @Post('login')
  @ApiOkResponse({ type: LoginResDto })
  async login(@Body() body: LoginUserDto, @CurrentUser() user: User): Promise<LoginResDto> {
    return this.selfService.login(user)
  }

  @Post('login/third')
  @ApiOkResponse({ type: LoginResDto })
  async loginByThird(@Body() body: LoginUserDto): Promise<LoginResDto> {
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
        thirdPartyUserId: userId,
        username,
        fullName,
        avatar,
        password,
      })

      const user = await this.userService.create(createUserDto)

      return {
        ...new UserDto(user),
        userId: res.data.userId,
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
