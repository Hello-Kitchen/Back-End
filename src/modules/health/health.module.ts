import { Module } from '@nestjs/common';
import { HealthController } from './health.controller';

/**
 * Module for server health checks.
 *
 * The `HealthModule` encapsulates the `HealthController`, which is responsible
 * for handling HTTP requests to monitor and verify the server's health status.
 * This module provides a simple mechanism for checking the server's running state.
 *
 * @module HealthModule
 */
@Module({
  imports: [],
  controllers: [
    HealthController /**< The controller responsible for handling HTTP requests for server health checks */,
  ],
})
export class HealthModule {}
