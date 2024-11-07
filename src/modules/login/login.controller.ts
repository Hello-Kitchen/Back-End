import { Controller, Get, BadRequestException, Query } from '@nestjs/common';
import { LoginService } from './login.service';
import { PositiveNumberPipe } from '../../shared/pipe/positive-number.pipe';
import { StringPipe } from '../../shared/pipe/string.pipe';

// Controller for handling login requests
@Controller('api/login')
export class LoginController {
  constructor(private readonly loginService: LoginService) {}

  /**
   * Authenticates a user based on the provided credentials.
   *
   * @param {string} password - The password of the user.
   * @param {string} username - The username of the user.
   * @param {number} idRestaurant - The id of the restaurant where containing the user.
   * @returns {Promise<any>} The authentication result.
   * @throws {UnauthorizedException} If authentication fails.
   */
  @Get()
  async login(
    @Query('password', StringPipe) password: string,
    @Query('username', StringPipe) username: string,
    @Query('idRestaurant', PositiveNumberPipe) idRestaurant: number,
  ) {
    try {
      // Attempt to authenticate the user using the service
      const auth = await this.loginService.authenticateUser(
        Number(idRestaurant),
        username,
        password,
      );
      const token = await this.loginService.login(auth);
      return token; // Return the authentication result
    } catch (error) {
      // Handle authentication failure
      throw new BadRequestException(error);
    }
  }
}
