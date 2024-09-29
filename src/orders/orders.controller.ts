import { Controller, Get, Req, Query, Param, Post, Put, Delete, NotFoundException, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { OrdersService } from './orders.service';

@Controller('api/orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) { }

  @Get()
  async getOrders(@Query('status') status: string, @Query('sort') sort: string) {
    console.log(status)
    try {
      const orders = sort === 'time'
        ? await this.ordersService.findAllSortedByDate()
        : await this.ordersService.findAll();

      if (!orders || orders.length === 0) {
        throw new NotFoundException('No orders found');
      }
      return status ? await this.filterReadyOrders(orders, status) : orders;

    } catch (err) {
      throw new InternalServerErrorException("Error fetching orders");
    }
  }

  private async filterReadyOrders(orders: any[], status: string) {
    if (!status) return orders;

    const readyOrders = [];

    const promises = orders.map(async (order) => {
      const foodOrdered = await this.ordersService.findFoodOrderedsById(order.food_ordered, order.part);

      if (status === "pending" && foodOrdered.some(food => food.is_ready) && !foodOrdered.every(food => food.is_ready)) {
        readyOrders.push(order);
      } else if (status === "ready" && foodOrdered.every(food => food.is_ready)) {
        readyOrders.push(order);
      }
    });

    await Promise.all(promises);

    console.log(readyOrders);
    return readyOrders;
  }

  @Get(':id')
  async getOneOrder(@Param('id') id: number) {
    try {
      const order = await this.ordersService.findById(Number(id));
      if (!order) {
        throw new NotFoundException(`Order with id ${id} not found`);
      }
      return order;
    } catch (error) {
      throw new InternalServerErrorException(`Error fetching order with id ${id}`);
    }
  }

  @Post()
  async createOrder(@Req() request: Request) {
    try {
      const createdOrder = await this.ordersService.createOne(request.body);
      if (!createdOrder) {
        throw new BadRequestException('Error creating order');
      }
      return createdOrder;
    } catch (error) {
      throw new InternalServerErrorException('Error creating order');
    }
  }

  @Put(':id')
  async updateOneOrder(@Param('id') id: number, @Req() request: Request) {
    try {
      const result = await this.ordersService.updateOne(Number(id), request.body);
      if (result.matchedCount === 0) {
        throw new NotFoundException(`Order with id ${id} not found`);
      }
      if (result.modifiedCount === 0) {
        throw new BadRequestException(`No changes made to the order with id ${id}`);
      }
      return { message: `Order with id ${id} updated successfully` };
    } catch (error) {
      throw new InternalServerErrorException(`Error updating order with id ${id}`);
    }
  }

  @Delete(':id')
  async deleteOneOrder(@Param('id') id: number) {
    try {
      const result = await this.ordersService.deleteOne(Number(id));
      if (result.deletedCount === 0) {
        throw new NotFoundException(`Order with id ${id} not found`);
      }
      return { message: `Order with id ${id} deleted successfully` };
    } catch (error) {
      throw new InternalServerErrorException(`Error deleting order with id ${id}`);
    }
  }
}
