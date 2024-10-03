import { Controller, Get, Req, Query, Param, Post, Put, Delete, NotFoundException, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { AnyObject, StringExpressionOperatorReturningBoolean } from 'mongoose';
import { WithId } from 'mongodb';

@Controller('api/orders')
export class OrdersController {
  private queryMapping: { [key: string]: () => Promise<any> };

  constructor(private readonly ordersService: OrdersService) { 
    this.queryMapping = {
      'pendingtime': () => this.ordersService.findPendingSortedByDate(),
      'readytime': () => this.ordersService.findReadySortedByDate(),
      'pending': () => this.ordersService.findPending(),
      'ready': () => this.ordersService.findReady(),
      'time': () => this.ordersService.findAllSortedByDate(),
      'default': () => this.ordersService.findAll()
    };
  }

  @Get()
  async getOrders(@Query('status') status: string, @Query('sort') sort: string) {
    try {
      const queryKey = `${status || ''}${sort || ''}`.trim() || 'default';
      console.log(queryKey)
      const queryFunc = this.queryMapping[queryKey] || this.queryMapping['default'];

      return await queryFunc();
    } catch (err) {
      throw new InternalServerErrorException("Error fetching orders");
    }
  }

  @Get(':id')
  async getOneOrder(@Query('forKDS') forKDS: string, @Param('id') id: number) {
    try {
      if (forKDS === "true") {
        const foodOrdered = await this.ordersService.findByIdWithParam(Number(id), { projection: { food_ordered: { $map: { input: { $filter: { input: "$food_ordered", as: "item", cond: { $eq: ["$$item.part", "$part"] } } }, as: "item", in: { food: "$$item.food", mods_ingredients: "$$item.mods_ingredients", note: "$$item.note", is_ready: "$$item.is_ready"  }  } }, _id: 0 } });
        const groupedFoodOrdered = foodOrdered.food_ordered.reduce(async (accPromise, itemPromise) => {
          let acc = await accPromise;
          const item = await itemPromise;
          const name = await this.ordersService.findFoodByIdsWithParam(item.food, { projection: { name: 1, _id: 0 } });

          const foundItem = acc.find(el => 
              JSON.stringify(el.food) === JSON.stringify(item.food) && JSON.stringify(el.mods_ingredients) === JSON.stringify(item.mods_ingredients) && JSON.stringify(el.is_ready) === JSON.stringify(item.is_ready) && JSON.stringify(el.note) === JSON.stringify(item.note)
          );
          console.log(foundItem)
          foundItem !== undefined ? foundItem.quantity += 1 : acc.push({ ...item, quantity: 1, name: name.name });
          return await acc;
        }, Promise.resolve([]));
        return groupedFoodOrdered;
      }
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
