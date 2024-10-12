import { Controller, Req, Post, UnauthorizedException, Body } from '@nestjs/common';
import { LoginService } from './login.service';

// Controller for handling login requests
@Controller('api/login')
export class LoginController {
  constructor(private readonly loginService: LoginService) {}

  /**
   * Authenticates a user based on the provided credentials.
   * 
   * @param {LoginDto} loginData - The login credentials containing username and password.
   * @returns {Promise<any>} The authentication result.
   * @throws {UnauthorizedException} If authentication fails.
   */
  @Post()
  async checkOneInfoUser(@Req() request: Request) {
    try {
      // Attempt to authenticate the user using the service
      const result = await this.loginService.authenticateUser(
        request.body['username'],
        request.body['password'],
      );
      return result; // Return the authentication result
    } catch (error) {
      // Handle authentication failure
      throw new UnauthorizedException(error.message);
    }
  }
}

