import { ObjectId } from 'mongodb';
import { Ingredient } from 'src/modules/ingredient/interfaces/ingredient.interface';
import { FoodCategory } from 'src/modules/food_category/interfaces/food_category.interface';
import { Food } from 'src/modules/food/interfaces/food.interface';
import { Order } from './order.interface';

export interface Restaurant {
  _id: ObjectId;
  id: number;
  ingredients: Ingredient[];
  food_category: FoodCategory[];
  foods: Food[];
  orders: Order[];
}
