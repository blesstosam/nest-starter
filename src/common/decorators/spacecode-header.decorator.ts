import { SetMetadata, applyDecorators } from '@nestjs/common'
import { ApiHeader } from '@nestjs/swagger'

export function SpacecodeHeader(required = false) {
  return applyDecorators(
    SetMetadata('swagger/apiHeader', { required }),
    ApiHeader({
      name: 'X-Space-Code',
      required,
      schema: {
        default: 'default',
        type: 'string',
      },
    }),
  )
}
