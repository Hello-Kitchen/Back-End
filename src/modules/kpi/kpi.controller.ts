import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { KpiService } from './kpi.service';
import { JwtAuthGuard } from '../../shared/guards/jwt-auth.guard';


@Controller('api/:idRestaurant/kpi')
// @UseGuards(JwtAuthGuard)
export class KpiController {
  constructor(private readonly kpiService: KpiService) {}

  @Get('average_dish_time/:food')
  kpiAverageDishTime(
    @Param('idRestaurant') idRestaurant: number,
    @Query('timeBegin') timeBegin: string,
    @Query('timeEnd') timeEnd: string,
    @Param('food') food: number,
  ) {
    console.log(idRestaurant, timeBegin, timeEnd, food);
    return this.kpiService.averageDishTime(idRestaurant, timeBegin, timeEnd, food);
  }
}
