import { Module } from '@nestjs/common';
import { KpiController } from './kpi.controller';
import { KpiService } from './kpi.service';

/**
 * Module for managing Key Performance Indicators (KPIs).
 *
 * The `KpiModule` encapsulates the `KpiController` and `KpiService`
 * to handle operations related to KPIs, including
 * creating, reading, updating, and deleting KPIs.
 *
 * @module KpiModule
 */

@Module({
  imports: [], // No external modules are imported in this configuration.
  controllers: [KpiController], // The KpiController is responsible for handling HTTP requests related to KPIs.
  providers: [KpiService], // The KpiService contains the business logic for managing KPIs.
})
export class KpiModule {}
