import { ExecutionContext, createParamDecorator } from '@nestjs/common'
import { FastifyRequest } from 'fastify'
import { UserDto } from 'src/user/user.dto'

interface RequestWithUser extends FastifyRequest {
  user: UserDto
}

export const CurrentUser = createParamDecorator((data, ctx: ExecutionContext) => {
  const req = ctx.switchToHttp().getRequest<RequestWithUser>()
  return req.user
})
