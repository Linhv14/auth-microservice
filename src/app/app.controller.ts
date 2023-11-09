
import { Controller, ValidationPipe } from '@nestjs/common';
import { EventPattern, MessagePattern, Payload } from '@nestjs/microservices';

import { AppService } from './app.service';
import { CreateUserDTO, LoginDTO, RefreshTokenDTO, UpdateTokenDTO } from 'shared/auth.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @MessagePattern('auth.register')
  register(@Payload(ValidationPipe) user: CreateUserDTO) {
    return this.appService.register(user);
  }

  @MessagePattern('auth.login')
  login(@Payload(ValidationPipe) user: LoginDTO) {
    return this.appService.login(user);
  }

  @MessagePattern('auth.validate')
  validate(@Payload(ValidationPipe) ID: string) {
    return this.appService.validate(parseInt(ID));
  }

  @MessagePattern('auth.verify')
  verify(@Payload(ValidationPipe)token: RefreshTokenDTO) {
    return this.appService.verify(token);
  }

  @EventPattern('auth.update-token')
  updateToken(@Payload(ValidationPipe) token: RefreshTokenDTO) {
    return this.appService.updateToken(token);
  }

  @EventPattern('auth.logout')
  logout(@Payload(ValidationPipe) token: UpdateTokenDTO) {
    console.log(token)
    return this.appService.updateToken(token);
  }
}
