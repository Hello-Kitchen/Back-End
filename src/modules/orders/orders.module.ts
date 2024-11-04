import { Module } from '@nestjs/common';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';

/**
 * Module for managing order items in the restaurant.
 *
 * The `OrdersModule` encapsulates the `OrdersController` and `OrdersService`
 * to handle operations related to order items, including
 * creating, reading, updating, and deleting order items.
 *
 * @module OrdersModule
 */
@Module({
  imports: [],
  controllers: [
    OrdersController /**< The controller responsible for handling HTTP requests related to order items */,
  ],
  providers: [
    OrdersService /**< The service that contains the business logic for managing order items */,
  ],
})
export class OrdersModule {}
