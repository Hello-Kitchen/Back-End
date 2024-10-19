import { Controller, Req, Post, UnauthorizedException, Body, Get } from '@nestjs/common';
import { LoginService } from './login.service';

// Controller for handling login requests
@Controller('api/login')
export class LoginController {
  constructor(private readonly loginService: LoginService) {
  }

  /**
   * Authenticates a user based on the provided credentials.
   * 
   * @param {Request} request - The login credentials containing username, password and idRestaurant.
   * @returns {Promise<any>} The authentication result.
   * @throws {UnauthorizedException} If authentication fails.
   */
  @Get()
  async login(@Req() request: Request) {
    try {
      // Attempt to authenticate the user using the service
      const auth = await this.loginService.authenticateUser(
        Number(request.body['idRestaurant']),
        request.body['username'],
        request.body['password'],
      );
      const token = await this.loginService.login(auth);
      return token; // Return the authentication result
    } catch (error) {
      // Handle authentication failure
      throw new UnauthorizedException(error.message);
    }
  }
}

