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
import { UseCasePipe } from './pipe/useCase.pipe';

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
    @Query('date', DatePipe) date?: string,
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

  /**
   * Get the average basket value for a specific period
   * @param idRestaurant - The restaurant identifier (must be positive)
   * @param timeBegin - Start date of the analysis period (optional)
   * @param timeEnd - End date of the analysis period (optional)
   * @param channel - The channel of the orders (optional)
   * @returns The average basket value for the specified period and channel and the number of orders
   * @throws {BadRequestException} When input parameters are invalid
   * @throws {InternalServerErrorException} When server encounters an error
   * @example
   * GET /api/1/kpi/averageBasket?timeBegin=2024-01-01&timeEnd=2024-01-31&channel=togo
   * // returns {"Average value": 23,"Nbr orders": 26}
   */
  @Get('averageBasket')
  async kpiAverageBasket(
    @Param('idRestaurant', PositiveNumberPipe) idRestaurant: number,
    @Query('timeBegin', DatePipe) timeBegin: string,
    @Query('timeEnd', DatePipe) timeEnd: string,
    @Query('channel', ChannelPipe) channel: string,
  ) {
    try {
      return this.kpiService.averageBasket(
        idRestaurant,
        timeBegin,
        timeEnd,
        channel,
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
  @Get('ingredientForecast')
  async kpiIngredientForecast(
    @Param('idRestaurant', PositiveNumberPipe) idRestaurant: number,
    @Query('date', DatePipe) date?: string,
    @Query('useCase', UseCasePipe) useCase?: string,
  ) {
    try {
      const forecast = await this.kpiService.dishForecast(idRestaurant, date);
      const ingredients = await this.kpiService.ingredientsForecast(
        idRestaurant,
        forecast,
        useCase,
      );
      return ingredients;
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
   * Get the KPIs for a specific use case
   * @param idRestaurant - The restaurant identifier (must be positive)
   * @param useCase - The use case (POS or KDS)
   * @returns The KPIs for the specified use case
   * @throws {BadRequestException} When input parameters are invalid
   * @throws {InternalServerErrorException} When server encounters an error
   * @example
   * GET /api/1/kpi/displayKpi?useCase=POS
   * // returns { ordersInProgress: 100, clientsCount: 100, averageWaitingTime1h: 100, averageWaitingTime15m: 100, averagePrepTime1h: 100, averagePrepTime15m: 100 }
   */
  @Get('displayKpi')
  async kpiDisplayKpi(
    @Param('idRestaurant', PositiveNumberPipe) idRestaurant: number,
    @Query('useCase', UseCasePipe) useCase: string,
  ) {
    const today = new Date().toISOString();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const oneHourAgo = new Date(
      new Date().getTime() - 1 * 60 * 60 * 1000,
    ).toISOString();
    const fifteenMinutesAgo = new Date(
      new Date().getTime() - 15 * 60 * 1000,
    ).toISOString();
    if (useCase === 'POS') {
      const res = {
        ordersInProgress: await this.kpiService.clientsCount(
          idRestaurant,
          today.split('T')[0],
          tomorrow.toISOString().split('T')[0],
          undefined,
          undefined,
        ),
        clientsCount: await this.kpiService.clientsCount(
          idRestaurant,
          today.split('T')[0],
          tomorrow.toISOString().split('T')[0],
          'Sur place',
          undefined,
        ),
        averagePrepTime1h: await this.kpiService.averageAllDishesTime(
          idRestaurant,
          oneHourAgo,
          today,
          true,
        ),
        averagePrepTime15m: await this.kpiService.averageAllDishesTime(
          idRestaurant,
          fifteenMinutesAgo,
          today,
          true,
        ),
        averageWaitingTime1h: await this.kpiService.averageTimeOrders(
          idRestaurant,
          oneHourAgo,
          today,
          undefined,
        ),
        averageWaitingTime15m: await this.kpiService.averageTimeOrders(
          idRestaurant,
          fifteenMinutesAgo,
          today,
          undefined,
        ),
      };
      return res;
    } else {
      const res = {
        last15mOrders: await this.kpiService.clientsCount(
          idRestaurant,
          fifteenMinutesAgo,
          today,
          undefined,
          undefined,
        ),
        clientsCount: await this.kpiService.clientsCount(
          idRestaurant,
          today.split('T')[0],
          tomorrow.toISOString().split('T')[0],
          'Sur place',
          undefined,
        ),
        averagePrepTime1h: await this.kpiService.averageAllDishesTime(
          idRestaurant,
          oneHourAgo,
          today,
          true,
        ),
        averagePrepTime15m: await this.kpiService.averageAllDishesTime(
          idRestaurant,
          fifteenMinutesAgo,
          today,
          true,
        ),
        averageWaitingTime1h: await this.kpiService.averageTimeOrders(
          idRestaurant,
          oneHourAgo,
          today,
          undefined,
        ),
        averageWaitingTime15m: await this.kpiService.averageTimeOrders(
          idRestaurant,
          fifteenMinutesAgo,
          today,
          undefined,
        ),
      };
      return res;
    }
  }

  /**
   * Counts the number of orders within a given interval, with optional grouping by time slots (in minutes).
   * @param idRestaurant - The restaurant identifier (must be positive)
   * @param timeBegin - Start date/time of the interval (required)
   * @param timeEnd - End date/time of the interval (required)
   * @param breakdown - (optional) Slot duration in minutes for grouping
   * @returns Either the total number of orders, or an object grouped by time slot
   * @throws {BadRequestException} If parameters are invalid
   * @throws {InternalServerErrorException} In case of server error
   * @example
   * GET /api/1/kpi/ordersCount?timeBegin=2024-01-01T00:00:00Z&timeEnd=2024-01-01T01:00:00Z&breakdown=15
   * // returns { "00:00": 5, "00:15": 8, ... }
   * GET /api/1/kpi/ordersCount?timeBegin=2024-01-01T00:00:00Z&timeEnd=2024-01-01T01:00:00Z
   * // returns 23
   */
  @Get('ordersCount')
  async kpiOrdersCount(
    @Param('idRestaurant', PositiveNumberPipe) idRestaurant: number,
    @Query('timeBegin', DatePipe) timeBegin: string,
    @Query('timeEnd', DatePipe) timeEnd: string,
    @Query('breakdown') breakdown?: number,
  ) {
    if (breakdown) {
      const slots: { timeBegin: string; timeEnd: string }[] = [];
      let current = new Date(timeBegin);
      const end = new Date(timeEnd);
      const orders = {};

      while (current < end) {
        const slotStart = new Date(current);
        const slotEnd = new Date(current.getTime() + breakdown * 60000);
        slots.push({
          timeBegin: slotStart.toISOString(),
          timeEnd: (slotEnd < end ? slotEnd : end).toISOString(),
        });
        current = slotEnd;
      }
      for (const slot of slots) {
        const date = new Date(slot.timeBegin);
        const hours = date.getUTCHours().toString().padStart(2, '0');
        const minutes = date.getUTCMinutes().toString().padStart(2, '0');
        orders[`${hours}:${minutes}`] = await this.kpiService.clientsCount(
          idRestaurant,
          slot.timeBegin,
          slot.timeEnd,
          undefined,
          undefined,
        );
      }
      return orders;
    } else {
      return this.kpiService.clientsCount(
        idRestaurant,
        timeBegin,
        timeEnd,
        undefined,
        undefined,
      );
    }
  }

  /**
   * Get the revenues for a specific period
   * @param idRestaurant - The restaurant identifier (must be positive)
   * @param timeBegin - Start date of the analysis period (optional)
   * @param timeEnd - End date of the analysis period (optional)
   * @param breakdown - The breakdown of the analysis period (optional)
   * @param useCase - The use case (POS or KDS)
   * @returns The revenues for the specified period
   * @throws {BadRequestException} When input parameters are invalid
   * @throws {InternalServerErrorException} When server encounters an error
   * @example
   * GET /api/1/kpi/revenues?timeBegin=2024-01-01&timeEnd=2024-01-31&breakdown=15&useCase=POS
   * // returns { "12:00": { revenues: 100, ordersCount: 10, averageWaitingTime: 10 }, "12:15": { revenues: 100, ordersCount: 10, averageWaitingTime: 10 } }
   */
  @Get('revenues')
  async kpiRevenues(
    @Param('idRestaurant', PositiveNumberPipe) idRestaurant: number,
    @Query('timeBegin', DatePipe) timeBegin: string,
    @Query('timeEnd', DatePipe) timeEnd: string,
    @Query('breakdown') breakdown?: number,
    @Query('useCase', UseCasePipe) useCase?: string,
  ) {
    if (breakdown) {
      const slots: { timeBegin: string; timeEnd: string }[] = [];
      let current = new Date(timeBegin);
      const end = new Date(timeEnd);
      const orders = {};

      while (current < end) {
        const slotStart = new Date(current);
        const slotEnd = new Date(current.getTime() + breakdown * 60000);
        slots.push({
          timeBegin: slotStart.toISOString(),
          timeEnd: (slotEnd < end ? slotEnd : end).toISOString(),
        });
        current = slotEnd;
      }

      for (const slot of slots) {
        const date = new Date(slot.timeBegin);
        const hours = date.getUTCHours().toString().padStart(2, '0');
        const minutes = date.getUTCMinutes().toString().padStart(2, '0');
        const averageWaitingTime =
          useCase !== undefined
            ? await this.kpiService.averageTimeOrders(
                idRestaurant,
                slot.timeBegin,
                slot.timeEnd,
                undefined,
              )
            : undefined;

        const { total, ordersCount } = await this.kpiService.revenueTotal(
          idRestaurant,
          slot.timeBegin,
          slot.timeEnd,
          undefined,
        );
        const orderData: any = {
          revenues: total,
          ordersCount: ordersCount,
        };
        if (useCase !== undefined)
          orderData.averageWaitingTime = averageWaitingTime;
        orders[`${hours}:${minutes}`] = orderData;
      }

      return orders;
    } else {
      const averageWaitingTime =
        useCase !== undefined
          ? await this.kpiService.averageTimeOrders(
              idRestaurant,
              timeBegin,
              timeEnd,
              undefined,
            )
          : undefined;

      const { total, ordersCount } = await this.kpiService.revenueTotal(
        idRestaurant,
        timeBegin,
        timeEnd,
        undefined,
      );
      const orders: any = {
        revenues: total,
        ordersCount: ordersCount,
      };
      if (useCase !== undefined) orders.averageWaitingTime = averageWaitingTime;
      return orders;
    }
  }
}
