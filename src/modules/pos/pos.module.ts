import { Module } from '@nestjs/common';
import { PosController } from './pos.controller';
import { PosService } from './pos.service';

/**
 * Module for managing pos items in the restaurant.
 * 
 * The `PosModule` encapsulates the `PosController` and `PosService`
 * to handle operations related to pos items, including
 * creating, reading, updating, and deleting pos items.
 * 
 * @module PosModule
 */
@Module({
  imports: [],
  controllers: [
    PosController /**< The controller responsible for handling HTTP requests related to pos items */
  ],
  providers: [
    PosService /**< The service that contains the business logic for managing pos items */
  ],
})
export class PosModule {}
