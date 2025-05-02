import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsArray,
  ValidateNested,
  IsOptional,
} from 'class-validator';
import { DetailDto } from '../../../modules/details/DTO/detail.dto';
import { IngredientDto } from '../../../modules/ingredient/DTO/ingredient.dto';
import { FoodCategoryDto } from '../../../modules/food_category/DTO/food_category.dto';
import { FoodDto } from '../../../modules/food/DTO/food.dto';
import { OrdersDto } from '../../../modules/orders/DTO/orders.dto';
import { UsersDto } from '../../../modules/users/DTO/users.dto';
import { PosConfigDto } from '../../../modules/pos_config/DTO/pos_config.dto';
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

  @IsOptional()
  @ValidateNested()
  @Type(() => PosConfigDto)
  pos_config?: PosConfigDto;

  @IsOptional()
  @IsNumber()
  id?: number;
}
