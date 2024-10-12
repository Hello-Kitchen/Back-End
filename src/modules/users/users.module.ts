import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

/**
 * Module for managing user items in the restaurant.
 * 
 * The `UsersModule` encapsulates the `UsersController` and `UsersService`
 * to handle operations related to user items, including
 * creating, reading, updating, and deleting user items.
 * 
 * @module UsersModule
 */
@Module({
  imports: [],
  controllers: [
    UsersController /**< The controller responsible for handling HTTP requests related to user items */
  ],
  providers: [
    UsersService /**< The service that contains the business logic for managing user items */
  ],
})
export class UsersModule {}
