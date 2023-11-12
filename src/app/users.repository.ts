import { Injectable } from '@nestjs/common';
import { type Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UsersRepository {
  constructor(private readonly prismaService: PrismaService) { }

  async create(data: Prisma.UserCreateInput) {
    console.log("UsersRepository:::::", data)
    const user = await this.prismaService.user.create({ data })
    return this._exclude(user, ['password'])
  }

  async update(where: Prisma.UserWhereUniqueInput, data: Prisma.UserUpdateInput) {
    const user = await this.prismaService.user.update({ where, data })
    return this._exclude(user, ['password'])
  }

  async upsert(where: Prisma.UserWhereUniqueInput, update: Prisma.UserUpdateInput, create: Prisma.UserCreateInput) {
    const user = await this.prismaService.user.upsert({ where, update, create })
    return this._exclude(user, ['password'])
  }

  async findUnique(where: Prisma.UserWhereUniqueInput) {
    const user = await this.prismaService.user.findUnique({ where })
    return user
  }

  async findUniqueWithoutField(where: Prisma.UserWhereUniqueInput, field: string) {
    const user = await this.prismaService.user.findUnique({ where })
    return this._exclude(user, [field])
  }


  async findAll() {
    const user = await this.prismaService.user.findMany()
    return this._exclude(user, ['password'])
  }

  async findMany(where: Prisma.UserWhereInput) {
    const user = await this.prismaService.user.findMany({ where })
    return this._exclude(user, ['password'])
  }

  async findFirst(where: Prisma.UserWhereInput) {
    const user = await this.prismaService.user.findFirst({ where })
    return this._exclude(user, ['password'])
  }

  async delete(where: Prisma.UserWhereUniqueInput) {
    const user = await this.prismaService.user.delete({ where })
    return this._exclude(user, ['password'])
  }

  async deleteMany(where: Prisma.UserWhereInput) {
    const user = await this.prismaService.user.deleteMany({ where })
    return this._exclude(user, ['password'])
  }

  async pagination(pages: { skip: number, take: number }) {
    const user = await this.prismaService.user.findMany(pages)
    return this._exclude(user, ['password'])
  }

  private _exclude(user: any, keys: string[]) {
    return Object.fromEntries(
      Object.entries(user).filter(([key]) => !keys.includes(key))
    );
  }
}
