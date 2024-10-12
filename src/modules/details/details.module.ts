import { Module } from '@nestjs/common';
import { DetailsController } from './details.controller';
import { DetailsService } from './details.service';

/**
 * The DetailsModule class manages the details associated with restaurants.
 * It encapsulates the functionality related to detail management,
 * providing an interface for HTTP requests through the `DetailsController`
 * and implementing the business logic with the `DetailsService`.
 * 
 * @module DetailsModule
 */

@Module({
  imports: [],
  controllers: [
    DetailsController /**< Manages incoming requests related to restaurant details. */
  ],
  providers: [
    DetailsService /**< Contains the logic for handling details management for restaurants. */
  ],
})
export class DetailsModule {}

