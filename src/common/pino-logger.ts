import { join } from 'node:path'
import { ConsoleLogger } from '@nestjs/common'
import pino, { Logger } from 'pino'
import PinoHttp, { HttpLogger } from 'pino-http'
import { ensureDir } from 'fs-extra'

export function getCurrentTime() {
  return new Date().toLocaleString('en-US', {
    // https://en.wikipedia.org/wiki/List_of_tz_database_time_zones
    timeZone: 'Asia/Brunei',
    hour12: false,
  })
}

// --------------- error  |  warn  |  log   |  debug  |  verbose
// --------------- 50     | 40     | 30     | 20      |  10
type PinoLevels = 'error' | 'warn' | 'info' | 'debug' | 'trace'

const LogOptions = {
  frequency: 'daily',
  dateFormat: 'yyyy-MM-dd',
  extension: '.log',
}

export class PinoLogger extends ConsoleLogger {
  private logger: Logger
  private httpLogger: HttpLogger

  constructor(logLevel: PinoLevels) {
    super()

    const errorPath = join(__dirname, '../../logs/error')
    const combinedPath = join(__dirname, '../../logs/combined')

    ensureDir(join(__dirname, '../../logs'))

    this.logger = pino({ level: logLevel }, pino.transport({
      targets: [
        {
          target: 'pino-roll',
          level: 'error',
          options: { file: errorPath, ...LogOptions },
        },
        {
          target: 'pino-roll',
          level: logLevel,
          options: { file: combinedPath, ...LogOptions },
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
      target: 'pino-roll',
      options: { file: combinedPath, ...LogOptions },
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
