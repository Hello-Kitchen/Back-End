import { Injectable } from '@nestjs/common';
import mongoose from 'mongoose';
import { UpdateResult, ReturnDocument } from 'mongodb';
import { DB } from 'src/db/db';
import { equal } from 'assert';
import { Counter } from 'src/shared/interfaces/counter.interface';
import { Restaurant } from 'src/shared/interfaces/restaurant.interface';


@Injectable()
export class OrdersService extends DB {
  async findAll(idRestaurant: number): Promise<mongoose.mongo.BSON.Document> {
    const db = this.getDbConnection();

    let result = await db.collection('restaurant').aggregate([
      { $match: { id: idRestaurant } },
      { $project: { orders: 1 } },
      { $unwind: "$orders" },
      { $group: { _id: "$_id", orders: { $push: "$orders" } } }
    ]).toArray();
    return result[0].orders;
  }

  async findAllSortedByDate(idRestaurant: number): Promise<mongoose.mongo.BSON.Document> {
    const db = this.getDbConnection();

    let result = await db.collection('restaurant').aggregate([
      { $match: { id: idRestaurant } },
      { $project: { orders: 1 } },
      { $unwind: "$orders" },
      { $sort: { "orders.date": -1 } },
      { $group: { _id: "$_id", orders: { $push: "$orders" } } }
    ]).toArray();
    return result[0].orders;
  }

  async findReady(idRestaurant: number) {
    const db = this.getDbConnection();
    let result = await db.collection('restaurant').aggregate([
      { $match: { id: idRestaurant } },
      { $project: { orders: 1 } },
      { $unwind: "$orders" },
      { $group: { _id: "$_id", orders: { $push: "$orders" } } }
    ]).toArray();
    const filteredOrders = result[0].orders.filter(order => {
      const orderPart = order.part;
      const allReady = order.food_ordered
        .filter(food => food.part === orderPart)
        .every(food => food.is_ready === true);

      return allReady;
    });
    return filteredOrders;
  }

  async findReadySortedByDate(idRestaurant: number) {
    const db = this.getDbConnection();
    let result = await db.collection('restaurant').aggregate([
      { $match: { id: idRestaurant } },
      { $project: { orders: 1 } },
      { $unwind: "$orders" },
      { $sort: { "orders.date": -1 } },
      { $group: { _id: "$_id", orders: { $push: "$orders" } } }
    ]).toArray();
    const filteredOrders = result[0].orders.filter(order => {
      const orderPart = order.part;
      const allReady = order.food_ordered
        .filter(food => food.part === orderPart)
        .every(food => food.is_ready === true);

      return allReady;
    });
    return filteredOrders;
  }

  async findPending(idRestaurant: number) {
    const db = this.getDbConnection();
    let result = await db.collection('restaurant').aggregate([
      { $match: { id: idRestaurant } },
      { $project: { orders: 1 } },
      { $unwind: "$orders" },
      { $group: { _id: "$_id", orders: { $push: "$orders" } } }
    ]).toArray();
    const filteredOrders = result[0].orders.filter(order => {
      const orderPart = order.part;
      const relevantFoods = order.food_ordered.filter(food => food.part === orderPart);
      const readyCount = relevantFoods.filter(food => food.is_ready).length;

      return readyCount > 0 && readyCount < relevantFoods.length;
    });
    return filteredOrders;
  }

  async findPendingSortedByDate(idRestaurant: number) {
    const db = this.getDbConnection();
    let result = await db.collection('restaurant').aggregate([
      { $match: { id: idRestaurant } },
      { $project: { orders: 1 } },
      { $unwind: "$orders" },
      { $sort: { "orders.date": -1 } },
      { $group: { _id: "$_id", orders: { $push: "$orders" } } }
    ]).toArray();
    const filteredOrders = result[0].orders.filter(order => {
      const orderPart = order.part;
      const relevantFoods = order.food_ordered.filter(food => food.part === orderPart);
      const readyCount = relevantFoods.filter(food => food.is_ready).length;

      return readyCount > 0 && readyCount < relevantFoods.length;
    });

    return filteredOrders;
  }

