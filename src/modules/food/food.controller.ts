/**
 * @controller FoodController
 * 
 * Controller for managing food items in the restaurant.
 * 
 * This controller provides endpoints for creating, reading, updating, 
 * and deleting food items associated with a specific restaurant.
 */

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
import { FoodService } from './food.service';

@Controller('api/:idRestaurant/food')
export class FoodController {
  constructor(private readonly foodService: FoodService) {}

  /**
   * Retrieves all food items for a specific restaurant.
   * 
   * @param {number} idRestaurant - The unique identifier for the restaurant.
   * @returns {Promise<any>} An array of food items.
   * @throws {NotFoundException} if no food items are found.
   * @throws {InternalServerErrorException} if there is an error during the operation.
   * @async
   */
  @Get()
  async getAllFood(@Param('idRestaurant') idRestaurant: number): Promise<any> {
    try {
      const food = await this.foodService.findAll(Number(idRestaurant));
      if (!food || food.length === 0) {
        throw new NotFoundException('No food found');
      }
      return food.foods; // Assuming food.foods is of type any[]
    } catch (error) {
      throw new InternalServerErrorException(`Error fetching food: ${error}`);
    }
  }

  /**
   * Retrieves a specific food item by its ID.
   * 
   * @param {number} idRestaurant - The unique identifier for the restaurant.
   * @param {number} id - The unique identifier for the food item.
   * @returns {Promise<any>} The food item if found.
   * @throws {NotFoundException} if the food item is not found.
   * @throws {InternalServerErrorException} if there is an error during the operation.
   * @async
   */
  @Get(':id')
  async getOneFood(
    @Param('idRestaurant') idRestaurant: number,
    @Param('id') id: number,
  ): Promise<any> {
    try {
      const food = await this.foodService.findById(
        Number(idRestaurant),
        Number(id),
      );
      if (!food) {
        throw new NotFoundException(`Food with id ${id} not found`);
      }
      return food.foods[0]; // Assuming food.foods is of type any[]
    } catch (error) {
      throw new InternalServerErrorException(
        `Error fetching food with id ${id}: ${error}`,
      );
    }
  }

  /**
   * Creates a new food item for a specific restaurant.
   * 
   * @param {number} idRestaurant - The unique identifier for the restaurant.
   * @param {Request} request - The request object containing the food item data.
   * @returns {Promise<any>} The created food item.
   * @throws {BadRequestException} if there is an error during creation.
   * @throws {InternalServerErrorException} if there is an error during the operation.
   * @async
   */
  @Post()
  async createFood(
    @Param('idRestaurant') idRestaurant: number,
    @Req() request: Request,
  ): Promise<any> {
    try {
      const createdFood = await this.foodService.createOne(
        Number(idRestaurant),
        request.body,
      );
      if (!createdFood) {
        throw new BadRequestException('Error creating food');
      }
      return createdFood; // Assuming createdFood is of type any
    } catch (error) {
      throw new InternalServerErrorException(`Error creating food: ${error}`);
    }
  }

  /**
   * Updates an existing food item.
   * 
   * @param {number} idRestaurant - The unique identifier for the restaurant.
   * @param {number} id - The unique identifier for the food item.
   * @param {Request} request - The request object containing the updated food item data.
   * @returns {Promise<any>} A success message if the food item is updated successfully.
   * @throws {NotFoundException} if the food item is not found.
   * @throws {BadRequestException} if no changes are made.
   * @throws {InternalServerErrorException} if there is an error during the operation.
   * @async
   */
  @Put(':id')
  async updateOneFood(
    @Param('idRestaurant') idRestaurant: number,
    @Param('id') id: number,
    @Req() request: Request,
  ): Promise<any> {
    try {
      const result = await this.foodService.updateOne(
        Number(idRestaurant),
        Number(id),
        request.body,
      );
      if (result.matchedCount === 0) {
        throw new NotFoundException(`Food with id ${id} not found`);
      }
      if (result.modifiedCount === 0) {
        throw new BadRequestException(
          `No changes made to the food with id ${id}`,
        );
      }
      return { message: `Food with id ${id} updated successfully` };
    } catch (error) {
      throw new InternalServerErrorException(
        `Error updating food with id ${id}: ${error}`,
      );
    }
  }

  /**
   * Deletes a specific food item by its ID.
   * 
   * @param {number} idRestaurant - The unique identifier for the restaurant.
   * @param {number} id - The unique identifier for the food item.
   * @returns {Promise<any>} A success message if the food item is deleted successfully.
   * @throws {NotFoundException} if the food item is not found.
   * @throws {InternalServerErrorException} if there is an error during the operation.
   * @async
   */
  @Delete(':id')
  async deleteOneFood(
    @Param('idRestaurant') idRestaurant: number,
    @Param('id') id: number,
  ): Promise<any> {
    try {
      const result = await this.foodService.deleteOne(
        Number(idRestaurant),
        Number(id),
      );
      if (result.modifiedCount === 0) {
        throw new NotFoundException(`Food with id ${id} not found`);
      }
      return { message: `Food with id ${id} deleted successfully` };
    } catch (error) {
      throw new InternalServerErrorException(
        `Error deleting food with id ${id}: ${error}`,
      );
    }
  }
}
