import { Module } from '@nestjs/common';
import { FoodController } from './food.controller';
import { FoodService } from './food.service';

/**
 * Module for managing food items in the restaurant.
 *
 * The `FoodModule` encapsulates the `FoodController` and `FoodService`
 * to handle operations related to food items, including
 * creating, reading, updating, and deleting food items.
 *
 * @module FoodModule
 */
@Module({
  imports: [],
  controllers: [
    FoodController /**< The controller responsible for handling HTTP requests related to food items */,
  ],
  providers: [
    FoodService /**< The service that contains the business logic for managing food items */,
  ],
})
export class FoodModule {}