  async findById(
    idRestaurant: number,
    id: number,
  ): Promise<mongoose.mongo.WithId<mongoose.AnyObject>> {
    const db = this.getDbConnection();

    return db
      .collection('restaurant')
      .findOne(
        { id: idRestaurant },
        { projection: { _id: 0, orders: { $elemMatch: { id: id } } } },
      );
  }

  async findByIdWithParam(
    idRestaurant: number,
    id: number,
  ): Promise<mongoose.mongo.BSON.Document[]> {
    const db = this.getDbConnection();

    return db.collection('restaurant').aggregate([
      {
        $match: { id: idRestaurant }
      },
      {
        $match: { "orders.id": id }
      },
      {
        $unwind: "$orders"
      },
      {
        $match: { "orders.id": id }
      },
      {
        $unwind: "$orders.food_ordered"
      },
      {
        $match: {
          $expr: {
            $eq: ["$orders.food_ordered.part", "$orders.part"]
          }
        }
      },
      {
        $group: {
          _id: "$_id",
          food_ordered: {
            $push: {
              food: "$orders.food_ordered.food",
              details: "$orders.food_ordered.details",
              mods_ingredients: "$orders.food_ordered.mods_ingredients",
              is_ready: "$orders.food_ordered.is_ready",
              note: "$orders.food_ordered.note"
            }
          }
        }
      }
    ]).toArray()
  }

  async findFoodByIdsWithParam(idRestaurant: number, id: number[]) {
    const db = this.getDbConnection();

    return db
      .collection('restaurant')
      .findOne(
        { id: idRestaurant },
        {
          projection: {
            _id: 0,
            foods: {
              $elemMatch: { id: id }
            }
          }
        }
      );
  }

  async createOne(
    idRestaurant: number,
    body: ReadableStream<Uint8Array>,
  ): Promise<UpdateResult> {
    const db = this.getDbConnection();
    const id = await db
      .collection<Counter>('counter')
      .findOneAndUpdate(
        { _id: 'orderId' },
        { $inc: { sequence_value: 1 } },
        { returnDocument: ReturnDocument.AFTER },
      );

    body['id'] = id.sequence_value;
    for (const food of body['food_ordered']) {
      const id = await db.collection<Counter>('counter').findOneAndUpdate(
        { _id: 'foodOrderId' }, 
        { $inc: { sequence_value: 1 } }, 
        { returnDocument: ReturnDocument.AFTER }
      );
    
      food.id = id.sequence_value;
    }
    return db
      .collection('restaurant')
      .updateOne({ id: idRestaurant }, { $addToSet: { orders: body } });
  }

  async updateOne(
    idRestaurant: number,
    id: number,
    body: ReadableStream<Uint8Array>,
  ): Promise<UpdateResult> {
    const db = this.getDbConnection();

    return db.collection('restaurant').updateOne(
      { id: idRestaurant, 'orders.id': id },
      {
        $set: {
          'orders.$.channel': body['channel'],
          'orders.$.number': body['number'],
          'orders.$.food_ordered': body['food_ordered'],
          'orders.$.part': body['part'],
          'orders.$.date': body['date'],
        },
      },
    );
  }

  async deleteOne(idRestaurant: number, id: number): Promise<UpdateResult> {
    const db = this.getDbConnection();

    return db
      .collection<Restaurant>('restaurant')
      .updateOne({ id: idRestaurant }, { $pull: { orders: { id: id } } });
  }

  async markFoodOrderedReady(idRestaurant: number, idFoodOrdered: number) {
    const db = this.getDbConnection();
    const res = await db.collection('restaurant').findOne({ id: idRestaurant }, { projection: { _id: 0, orders: 1 } });
    let value: boolean;

    for(const order of res.orders) {
      for(const food of order.food_ordered) {
        if (food.id === idFoodOrdered)
          value = !food.is_ready;
      }
    }

    return await db.collection('restaurant').findOneAndUpdate(
      {
        id: idRestaurant,
        'orders.food_ordered.id': idFoodOrdered
      },
      {
        $set: { 'orders.$[].food_ordered.$[food].is_ready': value }
      },
      {
        arrayFilters: [{ 'food.id': idFoodOrdered }]
      }
    );
  }
}
