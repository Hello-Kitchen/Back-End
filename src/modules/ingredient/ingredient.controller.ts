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
import { IngredientService } from './ingredient.service';
import { JwtAuthGuard } from '../../shared/guards/jwt-auth.guard';
import { IngredientDto } from './DTO/ingredient.dto';
import { PositiveNumberPipe } from '../../shared/pipe/positive-number.pipe';

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
   * @throws {NotFoundException} - Throws if no ingredients are found for the restaurant.
   * @throws {HttpException} - Throws if there is an error during retrieval.
   * @async
   */
  @UseGuards(JwtAuthGuard)
  @Get()
  async getAllIngredient(
    @Param('idRestaurant', PositiveNumberPipe) idRestaurant: number,
  ) {
    try {
      const ingredient = await this.ingredientService.findAll(
        Number(idRestaurant),
      );
      if (!ingredient || ingredient.length === 0) {
        throw new NotFoundException();
      }
      return ingredient.ingredients; // Ensure `ingredients` is properly defined in your service's return type
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
   * Retrieves a specific ingredient by its ID for a given restaurant.
   *
   * @param {number} idRestaurant - The ID of the restaurant.
   * @param {number} id - The ID of the ingredient.
   * @returns {Promise<any>} The ingredient.
   * @throws {NotFoundException} - Throws if the detail is not found.
   * @throws {HttpException} - Throws if there is an error during retrieval.
   * @async
   */
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getOneIngredient(
    @Param('idRestaurant', PositiveNumberPipe) idRestaurant: number,
    @Param('id', PositiveNumberPipe) id: number,
  ) {
    try {
      const ingredient = await this.ingredientService.findById(
        Number(idRestaurant),
        Number(id),
      );
      if (!ingredient) {
        throw new NotFoundException();
      }
      return ingredient.ingredients[0]; // Ensure `ingredients` is properly defined in your service's return type
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
   * Creates a new ingredient for a specific restaurant.
   *
   * @param {number} idRestaurant - The ID of the restaurant.
   * @param {IngredientDto} createIngredientDto - The request containing ingredient data.
   * @returns {Promise<any>} The created ingredient.
   * @throws {BadRequestException} - Throws if there is an error during creation.
   * @throws {HttpException} - Throws if there is an error during creation.
   * @async
   */
  @UseGuards(JwtAuthGuard)
  @Post()
  async createIngredient(
    @Param('idRestaurant', PositiveNumberPipe) idRestaurant: number,
    @Body() createIngredientDto: IngredientDto,
  ) {
    try {
      const createdIngredient = await this.ingredientService.createOne(
        Number(idRestaurant),
        createIngredientDto,
      );
      if (createdIngredient.modifiedCount === 0) {
        throw new NotFoundException();
      }
      if (createdIngredient.matchedCount === 0) {
        throw new NotFoundException();
      }
      return createdIngredient;
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
   * Updates an existing ingredient for a specific restaurant.
   *
   * @param {number} idRestaurant - The ID of the restaurant.
   * @param {number} id - The ID of the ingredient to update.
   * @param {IngredientDto} updateIngredientDto - The request containing updated ingredient data.
   * @returns {Promise<any>} The update result message.
   * @throws {NotFoundException} - Throws if the detail is not found.
   * @throws {BadRequestException} - Throws if no changes are made.
   * @throws {HttpException} - Throws if there is an error during the update.
   * @async
   */
  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async updateOneIngredient(
    @Param('idRestaurant', PositiveNumberPipe) idRestaurant: number,
    @Param('id', PositiveNumberPipe) id: number,
    @Body() updateIngredientDto: IngredientDto,
  ) {
    try {
      const result = await this.ingredientService.updateOne(
        Number(idRestaurant),
        Number(id),
        updateIngredientDto,
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
   * Deletes a specific ingredient for a restaurant.
   *
   * @param {number} idRestaurant - The ID of the restaurant.
   * @param {number} id - The ID of the ingredient to delete.
   * @returns {Promise<any>} The delete result message.
   * @throws {NotFoundException} - Throws if the detail is not found.
   * @throws {HttpException} - Throws if there is an error during deletion.
   * @async
   */
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async deleteOneIngredient(
    @Param('idRestaurant', PositiveNumberPipe) idRestaurant: number,
    @Param('id', PositiveNumberPipe) id: number,
  ) {
    try {
      const result = await this.ingredientService.deleteOne(
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
