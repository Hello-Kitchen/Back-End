import { Module } from '@nestjs/common';
import { PosConfigController } from './pos_config.controller';
import { PosConfigService } from './pos_config.service';

/**
 * Module for managing pos_config items in the pos_config.
 *
 * The `PosConfigModule` encapsulates the `PosConfigController` and `PosConfigService`
 * to handle operations related to pos_config items, including
 * creating, reading, updating, and deleting pos_config items.
 *
 * @module PosConfigModule
 */
@Module({
  imports: [],
  controllers: [
    PosConfigController /**< The controller responsible for handling HTTP requests related to pos_config items */,
  ],
  providers: [
    PosConfigService /**< The service that contains the business logic for managing pos_config items */,
  ],
})
export class RestaurantsModule {}
