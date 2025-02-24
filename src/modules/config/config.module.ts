import { Module } from '@nestjs/common';
import { ConfigController } from './config.controller';
import { ConfigService } from './config.service';

/**
 * Module for managing the config in the restaurant.
 *
 * The `ConfigModule` encapsulates the `ConfigController` and `ConfigService`
 * to handle operations related to the config, including
 * creating, reading, and updating the config.
 *
 * @module TableModule
 */
@Module({
  imports: [],
  controllers: [
    ConfigController /**< The controller responsible for handling HTTP requests related to the config */,
  ],
  providers: [
    ConfigService /**< The service that contains the business logic for managing config items */,
  ],
})
export class TableModule {}
