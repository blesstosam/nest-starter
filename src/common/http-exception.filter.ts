import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus, Logger } from '@nestjs/common'
import { Prisma } from '../generated/prisma/client'
import { FastifyReply, FastifyRequest } from 'fastify'

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private logger = new Logger('AllExceptionsFilter')

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<FastifyReply>()
    const request = ctx.getRequest<FastifyRequest>()

    let statusCode = HttpStatus.INTERNAL_SERVER_ERROR
    let message = (exception as Error).message

    if (exception instanceof HttpException) {
      statusCode = exception.getStatus()
      const res = exception.getResponse()
      message = typeof res === 'object' ? (exception.getResponse() as Record<string, string>)?.message : res
    }
    // TODO handle other error code
    else if (exception instanceof Prisma.PrismaClientKnownRequestError) {
      switch (exception.code) {
        case 'P2002':
          statusCode = HttpStatus.CONFLICT
          break
        default:
          break
      }
    }

    this.logger.error(exception)
    response.status(statusCode).send({
      statusCode,
      message,
      path: request.url,
    })
  }
}
