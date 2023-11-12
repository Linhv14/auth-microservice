import { Injectable, Logger } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { CreateUserDTO, LoginDTO, RefreshTokenDTO } from 'shared/auth.dto';
import * as argon from 'argon2'
import { Prisma } from '@prisma/client';

@Injectable()
export class AppService {
  private readonly logger = new Logger(AppService.name);
  constructor(
    private readonly usersRepository: UsersRepository,
  ) { }

  async register(userDTO: CreateUserDTO) {
    this.logger.log("[Auth-Comsumer] Register ....")
    const isExistedEmail = await this._isExistedByUnique({ email: userDTO.email })
    if (isExistedEmail) {
      return { error: 'User already existed' }
    }

    userDTO.password = await this._hashPassword(userDTO.password)

    const user = await this.usersRepository.create(userDTO)

    return user
  }

  async login(userDTO: LoginDTO) {
    this.logger.log("[Auth-Comsumer] Login ....")
    const user = await this._isExistedByUnique({ email: userDTO.email })
    if (!user) return { error: 'User not found' }

    const is_equal = await argon.verify(user.password, userDTO.password);
    if (!is_equal) return { error: 'Invalid credentials' }
    if (user.status === "BLOCKED") return { error: 'Invalid credentials' }

    user.password = undefined
    user.refreshToken = undefined
    return user
  }

  async verify({ ID, refreshToken }: RefreshTokenDTO) {
    this.logger.log("[Auth-Comsumer] Verify token ....")
    const user = await this.usersRepository.findUniqueWithoutField({ ID: parseInt(ID) }, 'password')

    if (!user || !user.refreshToken)
      return { error: 'Access denied' };

    return {
      ...user,
      refreshTokenMatches: refreshToken === user.refreshToken
    }
  }

  async updateToken({ ID, refreshToken }: RefreshTokenDTO) {
    this.logger.log("[Auth-Comsumer] Update token ....")
    await this.usersRepository.update({ ID: parseInt(ID) }, { refreshToken })
  }

  private async _isExistedByUnique(field: Prisma.UserWhereUniqueInput) {
    return await this.usersRepository.findUnique(field)
  }

  async validate(ID: number) {
    this.logger.log("[Auth-Comsumer] Validate jwt ....")
    const user = await this.usersRepository.findUniqueWithoutField({ ID }, 'password')
    if (!user) {
      return { error: 'Invalid token' }
    }

    return user
  }

  private async _hashPassword(password: string) {
    const hashedPassword = await argon.hash(password)
    return hashedPassword
  }
}
