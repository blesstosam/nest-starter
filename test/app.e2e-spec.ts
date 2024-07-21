import type { TestingModule } from '@nestjs/testing'
import { Test } from '@nestjs/testing'
import { type INestApplication, ValidationPipe } from '@nestjs/common'
import * as request from 'supertest'
import { useContainer } from 'class-validator'
import { PrismaService } from '../src/prisma.service'
import { AppModule } from './../src/app.module'

describe('TagController (e2e)', () => {
  let app: INestApplication
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

    app = moduleFixture.createNestApplication()

    prisma = app.get<PrismaService>(PrismaService)

    useContainer(app.select(AppModule), { fallbackOnErrors: true })
    // app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }))
    app.useGlobalPipes(new ValidationPipe({ transform: true }))
    app.setGlobalPrefix('api')

    await app.init()

    await prisma.tag.create({
      data: tag1,
    })
  })

  describe('GET /api/tags', () => {
    it('returns a list of tags', async () => {
      const { status, body } = await request(app.getHttpServer())
        .get('/api/tags')

      expect(status).toBe(200)
      expect(body.total).toEqual(1)
      expect(body.list).toStrictEqual(expect.arrayContaining([tagShape]))
      expect(body.list).toHaveLength(1)
      expect(body.list[0].name).toEqual(tag1.name)
      expect(body.list[0].desc).toEqual(tag1.desc)
    })
  })

  describe('GET /api/tags/{id}', () => {
    it('returns a given tag', async () => {
      const { status, body } = await request(app.getHttpServer()).get(
        `/api/tags/${tag1.id}`,
      )

      expect(status).toBe(200)
      expect(body).toStrictEqual(tagShape)
      expect(body.id).toEqual(tag1.id)
    })

    it('fails to return non existing tag', async () => {
      const { status } = await request(app.getHttpServer()).get(
        `/api/tags/100`,
      )

      expect(status).toBe(404)
    })

    it('fails to return tag with invalid id type', async () => {
      const { status } = await request(app.getHttpServer()).get(
        `/api/tags/string-id`,
      )

      expect(status).toBe(400)
    })
  })

  describe('POST /api/tags', () => {
    it('creates an tag', async () => {
      const beforeCount = await prisma.tag.count()

      const { status } = await request(app.getHttpServer())
        .post('/api/tags')
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
