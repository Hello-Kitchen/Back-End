import { Module } from '@nestjs/common';
import { RestaurantsController } from './restaurants.controller';
import { RestaurantsService } from './restaurants.service';

/**
 * Module for managing restaurant items in the restaurant.
 * 
 * The `RestaurantModule` encapsulates the `RestaurantController` and `RestaurantService`
 * to handle operations related to restaurant items, including
 * creating, reading, updating, and deleting restaurant items.
 * 
 * @module RestaurantModule
 */
@Module({
  imports: [],
  controllers: [
    RestaurantsController /**< The controller responsible for handling HTTP requests related to restaurant items */
  ],
  providers: [
    RestaurantsService /**< The service that contains the business logic for managing restaurant items */
  ],
})
export class RestaurantsModule {}
