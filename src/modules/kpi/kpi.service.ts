import { Injectable, NotFoundException } from '@nestjs/common';
import mongoose, { AnyObject } from 'mongoose';
import { UpdateResult, ReturnDocument, WithId } from 'mongodb';
import { DB } from '../../db/db';

@Injectable()
export class KpiService extends DB {

  async averageDishTime(idRestaurant: number, timeBegin: string, timeEnd: string, food: number) {
    const db = this.getDbConnection();
    const beginDate = new Date(timeBegin);
    const endDate = new Date(timeEnd);

    const result = await db.collection('restaurant').aggregate([
      { $match: { id: idRestaurant } },
      { $unwind: "$orders" },
      { $match: { 
        "orders.food_ordered.food": food
      }},
      { $project: { "orders.date": 1, "orders.food_ordered": 1, _id: 0 } }
    ]).toArray();

    const filteredResult = result.filter(item => {
      const orderDate = new Date(item.orders.date);
      return orderDate >= beginDate && orderDate <= endDate;
    });
    
    return filteredResult;
  }
}
