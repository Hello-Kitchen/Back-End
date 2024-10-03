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

@Controller('api/ingredient/:idRestaurant')
export class IngredientController {
  constructor(private readonly ingredientService: IngredientService) {}

  @Get()
  async getAllIngredient(@Param('idRestaurant') idRestaurant: number) {
    try {
      const ingredient = await this.ingredientService.findAll(
        Number(idRestaurant),
      );
      if (!ingredient || ingredient.length === 0) {
        throw new NotFoundException('No ingredient found');
      }
      return ingredient.ingredients;
    } catch (error) {
      throw new InternalServerErrorException(
        `Error fetching ingredient: ${error}`,
      );
    }
  }

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
      return ingredient.ingredients[0];
    } catch (error) {
      throw new InternalServerErrorException(
        `Error fetching ingredient with id ${id}: ${error}`,
      );
    }
  }

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
        throw new BadRequestException('Error creating igredient');
      }
      return createdIngredient;
    } catch (error) {
      throw new InternalServerErrorException(
        `Error creating ingredient: ${error}`,
      );
    }
  }

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
