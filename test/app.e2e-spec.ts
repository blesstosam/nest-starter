import type { TestingModule } from '@nestjs/testing'
import { Test } from '@nestjs/testing'
import { ValidationPipe } from '@nestjs/common'
import { FastifyAdapter, type NestFastifyApplication } from '@nestjs/platform-fastify'
import * as request from 'supertest'
import { useContainer } from 'class-validator'
import { PrismaService } from '../src/prisma.service'
import { AppModule } from './../src/app.module'

describe('TagController (e2e)', () => {
  let app: NestFastifyApplication
  let prisma: PrismaService

  const tagShape = expect.objectContaining({
    id: expect.any(Number),
    name: expect.any(String),
    desc: expect.any(String),
    createdAt: expect.any(String),
    updatedAt: expect.any(String),
  })

  const tag1 = {
    id: 1,
    name: 'name',
    desc: 'desc',
  }

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleFixture.createNestApplication<NestFastifyApplication>(
      new FastifyAdapter({
        bodyLimit: 1024 * 1024 * 50,
      }),

    )

    prisma = app.get<PrismaService>(PrismaService)

    useContainer(app.select(AppModule), { fallbackOnErrors: true })
    // app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }))
    app.useGlobalPipes(new ValidationPipe({ transform: true }))
    app.setGlobalPrefix('api')

    await app.init()
    await app.getHttpAdapter().getInstance().ready()

    await prisma.tag.create({
      data: tag1,
    })
  })

  describe('GET /api/tag', () => {
    it('returns a list of tags', async () => {
      const { status, body } = await request(app.getHttpServer())
        .get('/api/tag')

      expect(status).toBe(200)
      expect(body.total).toEqual(1)
      expect(body.list).toStrictEqual(expect.arrayContaining([tagShape]))
      expect(body.list).toHaveLength(1)
      expect(body.list[0].name).toEqual(tag1.name)
      expect(body.list[0].desc).toEqual(tag1.desc)
    })
  })

  describe('GET /api/tag/{id}', () => {
    it('returns a given tag', async () => {
      const { status, body } = await request(app.getHttpServer()).get(
        `/api/tag/${tag1.id}`,
      )

      expect(status).toBe(200)
      expect(body).toStrictEqual(tagShape)
      expect(body.id).toEqual(tag1.id)
    })

    it('fails to return non existing tag', async () => {
      const { status } = await request(app.getHttpServer()).get(
        `/api/tag/100`,
      )

      expect(status).toBe(404)
    })

    it('fails to return tag with invalid id type', async () => {
      const { status } = await request(app.getHttpServer()).get(
        `/api/tag/string-id`,
      )

      expect(status).toBe(400)
    })
  })

  describe('POST /api/tag', () => {
    it('creates an tag', async () => {
      const beforeCount = await prisma.tag.count()

      const { status } = await request(app.getHttpServer())
        .post('/api/tag')
        .send({
          name: 'tag1',
          desc: 'tagdesc1',
        })

      const afterCount = await prisma.tag.count()

      expect(status).toBe(201)
      expect(afterCount - beforeCount).toBe(1)
    })
  })
})
