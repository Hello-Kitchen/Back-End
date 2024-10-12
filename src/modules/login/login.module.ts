import { Module } from '@nestjs/common';
import { LoginController } from './login.controller';
import { LoginService } from './login.service';

/**
 * Module for managing login items in the restaurant.
 * 
 * The `LoginModule` encapsulates the `LoginController` and `LoginService`
 * to handle operations related to login items, including
 * creating, reading, updating, and deleting login items.
 * 
 * @module LoginModule
 */
@Module({
  imports: [],
  controllers: [
    LoginController /**< The controller responsible for handling HTTP requests related to login items */
  ],
  providers: [
    LoginService /**< The service that contains the business logic for managing login items */
  ],
})
export class LoginModule {}
