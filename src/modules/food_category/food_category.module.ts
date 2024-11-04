import { Module } from '@nestjs/common';
import { FoodCategoryController } from './food_category.controller';
import { FoodCategoryService } from './food_category.service';

/**
 * Module for managing food_category items in the restaurant.
 *
 * The `FoodCategoryModule` encapsulates the `FoodCategoryController` and `FoodCategoryService`
 * to handle operations related to food_category items, including
 * creating, reading, updating, and deleting food_category items.
 *
 * @module FoodCategoryModule
 */
@Module({
  imports: [],
  controllers: [
    FoodCategoryController /**< The controller responsible for handling HTTP requests related to food_category items */,
  ],
  providers: [
    FoodCategoryService /**< The service that contains the business logic for managing food_category items */,
  ],
})
export class FoodCategoryModule {}
