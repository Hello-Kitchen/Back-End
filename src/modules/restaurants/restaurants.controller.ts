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
} from '@nestjs/common';
import { RestaurantsService } from './restaurants.service';

@Controller('api/restaurants')
export class RestaurantsController {
  constructor(private readonly restaurantsService: RestaurantsService) {}

  @Get()
  async getAllRestaurant() {
    try {
      const restaurants = await this.restaurantsService.findAll();
      if (!restaurants || restaurants.length === 0) {
        throw new NotFoundException('No restaurants found');
      }
      return restaurants;
    } catch (error) {
      throw new InternalServerErrorException(
        `Error fetching restaurants: ${error}`,
      );
    }
  }

  @Get(':id')
  async getOneRestaurant(@Param('id') id: number) {
    try {
      const restaurant = await this.restaurantsService.findById(Number(id));
      if (!restaurant) {
        throw new NotFoundException(`Restaurant with id ${id} not found`);
      }
      return restaurant;
    } catch (error) {
      throw new InternalServerErrorException(
        `Error fetching restaurant with id ${id}: ${error}`,
      );
    }
  }

  @Post()
  async createRestaurant(@Req() request: Request) {
    try {
      const createdRestaurant = await this.restaurantsService.createOne(
        request.body,
      );
      if (!createdRestaurant) {
        throw new BadRequestException('Error creating restaurant');
      }
      return createdRestaurant;
    } catch (error) {
      throw new InternalServerErrorException(
        `Error creating restaurant: ${error}`,
      );
    }
  }

  @Put(':id')
  async updateOneRestaurant(@Param('id') id: number, @Req() request: Request) {
    try {
      const result = await this.restaurantsService.updateOne(
        Number(id),
        request.body,
      );
      if (result.matchedCount === 0) {
        throw new NotFoundException(`Restaurant with id ${id} not found`);
      }
      if (result.modifiedCount === 0) {
        throw new BadRequestException(
          `No changes made to the restaurant with id ${id}`,
        );
      }
      return { message: `Restaurant with id ${id} updated successfully` };
    } catch (error) {
      throw new InternalServerErrorException(
        `Error updating restaurant with id ${id}: ${error}`,
      );
    }
  }

  @Delete(':id')
  async deleteOneRestaurant(@Param('id') id: number) {
    try {
      const result = await this.restaurantsService.deleteOne(Number(id));
      if (result.deletedCount === 0) {
        throw new NotFoundException(`Restaurant with id ${id} not found`);
      }
      return { message: `Restaurant with id ${id} deleted successfully` };
    } catch (error) {
      throw new InternalServerErrorException(
        `Error deleting restaurant with id ${id}: ${error}`,
      );
    }
  }
}
