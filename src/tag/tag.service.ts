import { Injectable } from '@nestjs/common'
import { Prisma, Tag } from '@prisma/client'
import { PrismaService } from '../prisma.service'

@Injectable()
export class TagService {
  constructor(private prisma: PrismaService) {}

  async findUnique(
    whereUniqueInput: Prisma.TagWhereUniqueInput,
  ): Promise<Tag | null> {
    return this.prisma.tag.findUnique({
      where: whereUniqueInput,
    })
  }

  async list(params: {
    skip?: number
    take?: number
    cursor?: Prisma.TagWhereUniqueInput
    where?: Prisma.TagWhereInput
    orderBy?: Prisma.TagOrderByWithRelationInput
  }) {
    const { skip, take, cursor, where, orderBy } = params
    return this.prisma.tag.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
    })
  }

  async count(where: Prisma.TagWhereInput) {
    return this.prisma.tag.count({ where })
  }

  async create(data: Prisma.TagCreateInput) {
    return this.prisma.tag.create({
      data,
    })
  }

  async update(params: {
    where: Prisma.TagWhereUniqueInput
    data: Prisma.TagUpdateInput
  }) {
    const { where, data } = params
    return this.prisma.tag.update({
      data,
      where,
    })
  }

  async delete(where: Prisma.TagWhereUniqueInput) {
    return this.prisma.tag.delete({
      where,
    })
  }
}
