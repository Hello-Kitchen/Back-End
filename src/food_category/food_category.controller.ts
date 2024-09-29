import { Controller, Get, Req, Param, Post, Put, Delete, NotFoundException, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { FoodCategoryService } from './food_category.service';

@Controller('api/food_category')
export class FoodCategoryController {
  constructor(private readonly foodCategoryService: FoodCategoryService) {}

  @Get()
  async getAllFoodCategory() {
    try {
      const foodCategory = await this.foodCategoryService.findAll();
      if (!foodCategory || foodCategory.length === 0) {
        throw new NotFoundException('No foodCategory found');
      }
      return foodCategory;
    } catch (error) {
      throw new InternalServerErrorException('Error fetching foodCategory');
    }
  }

  @Get(':id')
  async getOneFoodCategory(@Param('id') id: number) {
    try {
      const foodCategory = await this.foodCategoryService.findById(Number(id));
      if (!foodCategory) {
        throw new NotFoundException(`FoodCategory with id ${id} not found`);
      }
      return foodCategory;
    } catch (error) {
      throw new InternalServerErrorException(`Error fetching foodCategory with id ${id}`);
    }
  }

  @Post()
  async createFoodCategory(@Req() request: Request) {
    try {
      const createdFoodCategory = await this.foodCategoryService.createOne(request.body);
      if (!createdFoodCategory) {
        throw new BadRequestException('Error creating foodCategory');
      }
      return createdFoodCategory;
    } catch (error) {
      throw new InternalServerErrorException('Error creating foodCategory');
    }
  }

  @Put(':id')
  async updateOneFoodCategory(@Param('id') id: number, @Req() request: Request) {
    try {
      const result = await this.foodCategoryService.updateOne(Number(id), request.body);
      if (result.matchedCount === 0) {
        throw new NotFoundException(`FoodCategory with id ${id} not found`);
      }
      if (result.modifiedCount === 0) {
        throw new BadRequestException(`No changes made to the foodCategory with id ${id}`);
      }
      return { message: `FoodCategory with id ${id} updated successfully` };
    } catch (error) {
      throw new InternalServerErrorException(`Error updating foodCategory with id ${id}`);
    }
  }

  @Delete(':id')
  async deleteOneFoodCategory(@Param('id') id: number) {
    try {
      const result = await this.foodCategoryService.deleteOne(Number(id));
      if (result.deletedCount === 0) {
        throw new NotFoundException(`FoodCategory with id ${id} not found`);
      }
      return { message: `FoodCategory with id ${id} deleted successfully` };
    } catch (error) {
      throw new InternalServerErrorException(`Error deleting foodCategory with id ${id}`);
    }
  }
}
