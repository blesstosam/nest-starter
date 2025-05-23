import { Module } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { FileController } from './file.controller'
import { FileService } from './file.service'

@Module({
  controllers: [FileController],
  providers: [FileService, PrismaService],
})
export class FileModule {}
