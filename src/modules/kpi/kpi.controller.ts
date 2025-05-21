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
   * @openapi
   * /api/{idRestaurant}/kpi/averageTimeAllDishes:
   *   get:
   *     summary: Get average preparation time for all dishes
   *     description: Returns the average preparation time for each dish in the restaurant, optionally filtered by a date range.
   *     parameters:
   *       - name: idRestaurant
   *         in: path
   *         required: true
   *         description: ID of the restaurant
   *         schema:
   *           type: integer
   *       - name: timeBegin
   *         in: query
   *         required: false
   *         description: Start date of the analysis period (optional, format: YYYY-MM-DD)
   *         schema:
   *           type: string
   *           format: date
   *       - name: timeEnd
   *         in: query
   *         required: false
   *         description: End date of the analysis period (optional, format: YYYY-MM-DD)
   *         schema:
   *           type: string
   *           format: date
   *     responses:
   *       '200':
   *         description: Successful operation
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 type: object
   *                 properties:
   *                   food:
   *                     type: integer
   *                     description: ID of the dish
   *                     example: 123
   *                   time:
   *                     type: object
   *                     properties:
   *                       hours:
   *                         type: integer
   *                         example: 0
   *                       minutes:
   *                         type: integer
   *                         example: 15
   *                       seconds:
   *                         type: integer
   *                         example: 0
   *                   nbrOrders:
   *                     type: integer
   *                     description: Total number of orders analyzed for this dish
   *                     example: 50
   *       '400':
   *         description: Invalid restaurant ID or date format
   *       '401':
   *         description: Unauthorized
   *       '404':
   *         description: No orders found for any dish in the specified period
   *       '5XX':
   *         description: Server error
   *     security:
   *       - BearerAuth: []
   *
   * @example
   * GET /api/1/kpi/averageTimeAllDishes?timeBegin=2024-01-01&timeEnd=2024-01-31
   * // returns [ { food: 123, time: { hours: 0, minutes: 15, seconds: 0 }, nbrOrders: 50 }, ... ]
   */
  @Get('averageTimeAllDishes')
  async kpiAverageAllDishesTime(
    @Param('idRestaurant', PositiveNumberPipe) idRestaurant: number,
    @Query('timeBegin', DatePipe) timeBegin: string,
    @Query('timeEnd', DatePipe) timeEnd: string,
  ) {
    try {
      const result = await this.kpiService.averageAllDishesTime(
        idRestaurant,
        timeBegin,
        timeEnd,
      );

      if (!result || result.length === 0)
        throw new NotFoundException(
          'No orders found for any dish in the specified period',
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
