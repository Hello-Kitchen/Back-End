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
import { IngredientService } from './ingredient.service';
import { Request } from 'express';

/**
 * Controller for managing ingredients within a restaurant.
 *
 * The `IngredientController` class provides endpoints for CRUD operations
 * related to ingredients in the restaurant database.
 */
@Controller('api/:idRestaurant/ingredient')
export class IngredientController {
  constructor(private readonly ingredientService: IngredientService) {}

  /**
   * Retrieves all ingredients for a specific restaurant.
   * 
   * @param {number} idRestaurant - The ID of the restaurant.
   * @returns {Promise<any>} The list of ingredients.
   */
  @Get()
  async getAllIngredient(@Param('idRestaurant') idRestaurant: number) {
    try {
      const ingredient = await this.ingredientService.findAll(
        Number(idRestaurant),
      );
      if (!ingredient || ingredient.length === 0) {
        throw new NotFoundException('No ingredients found');
      }
      return ingredient.ingredients; // Ensure `ingredients` is properly defined in your service's return type
    } catch (error) {
      throw new InternalServerErrorException(
        `Error fetching ingredients: ${error}`,
      );
    }
  }

  /**
   * Retrieves a specific ingredient by its ID for a given restaurant.
   * 
   * @param {number} idRestaurant - The ID of the restaurant.
   * @param {number} id - The ID of the ingredient.
   * @returns {Promise<any>} The ingredient.
   */
  @Get(':id')
  async getOneIngredient(
    @Param('idRestaurant') idRestaurant: number,
    @Param('id') id: number,
  ) {
    try {
      const ingredient = await this.ingredientService.findById(
        Number(idRestaurant),
        Number(id),
      );
      if (!ingredient) {
        throw new NotFoundException(`Ingredient with id ${id} not found`);
      }
      return ingredient.ingredients[0]; // Ensure `ingredients` is properly defined in your service's return type
    } catch (error) {
      throw new InternalServerErrorException(
        `Error fetching ingredient with id ${id}: ${error}`,
      );
    }
  }

  /**
   * Creates a new ingredient for a specific restaurant.
   * 
   * @param {number} idRestaurant - The ID of the restaurant.
   * @param {Request} request - The request containing ingredient data.
   * @returns {Promise<any>} The created ingredient.
   */
  @Post()
  async createIngredient(
    @Param('idRestaurant') idRestaurant: number,
    @Req() request: Request,
  ) {
    try {
      const createdIngredient = await this.ingredientService.createOne(
        Number(idRestaurant),
        request.body,
      );
      if (!createdIngredient) {
        throw new BadRequestException('Error creating ingredient');
      }
      return createdIngredient;
    } catch (error) {
      throw new InternalServerErrorException(
        `Error creating ingredient: ${error}`,
      );
    }
  }

  /**
   * Updates an existing ingredient for a specific restaurant.
   * 
   * @param {number} idRestaurant - The ID of the restaurant.
   * @param {number} id - The ID of the ingredient to update.
   * @param {Request} request - The request containing updated ingredient data.
   * @returns {Promise<any>} The update result message.
   */
  @Put(':id')
  async updateOneIngredient(
    @Param('idRestaurant') idRestaurant: number,
    @Param('id') id: number,
    @Req() request: Request,
  ) {
    try {
      const result = await this.ingredientService.updateOne(
        Number(idRestaurant),
        Number(id),
        request.body,
      );
      if (result.matchedCount === 0) {
        throw new NotFoundException(`Ingredient with id ${id} not found`);
      }
      if (result.modifiedCount === 0) {
        throw new BadRequestException(
          `No changes made to the ingredient with id ${id}`,
        );
      }
      return { message: `Ingredient with id ${id} updated successfully` };
    } catch (error) {
      throw new InternalServerErrorException(
        `Error updating ingredient with id ${id}: ${error}`,
      );
    }
  }

  /**
   * Deletes a specific ingredient for a restaurant.
   * 
   * @param {number} idRestaurant - The ID of the restaurant.
   * @param {number} id - The ID of the ingredient to delete.
   * @returns {Promise<any>} The delete result message.
   */
  @Delete(':id')
  async deleteOneIngredient(
    @Param('idRestaurant') idRestaurant: number,
    @Param('id') id: number,
  ) {
    try {
      const result = await this.ingredientService.deleteOne(
        Number(idRestaurant),
        Number(id),
      );
      if (result.modifiedCount === 0) {
        throw new NotFoundException(`Ingredient with id ${id} not found`);
      }
      return { message: `Ingredient with id ${id} deleted successfully` };
    } catch (error) {
      throw new InternalServerErrorException(
        `Error deleting ingredient with id ${id}: ${error}`,
      );
    }
  }
}