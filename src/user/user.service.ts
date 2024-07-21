import { Injectable } from '@nestjs/common'
import { Prisma, User } from '@prisma/client'
import { PrismaService } from '../prisma.service'

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async findUnique(
    whereUniqueInput: Prisma.UserWhereUniqueInput,
    select?: Prisma.UserSelect,
  ): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: whereUniqueInput,
      select,
    })
  }

  async findOne(
    where: Prisma.UserWhereInput,
    select?: Prisma.UserSelect,
  ): Promise<User | null> {
    return this.prisma.user.findFirst({
      where,
      select,
    })
  }

  async list(params: {
    skip?: number
    take?: number
    cursor?: Prisma.UserWhereUniqueInput
    where?: Prisma.UserWhereInput
    orderBy?: Prisma.UserOrderByWithRelationInput
    select?: Prisma.UserSelect
  }) {
    const { skip, take, cursor, where, orderBy, select } = params
    return this.prisma.user.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
      select,
    })
  }

  async count(where: Prisma.UserWhereInput) {
    return this.prisma.user.count({ where })
  }

  async create(data: Prisma.UserCreateInput) {
    return this.prisma.user.create({
      data,
    })
  }

  async update(params: {
    where: Prisma.UserWhereUniqueInput
    data: Prisma.UserUpdateInput
  }) {
    const { where, data } = params
    return this.prisma.user.update({
      data,
      where,
    })
  }

  async delete(where: Prisma.UserWhereUniqueInput) {
    return this.prisma.user.delete({
      where,
    })
  }
}
