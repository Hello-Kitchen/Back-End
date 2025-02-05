import {
  Controller,
  Get,
  Param,
  Post,
  Put,
  Delete,
  NotFoundException,
  BadRequestException,
  HttpException,
  HttpStatus,
  UseGuards,
  Body,
} from '@nestjs/common';
import { PosConfigService } from './pos_config.service';
import { JwtAuthGuard } from '../../shared/guards/jwt-auth.guard';
import { PositiveNumberPipe } from '../../shared/pipe/positive-number.pipe';
import { PosConfigDto } from './DTO/pos_config.dto';

@Controller('api/pos_config')
export class PosConfigController {
  constructor(private readonly posConfigService: PosConfigService) {}

  /**
   * Fetches all pos_config from the service.
   *
   * @returns {Promise<any>} An array of pos_config.
   */
  @UseGuards(JwtAuthGuard)
  @Get()
  async getAllPosConfig() {
    try {
      const pos_config = await this.posConfigService.findAll();
      if (!pos_config || pos_config.length === 0) {
        throw new NotFoundException();
      }
      return pos_config;
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
   * Fetches a specific pos_config by its ID.
   *
   * @param {number} id - The ID of the pos_config.
   * @returns {Promise<any>} The pos_config if found.
   */
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getOnePosConfig(@Param('id', PositiveNumberPipe) id: number) {
    try {
      const pos_config = await this.posConfigService.findById(Number(id));
      if (!pos_config) {
        throw new NotFoundException();
      }
      return pos_config;
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
   * Creates a new pos_config.
   *
   * @param {PosConfigDto} createPosConfigDto - The incoming request containing the pos_config data.
   * @returns {Promise<any>} The created pos_config.
   */
  @UseGuards(JwtAuthGuard)
  @Post()
  async createPosConfig(@Body() createPosConfigDto: PosConfigDto) {
    try {
      const createdPosConfig =
        await this.posConfigService.createOne(createPosConfigDto);
      if (!createdPosConfig) {
        throw new BadRequestException();
      }
      return createdPosConfig;
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
   * Updates an existing pos_config by its ID.
   *
   * @param {number} id - The ID of the pos_config to update.
   * @param {PosConfigDto} updatePosConfigDto - The incoming request containing the updated pos_config data.
   * @returns {Promise<any>} A success message.
   */
  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async updateOnePosConfig(
    @Param('id', PositiveNumberPipe) id: number,
    @Body() updatePosConfigDto: PosConfigDto,
  ) {
    try {
      const result = await this.posConfigService.updateOne(
        Number(id),
        updatePosConfigDto,
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

  /**
   * Deletes a pos_config by its ID.
   *
   * @param {number} id - The ID of the pos_config to delete.
   * @returns {Promise<any>} A success message.
   */
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async deleteOnePosConfig(@Param('id', PositiveNumberPipe) id: number) {
    try {
      const result = await this.posConfigService.deleteOne(Number(id));
      if (result.deletedCount === 0) {
        throw new NotFoundException();
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
