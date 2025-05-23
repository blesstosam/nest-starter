import type { Type } from '@nestjs/common'
import { applyDecorators } from '@nestjs/common'
import type { ApiResponseOptions } from '@nestjs/swagger'
import { ApiExtraModels, ApiOkResponse, getSchemaPath } from '@nestjs/swagger'

export function ApiPageResponse<T extends Type>(options: {
  type: T
  description?: string
}): MethodDecorator {
  return applyDecorators(
    ApiExtraModels(options.type),
    ApiOkResponse({
      description: options.description,
      schema: {
        allOf: [
          {
            properties: {
              total: {
                type: 'number',
                example: 1,
              },
              list: {
                type: 'array',
                items: { $ref: getSchemaPath(options?.type) },
              },
            },
          },
        ],
      },
    } as ApiResponseOptions | undefined),
  )
}
