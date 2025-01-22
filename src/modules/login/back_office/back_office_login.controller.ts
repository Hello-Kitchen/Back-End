import { Controller, Get, BadRequestException, Query } from '@nestjs/common';
import { BackOfficeLoginService } from './back_office_login.service';
import { StringPipe } from '../../../shared/pipe/string.pipe';

// Controller for handling login requests to back-office
@Controller('api/backoffice_login')
export class BackOfficeLoginController {
  constructor(private readonly loginService: BackOfficeLoginService) {}

  /**
   * Authenticates a user based on the provided credentials.
   *
   * @param {string} password - The password of the user.
   * @param {string} username - The username of the user.
   * @returns {Promise<any>} The authentication result.
   * @throws {UnauthorizedException} If authentication fails.
   */
  @Get()
  async login(
    @Query('password', StringPipe) password: string,
    @Query('username', StringPipe) username: string,
  ) {
    try {
      // Attempt to authenticate the user using the service
      const auth = await this.loginService.authenticateUser(
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
