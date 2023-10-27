import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { CreateUserDTO, LoginDTO } from 'shared/auth.dto';
import * as bcrypt from 'bcrypt'
import { Prisma, User } from '@prisma/client';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class AppService {
  private readonly logger = new Logger(AppService.name);
  constructor(
    private readonly usersRepository: UsersRepository,
  ) { }

  async register(userDTO: CreateUserDTO): Promise<User | RpcException> {
    this.logger.log("[Auth-Comsumer] Register:::::", userDTO)
    const isExistedEmail = await this.isExistedByUnique({ email: userDTO.email })
    if (isExistedEmail) {
      throw new RpcException('User already existed');
    }

    userDTO.password = await this.hashPassword(userDTO.password)

    const user = await this.usersRepository.create(userDTO)
    user.password = undefined
    user.refreshToken = undefined
    return user
  }

  async login(userDTO: LoginDTO): Promise<any> {
    this.logger.log("[Auth-Comsumer] Login:::::", userDTO)
    const user = await this.isExistedByUnique({email: userDTO.email})
    if (!user) {
      throw new RpcException('User not found');
    }

    const is_equal = await bcrypt.compare(userDTO.password, user.password);
    if (!is_equal) {
      throw new RpcException('Invalid credentials');
    }
    user.password = undefined
    user.refreshToken = undefined
    return user
  }

  async isExistedByUnique(field: Prisma.UserWhereUniqueInput) {
    return await this.usersRepository.findUnique(field)
  }

  private async hashPassword(password: string, rounds: number = 10) {
    const salt = await bcrypt.genSalt(rounds)
    const hashedPassword = await bcrypt.hash(password, salt)
    return hashedPassword
  }
}
