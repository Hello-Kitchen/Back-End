import { IsString, IsNotEmpty, IsNumber, IsBoolean, IsArray } from 'class-validator';
import { DetailDto } from 'src/modules/details/DTO/detail.dto';
import { IngredientDto } from 'src/modules/ingredient/DTO/ingredient.dto'; 
import { FoodCategoryDto } from 'src/modules/food_category/DTO/food_category.dto';
import { FoodDto } from 'src/modules/food/DTO/food.dto';
import { OrdersDto } from 'src/modules/orders/DTO/orders.dto';
import { UsersDto } from 'src/modules/users/DTO/users.dto';

export class RestaurantDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  @IsNotEmpty()
  location: string;

  @IsArray()
  ingredients: IngredientDto[];

  @IsArray()
  details: DetailDto[];

  @IsArray()
  food_category: FoodCategoryDto[];

  @IsArray()
  foods: FoodDto[];

  @IsArray()
  orders: OrdersDto[];

  @IsArray()
  users: UsersDto[];
}