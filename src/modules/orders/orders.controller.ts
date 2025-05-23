import {
  Controller,
  Get,
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
  Body,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { JwtAuthGuard } from '../../shared/guards/jwt-auth.guard';
import { OrdersDto } from './DTO/orders.dto';
import { PositiveNumberPipe } from '../../shared/pipe/positive-number.pipe';
import { StatusPipe } from './pipe/status.pipe';
import { SortPipe } from './pipe/sort.pipe';
import { ForKDSPipe } from './pipe/forKDS.pipe';
import { ChannelPipe } from './pipe/channel.pipe';
import { PaymentDto } from './DTO/payment.dto';
import { TableIDPipe } from './pipe/tableID.pipe';

@Controller('api/:idRestaurant/orders')
export class OrdersController {
  private queryMapping: {
    [key: string]: (idRestaurant: number) => Promise<any>;
  };

  constructor(private readonly ordersService: OrdersService) {
    // Mapping query keys to service functions for retrieving orders
    // const today = new Date();
    // const formattedDate = today.toISOString().split('T')[0];

    this.queryMapping = {
      pendingtime: (idRestaurant: number) =>
        this.ordersService.findPendingSortedByDate(idRestaurant),
      timepending: (idRestaurant: number) =>
        this.ordersService.findPendingSortedByDate(idRestaurant),
      readytime: (idRestaurant: number) =>
        this.ordersService.findReadySortedByDate(idRestaurant),
      timeready: (idRestaurant: number) =>
        this.ordersService.findReadySortedByDate(idRestaurant),
      servedtime: (idRestaurant: number) =>
        this.ordersService.findOrderWithParam([
          { $match: { id: idRestaurant } },
          { $unwind: '$orders' },
          { $sort: { 'orders.date': 1 } },
          { $match: { 'orders.served': true } },
          { $replaceRoot: { newRoot: '$orders' } },
        ]),
      timeserved: (idRestaurant: number) =>
        this.ordersService.findOrderWithParam([
          { $match: { id: idRestaurant } },
          { $unwind: '$orders' },
          { $sort: { 'orders.date': 1 } },
          { $match: { 'orders.served': true } },
          { $replaceRoot: { newRoot: '$orders' } },
        ]),
      pending: (idRestaurant: number) =>
        this.ordersService.findPending(idRestaurant),
      ready: (idRestaurant: number) =>
        this.ordersService.findReady(idRestaurant),
      time: (idRestaurant: number) =>
        this.ordersService.findAllSortedByDate(idRestaurant),
      served: (idRestaurant: number) =>
        this.ordersService.findOrderWithParam([
          { $match: { id: idRestaurant } },
          { $unwind: '$orders' },
          { $match: { 'orders.served': true } },
          { $replaceRoot: { newRoot: '$orders' } },
        ]),
      default: (idRestaurant: number) =>
        this.ordersService.findAll(idRestaurant),
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
    @Query('status', StatusPipe) status: string,
    @Query('sort', SortPipe) sort: string,
    @Query('tableID', TableIDPipe) tableID: number,
    @Param('idRestaurant', PositiveNumberPipe) idRestaurant: number,
  ) {
    try {
      if (tableID) {
        const result = await this.ordersService.findByTableID(
          Number(idRestaurant),
          tableID,
        );
        return result;
      } else {
        const queryKey = `${status || ''}${sort || ''}`.trim() || 'default';
        const queryFunc =
          this.queryMapping[queryKey] || this.queryMapping['default'];
        const result = await queryFunc(Number(idRestaurant));

        return result;
      }
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Return the id of the channel ask.
   *
   * @param {string} channel - The channel asking.
   * @param {number} idRestaurant - The ID of the restaurant.
   * @returns {Promise<any>} The next id of the channel.
   * @throws {InternalServerErrorException} If an error occurs while fetching id.
   */
  @UseGuards(JwtAuthGuard)
  @Get('number')
  async getIdChannel(
    @Query('channel', ChannelPipe) channel: string,
    @Param('idRestaurant', PositiveNumberPipe) idRestaurant: number,
  ) {
    try {
      const result = await this.ordersService.newIdOrder(
        Number(idRestaurant),
        channel,
      );
      return result.sequence_value;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
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
  async getOneOrder(
    @Query('forKDS', ForKDSPipe) forKDS: string,
    @Param('id', PositiveNumberPipe) id: number,
    @Param('idRestaurant', PositiveNumberPipe) idRestaurant: number,
  ) {
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
        foodOrdered = await this.ordersService.findById(
          Number(idRestaurant),
          Number(id),
        );
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
            item.food,
          );

          const foundItem = acc.find(
            (el) =>
              JSON.stringify(el.food) === JSON.stringify(item.food) &&
              JSON.stringify(el.mods_ingredients) ===
                JSON.stringify(item.mods_ingredients) &&
              JSON.stringify(el.is_ready) === JSON.stringify(item.is_ready) &&
              JSON.stringify(el.note) === JSON.stringify(item.note) &&
              JSON.stringify(el.details) === JSON.stringify(item.details),
          );
          // Increment quantity if item already exists in the accumulator
          if (foundItem) foundItem.quantity += 1;
          else
            acc.push({
              ...item,
              quantity: 1,
              name: name.foods[0].name,
              price: name.foods[0].price,
            });
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
      throw new HttpException(
        'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Creates a new order.
   *
   * @param {OrdersDto} createOrderDTO - The request object containing order details.
   * @param {number} idRestaurant - The ID of the restaurant.
   * @returns {Promise<any>} The created order.
   * @throws {BadRequestException} If the order creation fails.
   * @throws {InternalServerErrorException} If an error occurs while creating the order.
   */
  @UseGuards(JwtAuthGuard)
  @Post()
  async createOrder(
    @Body() createOrderDTO: OrdersDto,
    @Param('idRestaurant', PositiveNumberPipe) idRestaurant: number,
    @Query('idTable', TableIDPipe) idTable: number,
  ) {
    try {
      const createdOrder = await this.ordersService.createOne(
        Number(idRestaurant),
        createOrderDTO,
        idTable,
      );
      return createdOrder;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Updates an existing order by its ID.
   *
   * @param {number} id - The ID of the order to update.
   * @param {OrdersDto} updateOrderDTO - The request object containing updated order details.
   * @param {number} idRestaurant - The ID of the restaurant.
   * @returns {Promise<any>} A success message upon successful update.
   * @throws {NotFoundException} If the order is not found.
   * @throws {BadRequestException} If no changes were made to the order.
   * @throws {InternalServerErrorException} If an error occurs while updating the order.
   */
  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async updateOneOrder(
    @Param('id', PositiveNumberPipe) id: number,
    @Body() updateOrderDTO: OrdersDto,
    @Param('idRestaurant', PositiveNumberPipe) idRestaurant: number,
  ) {
    try {
      const result = await this.ordersService.updateOne(
        Number(idRestaurant),
        Number(id),
        updateOrderDTO,
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
      throw new HttpException(
        'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
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
  async deleteOneOrder(
    @Param('id', PositiveNumberPipe) id: number,
    @Param('idRestaurant', PositiveNumberPipe) idRestaurant: number,
  ) {
    try {
      const result = await this.ordersService.deleteOne(
        Number(idRestaurant),
        Number(id),
      );
      if (result.modifiedCount === 0) {
        throw new NotFoundException();
      }
      return;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
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
  async ChangeStatusFoodOrdered(
    @Param('idRestaurant', PositiveNumberPipe) idRestaurant: number,
    @Param('id', PositiveNumberPipe) id: number,
  ) {
    try {
      const result = await this.ordersService.markFoodOrderedReady(
        Number(idRestaurant),
        Number(id),
      );
      if (result.modifiedCount === 0) {
        throw new NotFoundException();
      }
      return;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * @brief Marks a specific food order as ready by updating the 'part' field.
   *
   * This method is responsible for handling HTTP PUT requests to change the `part` of an order,
   * identified by the `idRestaurant` and `id` parameters. It uses the `ordersService` to perform
   * the update and ensures that the operation was successful.
   *
   * @param {number} idRestaurant The ID of the restaurant where the order is located.
   * @param {number} id The ID of the order that will be modified.
   * @returns {Promise<void>} Returns nothing on success, throws an exception if the order is not found or if there is a server error.
   *
   * @throws {NotFoundException} If the order to update was not found.
   * @throws {HttpException} For other errors, such as internal server issues.
   */
  @UseGuards(JwtAuthGuard)
  @Put('next/:id')
  async ChangePartOrder(
    @Param('idRestaurant', PositiveNumberPipe) idRestaurant: number,
    @Param('id', PositiveNumberPipe) id: number,
  ): Promise<void> {
    try {
      const result = await this.ordersService.incrementOrderPart(
        Number(idRestaurant),
        Number(id),
      );

      if (result.modifiedCount === 0) {
        throw new NotFoundException();
      }
      return;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * @brief Change the fields 'served' for a order.
   *
   * This method is responsible for handling HTTP PUT requests to change the `served` of an order,
   * identified by the `idRestaurant` and `id` parameters. It uses the `ordersService` to perform
   * the update and ensures that the operation was successful.
   *
   * @param {number} idRestaurant The ID of the restaurant where the order is located.
   * @param {number} id The ID of the order that will be modified.
   * @returns {Promise<void>} Returns nothing on success, throws an exception if the order is not found or if there is a server error.
   *
   * @throws {NotFoundException} If the order to update was not found.
   * @throws {HttpException} For other errors, such as internal server issues.
   */
  @UseGuards(JwtAuthGuard)
  @Put('served/:id')
  async ChangeStatusServed(
    @Param('idRestaurant', PositiveNumberPipe) idRestaurant: number,
    @Param('id', PositiveNumberPipe) id: number,
  ): Promise<void> {
    try {
      const result = await this.ordersService.changeValueServed(
        Number(idRestaurant),
        Number(id),
      );

      if (result.modifiedCount === 0) {
        throw new NotFoundException();
      }
      return;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * @brief Add the fields 'payment' for a order.
   *
   * This method is responsible for handling HTTP PUT requests to add the `payment` of an order,
   * identified by the `idRestaurant` and `id` parameters. It uses the `ordersService` to perform
   * the update and ensures that the operation was successful.
   *
   * @param {number} idRestaurant The ID of the restaurant where the order is located.
   * @param {number} id The ID of the order that will be modified.
   * @param {PaymentDto} paymentDTO - The request object containing updated payment details.
   * @returns {Promise<void>} Returns nothing on success, throws an exception if the order is not found or if there is a server error.
   *
   * @throws {NotFoundException} If the order to update was not found.
   * @throws {HttpException} For other errors, such as internal server issues.
   */
  @UseGuards(JwtAuthGuard)
  @Put('payment/:id')
  async AddPayment(
    @Param('idRestaurant', PositiveNumberPipe) idRestaurant: number,
    @Param('id', PositiveNumberPipe) id: number,
    @Body() paymentDTO: PaymentDto,
  ): Promise<void> {
    try {
      const result = await this.ordersService.addPayment(
        Number(idRestaurant),
        Number(id),
        paymentDTO,
      );

      if (result.modifiedCount === 0) {
        throw new NotFoundException();
      }
      return;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
