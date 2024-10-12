import { Module } from '@nestjs/common';
import { PermissionController } from './permission.controller';
import { PermissionService } from './permission.service';

/**
 * Module for managing permission items in the restaurant.
 * 
 * The `PermissionModule` encapsulates the `PermissionController` and `PermissionService`
 * to handle operations related to permission items, including
 * creating, reading, updating, and deleting permission items.
 * 
 * @module PermissionModule
 */
@Module({
  imports: [],
  controllers: [
    PermissionController /**< The controller responsible for handling HTTP requests related to permission items */
  ],
  providers: [
    PermissionService /**< The service that contains the business logic for managing permission items */
  ],
})
export class PermissionModule {}
