import { ExecutionContext, createParamDecorator } from '@nestjs/common'
import { FastifyRequest } from 'fastify'

export const CurrentUser = createParamDecorator((data, ctx: ExecutionContext) => {
  const req = ctx.switchToHttp().getRequest<FastifyRequest>()
  // FIXME fix type
  // @ts-expect-error
  return req.user
})
