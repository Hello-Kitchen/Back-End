import {
  Controller,
  Get,
  Param,
  UseGuards,
  Query,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { PositiveNumberPipe } from '../../shared/pipe/positive-number.pipe';
import { KpiService } from './kpi.service';
import { DatePipe } from './pipe/date.pipe';
import { JwtAuthGuard } from '../../shared/guards/jwt-auth.guard';
import { BreakdownPipe } from './pipe/breakdown.pipe';

@Controller('api/:idRestaurant/kpi')
@UseGuards(JwtAuthGuard)
export class KpiController {
  constructor(private readonly kpiService: KpiService) {}

  /**
   * Get the average preparation time for a specific dish
   * @param idRestaurant - The restaurant identifier (must be positive)
   * @param timeBegin - Start date of the analysis period (optional)
   * @param timeEnd - End date of the analysis period (optional)
   * @param food - The dish identifier (must be positive)
   * @returns Object containing formatted average time and total orders
   * @throws {NotFoundException} When no orders are found for the specified dish and period
   * @throws {BadRequestException} When input parameters are invalid
   * @throws {InternalServerErrorException} When server encounters an error
   * @example
   * GET /api/1/kpi/averageTimeDish/123?timeBegin=2024-01-01&timeEnd=2024-01-31
   * // returns { formattedTime: { value: 15, unit: 'minutes' }, totalOrders: 50 }
   */
  @Get('averageTimeDish/:food')
  async kpiAverageDishTime(
    @Param('idRestaurant', PositiveNumberPipe) idRestaurant: number,
    @Query('timeBegin', DatePipe) timeBegin: string,
    @Query('timeEnd', DatePipe) timeEnd: string,
    @Param('food', PositiveNumberPipe) food: number,
  ) {
    try {
      const result = await this.kpiService.averageDishTime(
        idRestaurant,
        timeBegin,
        timeEnd,
        food,
      );

      if (result.nbrOrders === 0)
        throw new NotFoundException(
          'No orders found for this dish in the specified period',
        );

      return result;
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw new InternalServerErrorException('Server error');
    }
  }

  /**
   * Get the average preparation time for all dishes
   * @param idRestaurant - The restaurant identifier (must be positive)
   * @param timeBegin - Start date of the analysis period (optional)
   * @param timeEnd - End date of the analysis period (optional)
   * @param breakdown - Whether to breakdown the results by food (optional)
   * @returns Object containing formatted average time and total orders
   * @throws {NotFoundException} When no orders are found for the specified period
   * @throws {BadRequestException} When input parameters are invalid
   * @throws {InternalServerErrorException} When server encounters an error
   * @example
   * GET /api/1/kpi/averageTimeAllDishes?timeBegin=2024-01-01&timeEnd=2024-01-31&breakdown=true
   * // returns { time: { "hours": 0, "minutes": 42, "seconds": 8 }, "nbrOrders": 50 }
   */
  @Get('averageTimeAllDishes')
  async kpiAverageAllDishesTime(
    @Param('idRestaurant', PositiveNumberPipe) idRestaurant: number,
    @Query('timeBegin', DatePipe) timeBegin: string,
    @Query('timeEnd', DatePipe) timeEnd: string,
    @Query('breakdown', BreakdownPipe) breakdown: boolean,
  ) {
    try {
      const result = await this.kpiService.averageAllDishesTime(
        idRestaurant,
        timeBegin,
        timeEnd,
        breakdown,
      );

      if (result === null)
        throw new NotFoundException(
          'No orders found for this dish in the specified period',
        );

      return result;
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw new InternalServerErrorException('Server error');
    }
  }
}
