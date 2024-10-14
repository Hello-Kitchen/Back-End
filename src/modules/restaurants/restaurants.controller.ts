import {
  Controller,
  Get,
  Req,
  Param,
  Post,
  Put,
  Delete,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { RestaurantsService } from './restaurants.service';
import { Request } from 'express'; // Ensure to import Request from express

@Controller('api/restaurants')
export class RestaurantsController {
  constructor(private readonly restaurantsService: RestaurantsService) {}

  /**
   * Fetches all restaurants from the service.
   *
   * @returns {Promise<any>} An array of restaurants.
   */
  @Get()
  async getAllRestaurants() {
    try {
      const restaurants = await this.restaurantsService.findAll();
      if (!restaurants || restaurants.length === 0) {
        throw new NotFoundException();
      }
      return restaurants;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * Fetches a specific restaurant by its ID.
   *
   * @param {number} id - The ID of the restaurant.
   * @returns {Promise<any>} The restaurant if found.
   */
  @Get(':id')
  async getOneRestaurant(@Param('id') id: number) {
    try {
      const restaurant = await this.restaurantsService.findById(Number(id));
      if (!restaurant) {
        throw new NotFoundException();
      }
      return restaurant;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * Creates a new restaurant.
   *
   * @param {Request} request - The incoming request containing the restaurant data.
   * @returns {Promise<any>} The created restaurant.
   */
  @Post()
  async createRestaurant(@Req() request: Request) {
    try {
      const createdRestaurant = await this.restaurantsService.createOne(
        request.body,
      );
      if (!createdRestaurant) {
        throw new BadRequestException();
      }
      return createdRestaurant;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * Updates an existing restaurant by its ID.
   *
   * @param {number} id - The ID of the restaurant to update.
   * @param {Request} request - The incoming request containing the updated restaurant data.
   * @returns {Promise<any>} A success message.
   */
  @Put(':id')
  async updateOneRestaurant(@Param('id') id: number, @Req() request: Request) {
    try {
      const result = await this.restaurantsService.updateOne(
        Number(id),
        request.body,
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
      throw new HttpException('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * Deletes a restaurant by its ID.
   *
   * @param {number} id - The ID of the restaurant to delete.
   * @returns {Promise<any>} A success message.
   */
  @Delete(':id')
  async deleteOneRestaurant(@Param('id') id: number) {
    try {
      const result = await this.restaurantsService.deleteOne(Number(id));
      if (result.deletedCount === 0) {
        throw new NotFoundException();
      }
      return;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
