import { Module } from '@nestjs/common'
import { MaterialController } from './material.controller'

@Module({
  controllers: [MaterialController],
})
export class MaterialModule {}
