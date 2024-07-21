import { Controller, Get } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'

@ApiTags('文件')
@Controller('files')
export class FileController {
  @Get()
  findAll() {
    return []
  }
}
