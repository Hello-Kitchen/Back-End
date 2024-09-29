import { Controller, Get, Req, Param, Post, Put, Delete, NotFoundException, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { FoodService } from './food.service';

@Controller('api/food')
export class FoodController {
  constructor(private readonly foodService: FoodService) {}

  @Get()
  async getAllFood() {
    try {
      const food = await this.foodService.findAll();
      if (!food || food.length === 0) {
        throw new NotFoundException('No food found');
      }
      return food;
    } catch (error) {
      throw new InternalServerErrorException('Error fetching food');
    }
  }

  @Get(':id')
  async getOneFood(@Param('id') id: number) {
    try {
      const food = await this.foodService.findById(Number(id));
      if (!food) {
        throw new NotFoundException(`Food with id ${id} not found`);
      }
      return food;
    } catch (error) {
      throw new InternalServerErrorException(`Error fetching food with id ${id}`);
    }
  }

  @Post()
  async createFood(@Req() request: Request) {
    try {
      const createdFood = await this.foodService.createOne(request.body);
      if (!createdFood) {
        throw new BadRequestException('Error creating food');
      }
      return createdFood;
    } catch (error) {
      throw new InternalServerErrorException('Error creating food');
    }
  }

  @Put(':id')
  async updateOneFood(@Param('id') id: number, @Req() request: Request) {
    try {
      const result = await this.foodService.updateOne(Number(id), request.body);
      if (result.matchedCount === 0) {
        throw new NotFoundException(`Food with id ${id} not found`);
      }
      if (result.modifiedCount === 0) {
        throw new BadRequestException(`No changes made to the food with id ${id}`);
      }
      return { message: `Food with id ${id} updated successfully` };
    } catch (error) {
      throw new InternalServerErrorException(`Error updating food with id ${id}`);
    }
  }

  @Delete(':id')
  async deleteOneFood(@Param('id') id: number) {
    try {
      const result = await this.foodService.deleteOne(Number(id));
      if (result.deletedCount === 0) {
        throw new NotFoundException(`Food with id ${id} not found`);
      }
      return { message: `Food with id ${id} deleted successfully` };
    } catch (error) {
      throw new InternalServerErrorException(`Error deleting food with id ${id}`);
    }
  }
}
