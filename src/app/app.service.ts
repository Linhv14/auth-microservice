import { Injectable, Logger } from '@nestjs/common';
import { AuthDTO, ChangePasswordDTO, UpdateTokenDTO } from 'src/shared/auth.dto';
import * as argon from 'argon2'
import { Prisma } from '@prisma/client';
import { UserRepository } from './user.repository';

@Injectable()
export class AppService {
  private readonly logger = new Logger(AppService.name);
  constructor(
    private readonly userRepository: UserRepository,
  ) { }

  async register(userDTO: AuthDTO) {
    this.logger.log("[Auth-Comsumer] Register ....")
    const isExistedEmail = await this._isExistedByUnique({ email: userDTO.email })
    if (isExistedEmail) {
      return { error: 'User already existed' }
    }

    userDTO.password = await this._hashPassword(userDTO.password)

    const user = await this.userRepository.create(userDTO)

    const { password, refreshToken, ...safeFields } = user
    return safeFields
  }

  async login(userDTO: AuthDTO) {
    this.logger.log("[Auth-Comsumer] Login ....")
    const user = await this._isExistedByUnique({ email: userDTO.email })
    if (!user) return { error: 'User not found' }

    const is_equal = await argon.verify(user.password, userDTO.password);
    if (!is_equal || user.status === 'blocked') return { error: 'Invalid credentials' }

    const { password, refreshToken, ...safeFields } = user
    return safeFields
  }

  async verify({ ID, refreshToken }: UpdateTokenDTO) {
    this.logger.log("[Auth-Comsumer] Verify token ....")
    const user = await this.userRepository.findUniqueWithoutField({ ID }, 'password')

    if (!user || !user.refreshToken)
      return { error: 'Access denied' };

    return {
      ...user,
      refreshTokenMatches: refreshToken === user.refreshToken
    }
  }

  async updateToken({ ID, refreshToken }: UpdateTokenDTO) {
    this.logger.log("[Auth-Comsumer] Update token ....")
    await this.userRepository.update({ ID }, { refreshToken })
  }

  private async _isExistedByUnique(field: Prisma.UserWhereUniqueInput) {
    return await this.userRepository.findUnique(field)
  }

  async validate(ID: number) {
    this.logger.log("[Auth-Comsumer] Validate jwt ....")
    const user = await this.userRepository.findUniqueWithoutField({ ID }, 'password')
    if (!user) {
      return { error: 'Invalid token' }
    }

    return user
  }

  async changePassword(userDTO: ChangePasswordDTO) {
    const user = await this.userRepository.findUnique({ID: userDTO.ID})
    const is_equal = await argon.verify(user.password, userDTO.oldPassword);
    if (!is_equal) return {error: "Invalid credentials"}
    const newPassword = await this._hashPassword(userDTO.newPassword)
    const updatedUser = await this.userRepository.update({ID: userDTO.ID}, {password: newPassword})
    const {password, refreshToken, ...safeFields} = updatedUser
    return safeFields
  }

  private async _hashPassword(password: string): Promise<string> {
    const hashedPassword = await argon.hash(password)
    return hashedPassword
  }
}
