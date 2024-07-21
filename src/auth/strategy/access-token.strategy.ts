import { PassportStrategy } from '@nestjs/passport'
import { PrismaService } from 'src/prisma.service'
import { HttpException, Injectable, Logger } from '@nestjs/common'
import axios from 'axios'
import { CreateUserDto } from 'src/user/user.dto'
import { IStrategyOptions, Strategy } from './passport-access-token'

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(Strategy, 'accessToken') {
  private logger = new Logger('AccessTokenStrategy')

  constructor(private prisma: PrismaService) {
    super({} as IStrategyOptions)
  }

  async validate({ token, spaceCode }: { token: string, spaceCode: string }) {
    if (token) {
      try {
        const res = await axios({
          url: `${process.env.METACODE_ENDPOINT}/api/userinfo`,
          method: 'get',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
            'X-Space-Code': spaceCode,
          },
        })

        // 请求userinfo接口 如果报错不返回
        // 查找数据库user 如果找不到 创建用户 返回用户；如果找到 直接返回用户
        const localUser = await this.prisma.user.findFirst({ where: { userId: res.data.userId } })
        if (localUser) {
          return localUser
        }

        const { userId, username, fullName, avatar, password } = res.data
        const createUserDto = new CreateUserDto({
          userId,
          username,
          fullName,
          avatar,
          password,
        })

        const user = await this.prisma.user.create({ data: createUserDto })
        return user
      }
      catch (err) {
        this.logger.error(err)
        throw new HttpException('req metacode userinfo error', 500)
      }
    }
  }
}
