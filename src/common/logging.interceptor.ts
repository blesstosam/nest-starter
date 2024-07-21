import { CallHandler, ExecutionContext, Injectable, Logger, NestInterceptor } from '@nestjs/common'
import { Observable } from 'rxjs'
import { tap } from 'rxjs/operators'
import { FastifyReply, FastifyRequest } from 'fastify'

export function getCurrentTime() {
  return new Date().toLocaleString('en-US', {
    // https://en.wikipedia.org/wiki/List_of_tz_database_time_zones
    timeZone: 'Asia/Brunei', // PRC 在chrome里可以，在node里不行
    hour12: false,
  })
}

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private logger = new Logger('LoggingInterceptor')

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest<FastifyRequest>()
    const response = context.switchToHttp().getResponse<FastifyReply>()
    return next.handle().pipe(
      tap((data) => {
        this.logger.log({ request: request.raw, response: response.raw, data })
      }),
    )
  }
}
