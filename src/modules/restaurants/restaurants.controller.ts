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
  HttpException,
  HttpStatus,
  UseGuards,
  UsePipes,
  Body,
} from '@nestjs/common';
import { RestaurantsService } from './restaurants.service';
import { Request } from 'express'; // Ensure to import Request from express
import { JwtAuthGuard } from 'src/shared/guards/jwt-auth.guard';
import { PositiveNumberPipe } from 'src/shared/pipe/positive-number.pipe';
import { RestaurantDto } from './DTO/restaurants.dto';

@Controller('api/restaurants')
export class RestaurantsController {
  constructor(private readonly restaurantsService: RestaurantsService) {}

  /**
   * Fetches all restaurants from the service.
   *
   * @returns {Promise<any>} An array of restaurants.
   */
  @UseGuards(JwtAuthGuard)
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
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getOneRestaurant(@Param('id', PositiveNumberPipe) id: number) {
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
   * @param {RestaurantDto} createRestaurantDto - The incoming request containing the restaurant data.
   * @returns {Promise<any>} The created restaurant.
   */
  @UseGuards(JwtAuthGuard)
  @Post()
  async createRestaurant(@Body() createRestaurantDto: RestaurantDto) {
    try {
      const createdRestaurant = await this.restaurantsService.createOne(
        createRestaurantDto,
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
   * @param {RestaurantDto} updateRestaurantDto - The incoming request containing the updated restaurant data.
   * @returns {Promise<any>} A success message.
   */
  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async updateOneRestaurant(@Param('id', PositiveNumberPipe) id: number, @Body() updateRestaurantDto: RestaurantDto) {
    try {
      const result = await this.restaurantsService.updateOne(
        Number(id),
        updateRestaurantDto,
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
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async deleteOneRestaurant(@Param('id', PositiveNumberPipe) id: number) {
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
