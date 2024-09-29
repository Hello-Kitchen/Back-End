import { Controller, Get, Req, Param, Post, Put, Delete, NotFoundException, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { IngredientService } from './ingredient.service';

@Controller('api/ingredient')
export class IngredientController {
  constructor(private readonly ingredientService: IngredientService) {}

  @Get()
  async getAllIngredient() {
    try {
      const ingredient = await this.ingredientService.findAll();
      if (!ingredient || ingredient.length === 0) {
        throw new NotFoundException('No ingredient found');
      }
      return ingredient;
    } catch (error) {
      throw new InternalServerErrorException('Error fetching ingredient');
    }
  }

  @Get(':id')
  async getOneIngredient(@Param('id') id: number) {
    try {
      const ingredient = await this.ingredientService.findById(Number(id));
      if (!ingredient) {
        throw new NotFoundException(`Ingredient with id ${id} not found`);
      }
      return ingredient;
    } catch (error) {
      throw new InternalServerErrorException(`Error fetching ingredient with id ${id}`);
    }
  }

  @Post()
  async createIngredient(@Req() request: Request) {
    try {
      const createdIngredient = await this.ingredientService.createOne(request.body);
      if (!createdIngredient) {
        throw new BadRequestException('Error creating igredient');
      }
      return createdIngredient;
    } catch (error) {
      throw new InternalServerErrorException('Error creating ingredient');
    }
  }

  @Put(':id')
  async updateOneIngredient(@Param('id') id: number, @Req() request: Request) {
    try {
      const result = await this.ingredientService.updateOne(Number(id), request.body);
      if (result.matchedCount === 0) {
        throw new NotFoundException(`Ingredient with id ${id} not found`);
      }
      if (result.modifiedCount === 0) {
        throw new BadRequestException(`No changes made to the ingredient with id ${id}`);
      }
      return { message: `Ingredient with id ${id} updated successfully` };
    } catch (error) {
      throw new InternalServerErrorException(`Error updating ingredient with id ${id}`);
    }
  }

  @Delete(':id')
  async deleteOneIngredient(@Param('id') id: number) {
    try {
      const result = await this.ingredientService.deleteOne(Number(id));
      if (result.deletedCount === 0) {
        throw new NotFoundException(`Ingredient with id ${id} not found`);
      }
      return { message: `Ingredient with id ${id} deleted successfully` };
    } catch (error) {
      throw new InternalServerErrorException(`Error deleting ingredient with id ${id}`);
    }
  }
  
}
