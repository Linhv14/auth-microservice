
import { Controller, ValidationPipe } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';

import { AppService } from './app.service';
import { CreateUserDTO, LoginDTO } from 'shared/auth.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @MessagePattern('register')
  register(@Payload(ValidationPipe) user: CreateUserDTO) {
    return this.appService.register(user);
  }

  @MessagePattern('login')
  login(@Payload(ValidationPipe) user: LoginDTO) {
    return this.appService.login(user);
  }
}
