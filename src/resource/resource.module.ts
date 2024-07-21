import { Module } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { FileService } from '../file/file.service'
import { ResourceController } from './resource.controller'
import { ResourceService } from './resource.service'

@Module({
  controllers: [ResourceController],
  providers: [ResourceService, PrismaService, FileService],
})
export class ResourceModule {

}
