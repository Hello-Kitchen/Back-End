/**
 * Represents a restaurant in the system.
 * 
 * The `Restaurant` interface defines the structure of a restaurant object, 
 * including its unique identifier, available ingredients, food categories, 
 * food items, and orders placed at the restaurant.
 * 
 * @interface Restaurant
 */

import { ObjectId } from 'mongodb';
import { Ingredient } from 'src/modules/ingredient/interfaces/ingredient.interface';
import { FoodCategory } from 'src/modules/food_category/interfaces/food_category.interface';
import { Food } from 'src/modules/food/interfaces/food.interface';
import { Order } from './order.interface';

export interface Restaurant {
  /**
   * The unique identifier for the restaurant, represented as an ObjectId.
   * 
   * @type {ObjectId}
   */
  _id: ObjectId;

  /**
   * The numeric identifier for the restaurant.
   * 
   * @type {number}
   */
  id: number;

  /**
   * An array of ingredients available at the restaurant.
   * 
   * @type {Ingredient[]}
   */
  ingredients: Ingredient[];

  /**
   * An array of food categories associated with the restaurant.
   * 
   * @type {FoodCategory[]}
   */
  food_category: FoodCategory[];

  /**
   * An array of food items offered by the restaurant.
   * 
   * @type {Food[]}
   */
  foods: Food[];

  /**
   * An array of orders placed at the restaurant.
   * 
   * @type {Order[]}
   */
  orders: Order[];
}

