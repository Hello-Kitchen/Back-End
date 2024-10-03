import { Controller, Get, Param } from '@nestjs/common';
import { PosService } from './pos.service';

@Controller('api/pos')
export class PosController {
  constructor(private readonly posService: PosService) {}

  @Get(':id')
  async getAllDataPOS(@Param('id') id: number) {
    const restaurant = await this.posService.findRestaurant(Number(id));

    const resultDetail = restaurant.foods.map((food) => {
      return {
        id: food.id,
        name: food.name,
        id_category: food.id_category,
        price: food.price,
        details: restaurant.details.filter(
          (detail) => food.details != null && food.details.includes(detail.id),
        ),
        ingredients: restaurant.ingredients.filter(
          (ing) =>
            food.ingredients != null && food.ingredients.includes(ing.id),
        ),
      };
    });
    const resultFood = restaurant.food_category.map((category) => {
      return {
        id: category.id,
        name: category.name,
        food: resultDetail.filter((food) => food.id_category === category.id),
      };
    });
    return resultFood;
  }
}
