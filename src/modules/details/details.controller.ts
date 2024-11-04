/**
 * Controller for managing details associated with a restaurant.
 *
 * The `DetailsController` provides endpoints for retrieving, creating,
 * updating, and deleting detail objects for a specific restaurant.
 *
 * @controller DetailsController
 */

import {
  Controller,
  Get,
  Param,
  Post,
  Put,
  Delete,
  NotFoundException,
  BadRequestException,
  UseGuards,
  HttpException,
  HttpStatus,
  Body,
} from '@nestjs/common';
import { DetailsService } from './details.service';
import { JwtAuthGuard } from 'src/shared/guards/jwt-auth.guard';
import { PositiveNumberPipe } from 'src/shared/pipe/positive-number.pipe';
import { DetailDto } from './DTO/detail.dto';

@Controller('api/:idRestaurant/details')
export class DetailsController {
  constructor(private readonly detailsService: DetailsService) {}

  /**
   * Retrieves all details for a specific restaurant.
   *
   * @param {number} idRestaurant - The unique identifier of the restaurant.
   * @returns {Promise<any>} - A promise that resolves to an array of details.
   * @throws {NotFoundException} - Throws if no details are found for the restaurant.
   * @throws {HttpException} - Throws if there is an error during retrieval.
   * @async
   */
  @UseGuards(JwtAuthGuard)
  @Get()
  async getAllDetail(
    @Param('idRestaurant', PositiveNumberPipe) idRestaurant: number,
  ) {
    try {
      const details = await this.detailsService.findAll(Number(idRestaurant));
      if (!details || details.length === 0) {
        throw new NotFoundException();
      }
      return details.details;
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
   * Retrieves a specific detail by its ID for a specific restaurant.
   *
   * @param {number} idRestaurant - The unique identifier of the restaurant.
   * @param {number} id - The unique identifier of the detail.
   * @returns {Promise<any>} - A promise that resolves to the requested detail.
   * @throws {NotFoundException} - Throws if the detail is not found.
   * @throws {HttpException} - Throws if there is an error during retrieval.
   * @async
   */
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getOneDetail(
    @Param('idRestaurant', PositiveNumberPipe) idRestaurant: number,
    @Param('id', PositiveNumberPipe) id: number,
  ) {
    try {
      const detail = await this.detailsService.findById(
        Number(idRestaurant),
        Number(id),
      );
      if (!detail) {
        throw new NotFoundException();
      }
      return detail.details[0];
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
   * Creates a new detail for a specific restaurant.
   *
   * @param {number} idRestaurant - The unique identifier of the restaurant.
   * @param {DetailDto} detailDto - The request object containing detail data.
   * @returns {Promise<any>} - A promise that resolves to the created detail.
   * @throws {BadRequestException} - Throws if there is an error during creation.
   * @throws {HttpException} - Throws if there is an error during creation.
   * @async
   */
  @UseGuards(JwtAuthGuard)
  @Post()
  async createDetail(
    @Param('idRestaurant', PositiveNumberPipe) idRestaurant: number,
    @Body() createDetailDto: DetailDto,
  ) {
    try {
      const createdDetail = await this.detailsService.createOne(
        Number(idRestaurant),
        createDetailDto,
      );
      if (createdDetail.modifiedCount === 0) {
        throw new NotFoundException();
      }
      if (createdDetail.matchedCount === 0) {
        throw new NotFoundException();
      }
      return createdDetail;
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
   * Updates an existing detail for a specific restaurant.
   *
   * @param {number} idRestaurant - The unique identifier of the restaurant.
   * @param {number} id - The unique identifier of the detail to be updated.
   * @param {DetailDto} updateDetailDto - The request object containing updated detail data.
   * @returns {Promise<any>} - A promise that resolves to a success message.
   * @throws {NotFoundException} - Throws if the detail is not found.
   * @throws {BadRequestException} - Throws if no changes are made.
   * @throws {HttpException} - Throws if there is an error during the update.
   * @async
   */
  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async updateOneDetail(
    @Param('idRestaurant', PositiveNumberPipe) idRestaurant: number,
    @Param('id', PositiveNumberPipe) id: number,
    @Body() updateDetailDto: DetailDto,
  ) {
    try {
      const result = await this.detailsService.updateOne(
        Number(idRestaurant),
        Number(id),
        updateDetailDto,
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
   * Deletes a specific detail for a restaurant.
   *
   * @param {number} idRestaurant - The unique identifier of the restaurant.
   * @param {number} id - The unique identifier of the detail to be deleted.
   * @returns {Promise<any>} - A promise that resolves to a success message.
   * @throws {NotFoundException} - Throws if the detail is not found.
   * @throws {HttpException} - Throws if there is an error during deletion.
   * @async
   */
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async deleteOneDetail(
    @Param('idRestaurant', PositiveNumberPipe) idRestaurant: number,
    @Param('id', PositiveNumberPipe) id: number,
  ) {
    try {
      const result = await this.detailsService.deleteOne(
        Number(idRestaurant),
        Number(id),
      );
      if (result.modifiedCount === 0) {
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
