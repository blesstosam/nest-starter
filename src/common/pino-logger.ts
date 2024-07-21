import { join } from 'node:path'
import { ConsoleLogger } from '@nestjs/common'
import pino, { Logger } from 'pino'
import PinoHttp, { HttpLogger } from 'pino-http'
import { ensureFileSync } from 'fs-extra'

export function getCurrentTime() {
  return new Date().toLocaleString('en-US', {
    // https://en.wikipedia.org/wiki/List_of_tz_database_time_zones
    timeZone: 'Asia/Brunei', // PRC 在chrome里可以，在node里不行
    hour12: false,
  })
}

// TODO 文件过大时候轮转
// https://juejin.cn/post/7335245199109455908
// https://github.com/pinojs/pino/issues/1323

// --------------- error  |  warn  |  log   |  debug  |  verbose
// --------------- 50     | 40     | 30     | 20      |  10
type PinoLevels = 'error' | 'warn' | 'info' | 'debug' | 'trace'

export class PinoLogger extends ConsoleLogger {
  private logger: Logger
  private httpLogger: HttpLogger

  constructor(logLevel: PinoLevels) {
    super()

    const errorPath = join(__dirname, '../../logs/error.log')
    const combinedPath = join(__dirname, '../../logs/combined.log')

    ensureFileSync(errorPath)
    ensureFileSync(combinedPath)

    this.logger = pino({ level: logLevel }, pino.transport({
      targets: [
        {
          target: 'pino/file',
          level: 'error',
          options: { destination: errorPath },
        },
        {
          target: 'pino/file',
          level: logLevel,
          options: { destination: combinedPath },
        },
        {
          target: process.env.NODE_ENV === 'production' ? 'pino/file' : 'pino-pretty',
          level: logLevel,
          // destination=1表示控制台输出
          options: { destination: 1 },
        },
      ],
    }))

    this.httpLogger = PinoHttp({ level: logLevel }, pino.transport({
      target: 'pino/file',
      options: { destination: combinedPath },
    }))
  }

  log(message: any, ctx?: any) {
    if (ctx === 'LoggingInterceptor') {
      // response拦截日志，只写文件
      const { request, response, data } = message
      this.httpLogger(request, response)
      // pino-http不能打印response data 手动打印出来
      this.httpLogger.logger.info(`[${ctx}] response data: ${JSON.stringify(data)}`)
    }
    else {
      this.logger.info(`[${ctx}] ${message}`)
    }
  }

  error(message: any, trace?: string, ctx?: any) {
    this.logger.error(`[${ctx}] ${message}`)
  }

  warn(message: string, ctx?: any) {
    this.logger.warn(`[${ctx}] ${message}`)
  }

  debug(message: string, ctx?: any) {
    this.logger.debug(`[${ctx}] ${message}`)
  }

  verbose(message: string, ctx?: any) {
    this.logger.trace(`[${ctx}] ${message}`)
  }
}
