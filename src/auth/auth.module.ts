import { Module } from '@nestjs/common'
import { HttpModule } from '@nestjs/axios'
import { JwtModule } from '@nestjs/jwt'
import { TOKEN_EXPIRES_IN } from 'src/common/constants'
import { PrismaService } from 'src/prisma.service'
import { UserService } from '../user/user.service'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { JwtStrategy } from './strategy/jwt.strategy'
import { AccessTokenStrategy } from './strategy/access-token.strategy'

@Module({
  imports: [
    HttpModule.register({
      timeout: 50000,
      maxRedirects: 5,
    }),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: TOKEN_EXPIRES_IN },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, UserService, JwtStrategy, AccessTokenStrategy, PrismaService],
})
export class AuthModule {}
