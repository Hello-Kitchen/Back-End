import { Controller, Get } from '@nestjs/common';

/**
 * Controller for health checks.
 *
 * The `HealthController` class handles requests to verify the health and status
 * of the server. This can be used for monitoring or status checks to ensure
 * the server is running properly.
 */
@Controller('api/health')
export class HealthController {
  /**
   * Performs a health check on the server.
   *
   * This method verifies the health of the server and returns a simple
   * response indicating whether the server is running correctly.
   * It requires JWT authentication to access.
   *
   * @returns {undefined} - Only return status code.
   * @throws {UnauthorizedException} - Throws if the request is not authenticated.
   * @async
   */
  @Get()
  async checkHealth() {
    return;
  }
}
