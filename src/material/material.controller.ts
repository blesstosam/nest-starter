import { Controller, Get } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'

@ApiTags('物料')
@Controller('materials')
export class MaterialController {
  @Get('')
  findAll() {
    return []
  }
}
