import { Module } from '@nestjs/common';
import { IngredientController } from './ingredient.controller';
import { IngredientService } from './ingredient.service';

/**
 * Module for managing ingredient items in the restaurant.
 *
 * The `IngredientModule` encapsulates the `IngredientController` and `IngredientService`
 * to handle operations related to ingredient items, including
 * creating, reading, updating, and deleting ingredient items.
 *
 * @module IngredientModule
 */
@Module({
  imports: [],
  controllers: [
    IngredientController /**< The controller responsible for handling HTTP requests related to ingredient items */,
  ],
  providers: [
    IngredientService /**< The service that contains the business logic for managing ingredient items */,
  ],
})
export class IngredientModule {}
