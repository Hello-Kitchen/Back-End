import {
    Controller,
    Get,
    HttpStatus,
    UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../shared/guards/jwt-auth.guard';

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
     * @returns {Object} - An object containing the HTTP status and a health message.
     * @throws {UnauthorizedException} - Throws if the request is not authenticated.
     * @async
     */
    @UseGuards(JwtAuthGuard)
    @Get()
    async checkHealth() {
        return {
            status: HttpStatus.OK,
            message: 'Server is healthy',
        };
    }
}
