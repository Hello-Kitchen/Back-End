import {
  Controller,
  Get,
  Put,
  Param,
  Body,
  UseGuards,
  NotFoundException,
  BadRequestException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { PosConfigService } from './pos_config.service';
import { JwtAuthGuard } from '../../shared/guards/jwt-auth.guard';
import { PositiveNumberPipe } from '../../shared/pipe/positive-number.pipe';
import { PosConfigDto } from './DTO/pos_config.dto';

/**
 * Controller for managing the pos_config of a restaurant.
 *
 * The `PosConfigController` class handles incoming requests related
 * to the table configuration for a specific restaurant. It defines routes for
 * retrieving and updating the table configuration.
 */
@Controller('api/:idRestaurant/pos_config')
export class PosConfigController {
  constructor(private readonly posConfigService: PosConfigService) {}


    /**
   * Retrieves the pos_config of a specific restaurant.
   *
   * @param {number} idRestaurant - The ID of the restaurant.
   * @returns {Promise<any>} The pos_config.
   * @throws {NotFoundException} If no config is found.
   * @throws {HttpException} If there's an error fetching the config.
   */
  @UseGuards(JwtAuthGuard)
  @Get()
  async getPosConfig(
    @Param('idRestaurant', PositiveNumberPipe) idRestaurant: number,
  ) {
    try {
      const config = await this.posConfigService.findOne(Number(idRestaurant));
      if (!config) {
        throw new NotFoundException();
      }
      return config.pos_config; // Return the config of the restaurant
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
   * Updates an existing pos_config or create a pos_config for a specific restaurant.
   *
   * @param {number} idRestaurant - The ID of the restaurant.
   * @param {PosConfigDto} updatePosConfigDto - The HTTP request containing the informations of the pos_config, such as tables.
   * @returns {Promise<any>} A success message.
   * @throws {BadRequestException} If no changes were made to the config.
   * @throws {HttpException} If there's an error updating or creating the config.
   */
  @UseGuards(JwtAuthGuard)
  @Put()
  async updatePosConfig(
    @Param('idRestaurant', PositiveNumberPipe) idRestaurant: number,
    @Body() updatePosConfigDto: PosConfigDto,
  ) {
    try {
      const result = await this.posConfigService.updateOne(
        Number(idRestaurant),
        updatePosConfigDto,
      );
      if (result.modifiedCount === 0) {
        throw new BadRequestException();
      }
      return true;
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
