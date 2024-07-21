import { NestFactory } from '@nestjs/core'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { ValidationPipe } from '@nestjs/common'
import * as dotenv from 'dotenv'
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify'
// import formbody from '@fastify/formbody'
import FastifyMultipart from '@fastify/multipart'
import { AppModule } from './app.module'
import { AllExceptionsFilter } from './common/http-exception.filter'
import { LoggingInterceptor } from './common/logging.interceptor'
import { BigIntInterceptor } from './common/big-int.interceptor'
import { PinoLogger } from './common/pino-logger'

const env = dotenv.config({ path: ['.env'] })

const PORT = env.parsed?.PORT || 8010

async function bootstrap() {
  const logger = new PinoLogger(process.env.NODE_ENV === 'production' ? 'trace' : 'info')

  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({
      bodyLimit: 1024 * 1024 * 50,
    }),
    {
      logger,
    },
  )

  // app.register(formbody, {
  //   bodyLimit: 1024 * 1024 * 50,
  // })

  // @ts-expect-error
  app.register(FastifyMultipart, {
    limits: {
      fieldSize: 1024 * 1204 * 50,
    },
  })

  app.enableCors()

  app.setGlobalPrefix('api')

  const config = new DocumentBuilder()
    .setTitle('example')
    .setDescription('The API description')
    .setVersion('1.0')
    .addBearerAuth()
    .build()
  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('/api/docs', app, document)

  // 必须实例化filter，因为无法di到内部
  // https://docs.nestjs.com/v7/exception-filters#binding-filters
  app.useGlobalFilters(new AllExceptionsFilter())

  // 添加全局日志
  app.useGlobalInterceptors(new LoggingInterceptor())

  app.useGlobalPipes(new ValidationPipe({ transform: true }))

  // app.useGlobalInterceptors(new ResponseInterceptor())

  await app.listen(PORT, '0.0.0.0')

  logger.log(`listening http://localhost:${PORT}/api`)
}

bootstrap()
