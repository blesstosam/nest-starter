import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common'
import { Observable } from 'rxjs'
import { tap } from 'rxjs/operators'

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    // const request = context.switchToHttp().getRequest()
    const response = context.switchToHttp().getResponse()
    return next.handle().pipe(
      tap((data) => {
        console.log(data, response)
      }),
    )
  }
}
