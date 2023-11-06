import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { CreateUserDTO, LoginDTO, RefreshTokenDTO } from 'shared/auth.dto';
import * as argon from 'argon2'
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
    const user = await this.isExistedByUnique({ email: userDTO.email })
    if (!user) throw new RpcException('User not found');

    const is_equal = await argon.verify(user.password, userDTO.password);
    if (!is_equal) throw new RpcException('Invalid credentials');
    if (user.status === "BLOCKED") throw new RpcException('Invalid credentials')

    user.password = undefined
    user.refreshToken = undefined
    return user
  }

  async verify({ ID, refreshToken }: RefreshTokenDTO) {
    const user = await this.usersRepository.findUnique({ ID: parseInt(ID) })
    console.log(user)
    if (!user || !user.refreshToken)
      throw new RpcException('Access denied');

    const refreshTokenMatches = await argon.verify(
      refreshToken,
      user.refreshToken
    );
    console.log(refreshTokenMatches)
    user.password = undefined
    user.refreshToken = undefined
    return {
      ...user,
      refreshTokenMatches
    }
  }

  async updateToken({ ID, refreshToken }: RefreshTokenDTO) {
    await this.usersRepository.update({ ID: parseInt(ID) }, { refreshToken })
  }

  async isExistedByUnique(field: Prisma.UserWhereUniqueInput) {
    return await this.usersRepository.findUnique(field)
  }

  async validate(ID: number): Promise<any> {
    this.logger.log("[Auth-Comsumer] Validate:::::", ID)
    const user = await this.usersRepository.findUnique({ ID })
    if (!user) {
      throw new RpcException('Invalid token');
    }

    user.password = undefined
    user.refreshToken = undefined
    return user
  }


  private async hashPassword(password: string) {
    const hashedPassword = await argon.hash(password)
    return hashedPassword
  }
}
