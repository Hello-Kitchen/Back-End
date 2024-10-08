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
  InternalServerErrorException,
} from '@nestjs/common';
import { OrdersService } from './orders.service';

@Controller('api/:idRestaurant/orders')
export class OrdersController {
  private queryMapping: { [key: string]: (idRestaurant: number) => Promise<any> };

  constructor(private readonly ordersService: OrdersService) {
    this.queryMapping = {
      pendingtime: (idRestaurant: number) => this.ordersService.findPendingSortedByDate(idRestaurant),
      readytime: (idRestaurant: number) => this.ordersService.findReadySortedByDate(idRestaurant),
      pending: (idRestaurant: number) => this.ordersService.findPending(idRestaurant),
      ready: (idRestaurant: number) => this.ordersService.findReady(idRestaurant),
      time: (idRestaurant: number) => this.ordersService.findAllSortedByDate(idRestaurant),
      default: (idRestaurant: number) => this.ordersService.findAll(idRestaurant),
    };
  }

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
    } catch (err) {
      throw new InternalServerErrorException(`Error fetching orders: ${err}`);
    }
  }

  @Get(':id')
  async getOneOrder(@Query('forKDS') forKDS: string, @Param('id') id: number, @Param('idRestaurant') idRestaurant: number) {
    try {
      let foodOrdered;
      if (forKDS === 'true') {
        foodOrdered = await this.ordersService.findByIdWithParam(
          Number(idRestaurant),
          Number(id),
        );
        foodOrdered = foodOrdered[0]
      } else {
        foodOrdered = await this.ordersService.findById(Number(idRestaurant), Number(id));
        foodOrdered = foodOrdered.orders[0];
      }
      if (!foodOrdered) {
        throw new NotFoundException(`Order with id ${id} not found`);
      }
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
          if (foundItem) foundItem.quantity += 1;
          else acc.push({ ...item, quantity: 1, name: name.foods[0].name });
          return await acc;
        },
        Promise.resolve([]),
      );
      foodOrdered.food_ordered = await groupedFoodOrdered
      return foodOrdered;
    } catch (error) {
      throw new InternalServerErrorException(
        `Error fetching order with id ${id}: ${error}`,
      );
    }
  }

  @Post()
  async createOrder(@Req() request: Request, @Param('idRestaurant') idRestaurant: number) {
    try {
      const createdOrder = await this.ordersService.createOne(Number(idRestaurant), request.body);
      if (!createdOrder) {
        throw new BadRequestException('Error creating order');
      }
      return createdOrder;
    } catch (error) {
      throw new InternalServerErrorException(`Error creating order: ${error}`);
    }
  }

  @Put(':id')
  async updateOneOrder(@Param('id') id: number, @Req() request: Request, @Param('idRestaurant') idRestaurant: number) {
    try {
      const result = await this.ordersService.updateOne(
        Number(idRestaurant),
        Number(id),
        request.body,
      );
      if (result.matchedCount === 0) {
        throw new NotFoundException(`Order with id ${id} not found`);
      }
      if (result.modifiedCount === 0) {
        throw new BadRequestException(
          `No changes made to the order with id ${id}`,
        );
      }
      return { message: `Order with id ${id} updated successfully` };
    } catch (error) {
      throw new InternalServerErrorException(
        `Error updating order with id ${id}: ${error}`,
      );
    }
  }

  @Delete(':id')
  async deleteOneOrder(@Param('id') id: number, @Param('idRestaurant') idRestaurant: number) {
    try {
      const result = await this.ordersService.deleteOne(Number(idRestaurant), Number(id));
      if (result.modifiedCount === 0) {
        throw new NotFoundException(`Order with id ${id} not found`);
      }
      return { message: `Order with id ${id} deleted successfully` };
    } catch (error) {
      throw new InternalServerErrorException(
        `Error deleting order with id ${id}: ${error}`,
      );
    }
  }

  @Put('status/:id')
  async ChangeStatusFoodOrdered(@Param('idRestaurant') idRestaurant: number, @Param('id') id: number) {
    try {
      const result = await this.ordersService.markFoodOrderedReady(Number(idRestaurant), Number(id));
      if (result.modifiedCount === 0) {
        throw new NotFoundException(`Order with id ${id} not found`);
      }
      return { message: `FoodOrder with id ${id} updated successfully` };
    } catch (error) {
      throw new InternalServerErrorException(
        `Error updating food_ordered with id ${id}: ${error}`,
      );
    }
  }
}
