import {
    Controller,
    Get,
    Param,
    Post,
    Put,
    NotFoundException,
    BadRequestException,
    HttpException,
    HttpStatus,
    UseGuards,
    Body,
} from '@nestjs/common';
import { ConfigService } from './config.service';
import { JwtAuthGuard } from '../../shared/guards/jwt-auth.guard';
import { ConfigDto } from './DTO/config.dto'
import { PositiveNumberPipe } from '../../shared/pipe/positive-number.pipe';

/**
 * Controller for managing config within a restaurant.
 *
 * The `configController` class provides endpoints for CRUD operations
 * related to config in the restaurant database.
 */
@Controller('api/:idRestaurant/config')
export class ConfigController {
    constructor(private readonly configService: ConfigService) { }

    /**
     * Retrieves the config for a given restaurant.
     *
     * @param {number} idRestaurant - The ID of the restaurant.
     * @returns {Promise<any>} The config.
     * @throws {NotFoundException} - Throws if the detail is not found.
     * @throws {HttpException} - Throws if there is an error during retrieval.
     * @async
     */
    @UseGuards(JwtAuthGuard)
    @Get('')
    async getConfig(
        @Param('idRestaurant', PositiveNumberPipe) idRestaurant: number,
    ) {
        try {
            const config = await this.configService.find(
                Number(idRestaurant),
            );
            if (!config) {
                throw new NotFoundException();
            }
            return config.config[0];
        } catch (error) {
            if (error instanceof HttpException) {
                throw error;
            }
            throw new HttpException(
                'Internal server error',
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    /**
     * Creates a new config for a specific restaurant.
     *
     * @param {number} idRestaurant - The ID of the restaurant.
     * @param {configDto} createconfigDto - The request containing config data.
     * @returns {Promise<any>} The created config.
     * @throws {BadRequestException} - Throws if there is an error during creation.
     * @throws {HttpException} - Throws if there is an error during creation.
     * @async
     */
    @UseGuards(JwtAuthGuard)
    @Post()
    async createConfig(
        @Param('idRestaurant', PositiveNumberPipe) idRestaurant: number,
        @Body() createConfigDto: ConfigDto,
    ) {
        try {
            const createdConfig = await this.configService.create(
                Number(idRestaurant),
                createConfigDto,
            );
            if (createdConfig.modifiedCount === 0) {
                throw new NotFoundException();
            }
            if (createdConfig.matchedCount === 0) {
                throw new NotFoundException();
            }
            return createdConfig;
        } catch (error) {
            if (error instanceof HttpException) {
                throw error;
            }
            throw new HttpException(
                'Internal server error',
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    /**
     * Updates an existing config for a specific restaurant.
     *
     * @param {number} idRestaurant - The ID of the restaurant.
     * @param {configDto} updateconfigDto - The request containing updated config data.
     * @returns {Promise<any>} The update result message.
     * @throws {NotFoundException} - Throws if the detail is not found.
     * @throws {BadRequestException} - Throws if no changes are made.
     * @throws {HttpException} - Throws if there is an error during the update.
     * @async
     */
    @UseGuards(JwtAuthGuard)
    @Put()
    async updateconfig(
        @Param('idRestaurant', PositiveNumberPipe) idRestaurant: number,
        @Body() updateConfigDto: ConfigDto,
    ) {
        try {
            const result = await this.configService.update(
                Number(idRestaurant),
                updateConfigDto,
            );
            if (result.matchedCount === 0) {
                throw new NotFoundException();
            }
            if (result.modifiedCount === 0) {
                throw new BadRequestException();
            }
            return;
        } catch (error) {
            if (error instanceof HttpException) {
                throw error;
            }
            throw new HttpException(
                'Internal server error',
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }
}
