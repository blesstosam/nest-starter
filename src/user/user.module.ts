import { Module } from '@nestjs/common'
import { HttpModule } from '@nestjs/axios'
import { PrismaService } from '../prisma.service'
import { UserController } from './user.controller'
import { UserService } from './user.service'

@Module({
  imports: [
    HttpModule.register({
      timeout: 50000,
      maxRedirects: 5,
    }),
  ],
  controllers: [UserController],
  providers: [UserService, PrismaService],
})
export class UserModule {}
