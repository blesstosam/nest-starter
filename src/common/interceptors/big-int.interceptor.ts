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
      map((data) => {
        // 跳过 undefined/null 和非对象类型
        // 流式响应、文件下载等场景使用 @Res() 装饰器手动控制响应，控制器返回 void/undefined
        // 这些场景不需要进行 JSON 序列化处理
        if (data == null || typeof data !== 'object') {
          return data
        }

        // 使用setSerializerCompiler或addSchema来定制序列化程序
        // https://fastify.dev/docs/latest/Reference/Validation-and-Serialization/#serializer-compiler
        return JSON.parse(
          JSON.stringify(
            data,
            (key, value) => typeof value === 'bigint' ? value.toString() : value,
          ),
        )
      }),
    )
  }
}
