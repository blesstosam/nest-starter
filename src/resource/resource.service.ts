import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/prisma.service'
import { Prisma, Resource } from '../generated/prisma/client'

@Injectable()
export class ResourceService {
  constructor(private prisma: PrismaService) {}

  async findUnique(
    whereUniqueInput: Prisma.ResourceWhereUniqueInput,
  ): Promise<Resource | null> {
    return this.prisma.resource.findUnique({
      where: whereUniqueInput,
    })
  }

  async list(params: {
    skip?: number
    take?: number
    cursor?: Prisma.ResourceWhereUniqueInput
    where?: Prisma.ResourceWhereInput
    orderBy?: Prisma.ResourceOrderByWithRelationInput
    include?: Prisma.ResourceInclude
  }) {
    const { skip, take, cursor, where, orderBy, include } = params
    return this.prisma.resource.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
      include,
    })
  }

  async count(where?: Prisma.ResourceWhereInput) {
    return this.prisma.resource.count({ where })
  }

  async create(data: Prisma.ResourceCreateInput) {
    return this.prisma.resource.create({
      data,
    })
  }

  async update(params: {
    where: Prisma.ResourceWhereUniqueInput
    data: Prisma.ResourceUpdateInput
  }) {
    const { where, data } = params
    return this.prisma.resource.update({
      data,
      where,
    })
  }

  async delete(where: Prisma.ResourceWhereUniqueInput) {
    return this.prisma.resource.delete({
      where,
    })
  }
}
