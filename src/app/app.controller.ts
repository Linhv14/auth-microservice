
import { Controller, ValidationPipe } from '@nestjs/common';
import { EventPattern, MessagePattern, Payload } from '@nestjs/microservices';
import { AppService } from './app.service';
import { AuthDTO, ChangePasswordDTO, UpdateTokenDTO } from 'src/shared/auth.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @MessagePattern('auth.register')
  register(@Payload(ValidationPipe) user: AuthDTO) {
    return this.appService.register(user);
  }

  @MessagePattern('auth.login')
  login(@Payload(ValidationPipe) user: AuthDTO) {
    console.log("AUTH:::loging..")
    return this.appService.login(user);
  }

  @MessagePattern('auth.validate')
  validate(@Payload(ValidationPipe) { ID }: { ID: number }) {
    return this.appService.validate(ID);
  }

  @MessagePattern('auth.verify')
  verify(@Payload(ValidationPipe) token: UpdateTokenDTO) {
    return this.appService.verify(token);
  }

  @MessagePattern('auth.change-password')
  changePassword(@Payload(ValidationPipe) userDTO: ChangePasswordDTO) {
    return this.appService.changePassword(userDTO);
  }

  @EventPattern('auth.update-token')
  updateToken(@Payload(ValidationPipe) token: UpdateTokenDTO) {
    return this.appService.updateToken(token);
  }

  @EventPattern('auth.logout')
  logout(@Payload(ValidationPipe) token: UpdateTokenDTO) {
    console.log(token)
    return this.appService.updateToken(token);
  }
}
