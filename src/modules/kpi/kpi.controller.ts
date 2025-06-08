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
import { ChannelPipe } from './pipe/channel.pipe';
import { ServedPipe } from './pipe/served.pipe';

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

  /**
   * Get the average time for orders to be served in a restaurant
   * @param idRestaurant - The restaurant identifier (must be positive)
   * @param timeBegin - Start date of the analysis period (optional)
   * @param timeEnd - End date of the analysis period (optional)
   * @returns An object containing the formatted average time and total number of orders
   * @throws {NotFoundException} When no orders are found for the specified period
   * @throws {BadRequestException} When input parameters are invalid
   * @throws {InternalServerErrorException} When server encounters an error
   * @example
   * GET /api/1/kpi/averageTimeOrders?timeBegin=2024-01-01&timeEnd=2024-01-31
   * // returns { time: { "hours": 0, "minutes": 42, "seconds": 8 }, "nbrOrders": 50 }
   */
  @Get('averageOrders')
  async kpiAverageTimeOrders(
    @Param('idRestaurant', PositiveNumberPipe) idRestaurant: number,
    @Query('timeBegin', DatePipe) timeBegin: string,
    @Query('timeEnd', DatePipe) timeEnd: string,
    @Query('channel', ChannelPipe) channel: string,
  ) {
    try {
      const result = await this.kpiService.averageTimeOrders(
        idRestaurant,
        timeBegin,
        timeEnd,
        channel,
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
   * Get the most popular dish for a specific period
   * @param idRestaurant - The restaurant identifier (must be positive)
   * @param timeBegin - Start date of the analysis period (optional)
   * @param timeEnd - End date of the analysis period (optional)
   * @returns The most popular dish for the specified period
   * @throws {NotFoundException} When no orders are found for any dish in the specified period
   * @throws {BadRequestException} When input parameters are invalid
   * @throws {InternalServerErrorException} When server encounters an error
   * @example
   * GET /api/1/kpi/popularDish?timeBegin=2024-01-01&timeEnd=2024-01-31
   * // returns { food: 123, nbrOrders: 100 }
   */
  @Get('popularDish')
  async kpiPopularDish(
    @Param('idRestaurant', PositiveNumberPipe) idRestaurant: number,
    @Query('timeBegin', DatePipe) timeBegin: string,
    @Query('timeEnd', DatePipe) timeEnd: string,
  ) {
    try {
      const result = await this.kpiService.popularDish(
        idRestaurant,
        timeBegin,
        timeEnd,
      );
      if (!result)
        throw new NotFoundException(
          'No orders found for any dish in the specified period',
        );
      return result;
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      )
        throw error;
      throw new InternalServerErrorException('Server error');
    }
  }

  /**
   * Get the number of clients for a specific period
   * @param idRestaurant - The restaurant identifier (must be positive)
   * @param timeBegin - Start date of the analysis period (optional)
   * @param timeEnd - End date of the analysis period (optional)
   * @param channel - The channel of the orders (optional)
   * @param served - Whether the orders are served (optional)
   * @returns The number of clients for the specified period
   * @throws {BadRequestException} When input parameters are invalid
   * @throws {InternalServerErrorException} When server encounters an error
   * @example
   * GET /api/1/kpi/clientsCount?timeBegin=2024-01-01&timeEnd=2024-01-31&channel=togo&served=true
   * // returns 100
   */
  @Get('clientsCount')
  async kpiClientsCount(
    @Param('idRestaurant', PositiveNumberPipe) idRestaurant: number,
    @Query('timeBegin', DatePipe) timeBegin: string,
    @Query('timeEnd', DatePipe) timeEnd: string,
    @Query('channel', ChannelPipe) channel: string,
    @Query('served', ServedPipe) served: boolean,
  ) {
    try {
      return this.kpiService.clientsCount(
        idRestaurant,
        timeBegin,
        timeEnd,
        channel,
        served,
      );
    } catch (error) {
      if (error instanceof BadRequestException) throw error;
      throw new InternalServerErrorException('Server error');
    }
  }

  /**
   * Forecast daily sales for each dish
   * @param idRestaurant - The restaurant identifier (must be positive)
   * @param date - (optionnel) Date cible au format ISO (ex: 2025-05-28T20:58:53.621Z)
   * @returns Array of objects: { food, forecast } (forecast = moyenne/jour)
   * @throws {NotFoundException} When no orders are found for any dish
   * @throws {BadRequestException} When input parameters are invalid
   * @throws {InternalServerErrorException} When server encounters an error
   * @example
   * GET /api/1/kpi/dishForecast?date=2025-05-28T20:58:53.621Z
   * // returns [ { food: 12, forecast: 15 }, { food: 13, forecast: 8 } ]
   */
  @Get('dishForecast')
  async kpiDishForecast(
    @Param('idRestaurant', PositiveNumberPipe) idRestaurant: number,
    @Query('date') date?: string,
  ) {
    try {
      const result = await this.kpiService.dishForecast(idRestaurant, date);
      return result;
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      )
        throw error;
      throw new InternalServerErrorException('Server error');
    }
  }
}
