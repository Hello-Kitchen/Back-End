import { Module } from '@nestjs/common';
import { TableController } from './table.controller';
import { TableService } from './table.service';

/**
 * Module for managing table items in the PosConfig.
 *
 * The `TableModule` encapsulates the `TableController` and `TableService`
 * to handle operations related to table items, including
 * creating, reading, updating, and deleting table items.
 *
 * @module TableModule
 */
@Module({
  imports: [],
  controllers: [
    TableController /**< The controller responsible for handling HTTP requests related to table items */,
  ],
  providers: [
    TableService /**< The service that contains the business logic for managing table items */,
  ],
})
export class TableModule {}
