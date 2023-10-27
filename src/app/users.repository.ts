import { Injectable } from '@nestjs/common';
import { type Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';


@Injectable()
export class UsersRepository {
  constructor(private readonly prismaService: PrismaService) { }

  async create(data: Prisma.UserCreateInput) {
    console.log("UsersRepository:::::", data)
    const user = await this.prismaService.user.create({ data })
    return user
  }

  async update(where: Prisma.UserWhereUniqueInput, data: Prisma.UserUpdateInput) {
    return await this.prismaService.user.update({ where, data })
  }

  async upsert(where: Prisma.UserWhereUniqueInput, update: Prisma.UserUpdateInput, create: Prisma.UserCreateInput) {
    return await this.prismaService.user.upsert({ where, update, create })
  }

  async findUnique(where: Prisma.UserWhereUniqueInput) {
    return await this.prismaService.user.findUnique({ where })
  }

  async findAll() {
    return await this.prismaService.user.findMany()
  }

  async findMany(where: Prisma.UserWhereInput) {
    return await this.prismaService.user.findMany({ where })
  }

  async findFirst(where: Prisma.UserWhereInput) {
    return await this.prismaService.user.findFirst({ where })
  }

  async delete(where: Prisma.UserWhereUniqueInput) {
    return await this.prismaService.user.delete({ where })
  }

  async deleteMany(where: Prisma.UserWhereInput) {
    return await this.prismaService.user.deleteMany({ where })
  }

  async pagination(pages: { skip: number, take: number }) {
    return await this.prismaService.user.findMany(pages)
  }
}
