import {
  Controller,
  Get,
  Req,
  Query,
  Param,
  Post,
  Put,
  Delete,
  NotFoundException,
  BadRequestException,
  HttpException,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { JwtAuthGuard } from 'src/shared/guards/jwt-auth.guard';

@Controller('api/:idRestaurant/orders')
export class OrdersController {
  private queryMapping: { [key: string]: (idRestaurant: number) => Promise<any> };

  constructor(private readonly ordersService: OrdersService) {
    // Mapping query keys to service functions for retrieving orders
    this.queryMapping = {
      pendingtime: (idRestaurant: number) => this.ordersService.findPendingSortedByDate(idRestaurant),
      readytime: (idRestaurant: number) => this.ordersService.findReadySortedByDate(idRestaurant),
      pending: (idRestaurant: number) => this.ordersService.findPending(idRestaurant),
      ready: (idRestaurant: number) => this.ordersService.findReady(idRestaurant),
      time: (idRestaurant: number) => this.ordersService.findAllSortedByDate(idRestaurant),
      default: (idRestaurant: number) => this.ordersService.findAll(idRestaurant),
    };
  }

  /**
   * Retrieves orders based on the provided status and sort parameters.
   * 
   * @param {string} status - The status of the orders to filter.
   * @param {string} sort - The sort order of the retrieved orders.
   * @param {number} idRestaurant - The ID of the restaurant.
   * @returns {Promise<any>} The list of orders.
   * @throws {InternalServerErrorException} If an error occurs while fetching orders.
   */
  @UseGuards(JwtAuthGuard)
  @Get()
  async getOrders(
    @Query('status') status: string,
    @Query('sort') sort: string,
    @Param('idRestaurant') idRestaurant: number
  ) {
    try {
      const queryKey = `${status || ''}${sort || ''}`.trim() || 'default';
      const queryFunc = this.queryMapping[queryKey] || this.queryMapping['default'];
      const result = await queryFunc(Number(idRestaurant))

      return result;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * Retrieves a specific order by its ID.
   * 
   * @param {string} forKDS - Indicates if the request is for KDS (Kitchen Display System).
   * @param {number} id - The ID of the order to retrieve.
   * @param {number} idRestaurant - The ID of the restaurant.
   * @returns {Promise<any>} The order details.
   * @throws {NotFoundException} If the order is not found.
   * @throws {InternalServerErrorException} If an error occurs while fetching the order.
   */
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getOneOrder(@Query('forKDS') forKDS: string, @Param('id') id: number, @Param('idRestaurant') idRestaurant: number) {
    try {
      let foodOrdered;
      // Fetching order details based on the KDS flag
      if (forKDS === 'true') {
        foodOrdered = await this.ordersService.findByIdWithParam(
          Number(idRestaurant),
          Number(id),
        );
        foodOrdered = foodOrdered[0];
      } else {
        foodOrdered = await this.ordersService.findById(Number(idRestaurant), Number(id));
        foodOrdered = foodOrdered.orders[0];
      }
      if (!foodOrdered) {
        throw new NotFoundException();
      }

      // Grouping food ordered items based on specific attributes
      const groupedFoodOrdered = foodOrdered.food_ordered.reduce(
        async (accPromise, itemPromise) => {
          const acc = await accPromise;
          const item = await itemPromise;
          const name = await this.ordersService.findFoodByIdsWithParam(
            Number(idRestaurant),
            item.food
          );

          const foundItem = acc.find(
            (el) =>
              JSON.stringify(el.food) === JSON.stringify(item.food) &&
              JSON.stringify(el.mods_ingredients) === JSON.stringify(item.mods_ingredients) &&
              JSON.stringify(el.is_ready) === JSON.stringify(item.is_ready) &&
              JSON.stringify(el.note) === JSON.stringify(item.note) &&
              JSON.stringify(el.details) === JSON.stringify(item.details),
          );
          // Increment quantity if item already exists in the accumulator
          if (foundItem) foundItem.quantity += 1;
          else acc.push({ ...item, quantity: 1, name: name.foods[0].name });
          return await acc;
        },
        Promise.resolve([]),
      );

      foodOrdered.food_ordered = await groupedFoodOrdered;
      return foodOrdered;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * Creates a new order.
   * 
   * @param {Request} request - The request object containing order details.
   * @param {number} idRestaurant - The ID of the restaurant.
   * @returns {Promise<any>} The created order.
   * @throws {BadRequestException} If the order creation fails.
   * @throws {InternalServerErrorException} If an error occurs while creating the order.
   */
  @UseGuards(JwtAuthGuard)
  @Post()
  async createOrder(@Req() request: Request, @Param('idRestaurant') idRestaurant: number) {
    try {
      const createdOrder = await this.ordersService.createOne(Number(idRestaurant), request.body);
      if (createdOrder.modifiedCount === 0) {
        throw new NotFoundException();
      }
      if (createdOrder.matchedCount === 0) {
        throw new NotFoundException();
      }
      return createdOrder;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * Updates an existing order by its ID.
   * 
   * @param {number} id - The ID of the order to update.
   * @param {Request} request - The request object containing updated order details.
   * @param {number} idRestaurant - The ID of the restaurant.
   * @returns {Promise<any>} A success message upon successful update.
   * @throws {NotFoundException} If the order is not found.
   * @throws {BadRequestException} If no changes were made to the order.
   * @throws {InternalServerErrorException} If an error occurs while updating the order.
   */
  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async updateOneOrder(@Param('id') id: number, @Req() request: Request, @Param('idRestaurant') idRestaurant: number) {
    try {
      const result = await this.ordersService.updateOne(
        Number(idRestaurant),
        Number(id),
        request.body,
      );
      if (result.matchedCount === 0) {
        throw new NotFoundException();
      }
      if (result.modifiedCount === 0) {
        throw new BadRequestException();
      }
      return;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * Deletes an existing order by its ID.
   * 
   * @param {number} id - The ID of the order to delete.
   * @param {number} idRestaurant - The ID of the restaurant.
   * @returns {Promise<any>} A success message upon successful deletion.
   * @throws {NotFoundException} If the order is not found.
   * @throws {InternalServerErrorException} If an error occurs while deleting the order.
   */
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async deleteOneOrder(@Param('id') id: number, @Param('idRestaurant') idRestaurant: number) {
    try {
      const result = await this.ordersService.deleteOne(Number(idRestaurant), Number(id));
      if (result.modifiedCount === 0) {
        throw new NotFoundException();
      }
      return;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * Changes the status of a food order to ready.
   * 
   * @param {number} idRestaurant - The ID of the restaurant.
   * @param {number} id - The ID of the food order.
   * @returns {Promise<any>} A success message upon successful status change.
   * @throws {NotFoundException} If the order is not found.
   * @throws {InternalServerErrorException} If an error occurs while updating the order status.
   */
  @UseGuards(JwtAuthGuard)
  @Put('status/:id')
  async ChangeStatusFoodOrdered(@Param('idRestaurant') idRestaurant: number, @Param('id') id: number) {
    try {
      const result = await this.ordersService.markFoodOrderedReady(Number(idRestaurant), Number(id));
      if (result.modifiedCount === 0) {
        throw new NotFoundException();
      }
      return;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
