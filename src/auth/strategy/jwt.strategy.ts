import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy, StrategyOptions } from 'passport-jwt'
import { Injectable, UnauthorizedException } from '@nestjs/common'
import { PrismaService } from '../../prisma.service'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private prisma: PrismaService) {
    super({
      // 从 header 的 Authorization 字段获取 token
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET,
      ignoreExpiration: false,
      algorithms: ['HS256'],
    })
  }

  // 该 id 为 constructor 执行完传递过来的
  // validate 返回的数据继续向下传递 这里会传递到 router handler - 挂在 req.user 上
  async validate({ userId }: { userId: number }) {
    if (userId) {
      const user = await this.prisma.user.findFirst({ where: { id: userId } })
      if (user) {
        return user
      }
    }
    throw new UnauthorizedException(`userId ${userId} not found`)
  }
}
