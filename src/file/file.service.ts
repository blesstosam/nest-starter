import { Injectable } from '@nestjs/common'
import { File, Prisma } from '../generated/prisma/client'
import { PrismaService } from '../prisma.service'

@Injectable()
export class FileService {
  constructor(private prisma: PrismaService) {}

  async findUnique(
    whereUniqueInput: Prisma.FileWhereUniqueInput,
  ): Promise<File | null> {
    return this.prisma.file.findUnique({
      where: whereUniqueInput,
    })
  }

  async list(params: {
    skip?: number
    take?: number
    cursor?: Prisma.FileWhereUniqueInput
    where?: Prisma.FileWhereInput
    orderBy?: Prisma.FileOrderByWithRelationInput
  }) {
    const { skip, take, cursor, where, orderBy } = params
    return this.prisma.file.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
    })
  }

  async create(data: Prisma.FileCreateInput) {
    return this.prisma.file.create({
      data,
    })
  }

  async update(params: {
    where: Prisma.FileWhereUniqueInput
    data: Prisma.FileUpdateInput
  }) {
    const { where, data } = params
    return this.prisma.file.update({
      data,
      where,
    })
  }

  async delete(where: Prisma.FileWhereUniqueInput) {
    return this.prisma.file.delete({
      where,
    })
  }

  async count(where?: Prisma.FileWhereInput) {
    return this.prisma.file.count({ where })
  }
}
