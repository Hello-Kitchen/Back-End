import { Controller, Get, Param, NotFoundException, InternalServerErrorException, UseGuards } from '@nestjs/common';
import { PosService } from './pos.service';
import { JwtAuthGuard } from 'src/shared/guards/jwt-auth.guard';

@Controller('api/pos')
export class PosController {
  constructor(private readonly posService: PosService) {} 

  /**
   * Get Data by the id restaurant.
   *
   * @param {number} id - The ID of the permission to delete.
   * @returns {Promise<any>} Success message.
   * @throws {NotFoundException} - Throws if the restaurant is not found.
   * @throws {HttpException} - Throws if there is an error during deletion.
   * @async
   */
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getAllDataPOS(@Param('id') id: number) {
    try {
      // Fetches the restaurant data using the provided ID
      const restaurant = await this.posService.findRestaurant(Number(id));

      // Throws a NotFoundException if the restaurant is not found
      if (!restaurant) {
        throw new NotFoundException(`Restaurant with id ${id} not found`);
      }

      // Maps each food item to a detailed structure
      const resultDetail = restaurant.foods.map((food) => {
        return {
          id: food.id,
          name: food.name,
          id_category: food.id_category,
          price: food.price,
          // Filters details that match the food item's details
          details: restaurant.details.filter(
            (detail) => food.details != null && food.details.includes(detail.id),
          ),
          // Filters ingredients that match the food item's ingredients
          ingredients: restaurant.ingredients.filter(
            (ing) =>
              food.ingredients != null && food.ingredients.includes(ing.id),
          ),
        };
      });

      // Maps each food category to a structured response containing foods in that category
      const resultFood = restaurant.food_category.map((category) => {
        return {
          id: category.id,
          name: category.name,
          // Filters food items that belong to the current category
          food: resultDetail.filter((food) => food.id_category === category.id),
        };
      });

      return resultFood; // Returns the structured food categories and their respective foods
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
