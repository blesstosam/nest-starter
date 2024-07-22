import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'

// import * as fastJson from 'fast-json-stringify'

// const stringify = fastJson({
//   type: 'object',
//   additionalProperties: true,
//   properties: {
//     aa: {
//       type: 'number',
//     },
//   },
// })
// console.log(JSON.parse(stringify({ aa: 999n })))

@Injectable()
export class BigIntInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      // 使用setSerializerCompiler或addSchema来定制序列化程序
      // https://fastify.dev/docs/latest/Reference/Validation-and-Serialization/#serializer-compiler
      map(data => JSON.parse(
        JSON.stringify(
          data,
          (key, value) => typeof value === 'bigint' ? value.toString() : value,
        ),
      )),
    )
  }
}
