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
import { FoodCategoryService } from './food_category.service';
import { JwtAuthGuard } from 'src/shared/guards/jwt-auth.guard';
import { FoodCategoryDto } from './DTO/food_category.dto';
import { PositiveNumberPipe } from 'src/shared/pipe/positive-number.pipe';

/**
 * Controller for managing food categories in a restaurant.
 *
 * The `FoodCategoryController` class handles incoming requests related
 * to food categories for a specific restaurant. It defines routes for
 * retrieving, creating, updating, and deleting food categories.
 */
@Controller('api/:idRestaurant/food_category')
export class FoodCategoryController {
  constructor(private readonly foodCategoryService: FoodCategoryService) {}

  /**
   * Retrieves all food categories for a specific restaurant.
   *
   * @param {number} idRestaurant - The ID of the restaurant.
   * @returns {Promise<any>} The list of food categories.
   * @throws {NotFoundException} If no food categories are found.
   * @throws {HttpException} If there's an error fetching the categories.
   */
  @UseGuards(JwtAuthGuard)
  @Get()
  async getAllFoodCategory(
    @Param('idRestaurant', PositiveNumberPipe) idRestaurant: number,
  ) {
    try {
      const foodCategory = await this.foodCategoryService.findAll(
        Number(idRestaurant),
      );
      if (!foodCategory || foodCategory.length === 0) {
        throw new NotFoundException();
      }
      return foodCategory.food_category; // Return the list of food categories
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
   * Retrieves a specific food category by its ID for a given restaurant.
   *
   * @param {number} idRestaurant - The ID of the restaurant.
   * @param {number} id - The ID of the food category.
   * @returns {Promise<any>} The food category details.
   * @throws {NotFoundException} If the food category with the specified ID is not found.
   * @throws {HttpException} If there's an error fetching the category.
   */
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getOneFoodCategory(
    @Param('idRestaurant', PositiveNumberPipe) idRestaurant: number,
    @Param('id', PositiveNumberPipe) id: number,
  ) {
    try {
      const foodCategory = await this.foodCategoryService.findById(
        Number(idRestaurant),
        Number(id),
      );
      if (!foodCategory) {
        throw new NotFoundException();
      }
      return foodCategory.food_category[0]; // Return the specific food category
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
   * Creates a new food category for a specific restaurant.
   *
   * @param {number} idRestaurant - The ID of the restaurant.
   * @param {FoodCategoryDto} createFoodCategoryDto - The HTTP request containing the food category details.
   * @returns {Promise<any>} The created food category details.
   * @throws {BadRequestException} If there's an error creating the food category.
   * @throws {HttpException} If there's an error during the creation process.
   */
  @UseGuards(JwtAuthGuard)
  @Post()
  async createFoodCategory(
    @Param('idRestaurant', PositiveNumberPipe) idRestaurant: number,
    @Body() createFoodCategoryDto: FoodCategoryDto,
  ) {
    try {
      const createdFoodCategory = await this.foodCategoryService.createOne(
        Number(idRestaurant),
        createFoodCategoryDto,
      );
      if (createdFoodCategory.modifiedCount === 0) {
        throw new NotFoundException();
      }
      if (createdFoodCategory.matchedCount === 0) {
        throw new NotFoundException();
      }
      return createdFoodCategory; // Return the created food category
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
   * Updates an existing food category for a specific restaurant.
   *
   * @param {number} idRestaurant - The ID of the restaurant.
   * @param {number} id - The ID of the food category to update.
   * @param {FoodCategoryDto} updateFoodCategoryDto - The HTTP request containing the updated food category details.
   * @returns {Promise<any>} A success message.
   * @throws {NotFoundException} If the food category with the specified ID is not found.
   * @throws {BadRequestException} If no changes were made to the food category.
   * @throws {HttpException} If there's an error updating the category.
   */
  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async updateOneFoodCategory(
    @Param('idRestaurant', PositiveNumberPipe) idRestaurant: number,
    @Param('id', PositiveNumberPipe) id: number,
    @Body() updateFoodCategoryDto: FoodCategoryDto,
  ) {
    try {
      const result = await this.foodCategoryService.updateOne(
        Number(idRestaurant),
        Number(id),
        updateFoodCategoryDto,
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
   * Deletes a food category for a specific restaurant.
   *
   * @param {number} idRestaurant - The ID of the restaurant.
   * @param {number} id - The ID of the food category to delete.
   * @returns {Promise<any>} A success message.
   * @throws {NotFoundException} If the food category with the specified ID is not found.
   * @throws {HttpException} If there's an error deleting the category.
   */
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async deleteOneFoodCategory(
    @Param('idRestaurant', PositiveNumberPipe) idRestaurant: number,
    @Param('id', PositiveNumberPipe) id: number,
  ) {
    try {
      const result = await this.foodCategoryService.deleteOne(
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
