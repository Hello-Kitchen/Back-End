import { Controller, Get, Req, Res, Param, Post, Put, Delete, NotFoundException, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { FoodOrderedService } from './food_ordered.service';

@Controller('api/food_ordered/:idOrder')
export class FoodOrderedController {
  constructor(private readonly foodOrderedService: FoodOrderedService) {}

  @Get()
  async getAllFoodOrdered(@Param('idOrder') idOrder: number) {
    try {
      const foodOrdered = await this.foodOrderedService.findAll(Number(idOrder));
      if (!foodOrdered || foodOrdered.length === 0) {
        throw new NotFoundException('No foodOrdered found');
      }
      return foodOrdered.food_ordered;
    } catch (error) {
      throw new InternalServerErrorException('Error fetching foodOrdered');
    }
  }

  @Get(':id')
  async getOneFoodOrdered(@Param('idOrder') idOrder: number, @Param('id') id: number) {
    try {
      const foodOrdered = await this.foodOrderedService.findById(Number(idOrder), Number(id));
      if (!foodOrdered) {
        throw new NotFoundException(`FoodOrdered with id ${id} not found`);
      }
      return foodOrdered.food_ordered[0];
    } catch (error) {
      throw new InternalServerErrorException(`Error fetching foodOrdered with id ${id}`);
    }
  }

  @Post()
  async createFoodOrdered(@Param('idOrder') idOrder: number, @Req() request: Request) {
    try {
      const createdFoodOrdered = await this.foodOrderedService.createOne(Number(idOrder), request.body);
      if (!createdFoodOrdered) {
        throw new BadRequestException('Error creating foodOrdered');
      }
      return createdFoodOrdered;
    } catch (error) {
      console.log(error)
      throw new InternalServerErrorException('Error creating foodOrdered');
    }
  }

  @Put(':id')
  async updateOneFoodOrdered(@Param('idOrder') idOrder: number, @Param('id') id: number, @Req() request: Request) {
    try {
      const result = await this.foodOrderedService.updateOne(Number(idOrder), Number(id), request.body);
      if (result.matchedCount === 0) {
        throw new NotFoundException(`FoodOrdered with id ${id} not found`);
      }
      if (result.modifiedCount === 0) {
        throw new BadRequestException(`No changes made to the foodOrdered with id ${id}`);
      }
      return { message: `FoodOrdered with id ${id} updated successfully` };
    } catch (error) {
      throw new InternalServerErrorException(`Error updating foodOrdered with id ${id}`);
    }
  }

  @Delete(':id')
  async deleteOneFoodOrdered(@Param('idOrder') idOrder: number, @Param('id') id: number) {
    try {
      const result = await this.foodOrderedService.deleteOne(Number(idOrder), Number(id));
      if (result.modifiedCount === 0) {
        throw new NotFoundException(`FoodOrdered with id ${id} not found`);
      }
      return { message: `FoodOrdered with id ${id} deleted successfully` };
    } catch (error) {
      throw new InternalServerErrorException(`Error deleting foodOrdered with id ${id}`);
    }
  }

  @Post('status/:id')
  async updateManyFoodStatus(@Param('idOrder') idOrder: number, @Param('id') id: number) {
    try {
      const food = await this.foodOrderedService.findById(Number(idOrder), Number(id));

      if (!food) {
        throw new NotFoundException(`FoodOrdered with id ${id} not found`);
      }

      food.food_ordered.is_ready = true;
      this.foodOrderedService.updateOne(Number(idOrder), Number(id), food.food_ordered);
      return { message: `FoodOrdereds with id ${id} updated successfully` };
      
    } catch (err) {
      if (err instanceof NotFoundException) {
        throw err;
      }
      throw new InternalServerErrorException("Error updating foodOrdered in database");
    }
  }
}
