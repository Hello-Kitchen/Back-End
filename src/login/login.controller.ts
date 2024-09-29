import { Controller, Req, Post, UnauthorizedException } from '@nestjs/common';
import { LoginService } from './login.service';

@Controller('api/login')
export class LoginController {
  constructor(private readonly loginService: LoginService) {}

  @Post()
  async checkOneInfoUser(@Req() request: Request) {
    try {
      const result = await this.loginService.authenticateUser(request.body['username'], request.body['password']);
      return result;
    } catch (error) {
      throw new UnauthorizedException(error.message);
    }
  }
  
}
