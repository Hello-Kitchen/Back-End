import { IsString, IsNotEmpty, IsNumber, IsArray, ValidateNested } from 'class-validator';
import { DetailDto } from 'src/modules/details/DTO/detail.dto';
import { IngredientDto } from 'src/modules/ingredient/DTO/ingredient.dto';
import { FoodCategoryDto } from 'src/modules/food_category/DTO/food_category.dto';
import { FoodDto } from 'src/modules/food/DTO/food.dto';
import { OrdersDto } from 'src/modules/orders/DTO/orders.dto';
import { UsersDto } from 'src/modules/users/DTO/users.dto';
import { Type } from 'class-transformer';

export class RestaurantDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  @IsNotEmpty()
  location: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => IngredientDto)
  ingredients: IngredientDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DetailDto)
  details: DetailDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => FoodCategoryDto)
  food_category: FoodCategoryDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => FoodDto)
  foods: FoodDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrdersDto)
  orders: OrdersDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UsersDto)
  users: UsersDto[];
}
