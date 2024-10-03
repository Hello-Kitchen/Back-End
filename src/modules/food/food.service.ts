import { Injectable } from '@nestjs/common';
import mongoose from 'mongoose';
import { UpdateResult, ReturnDocument } from 'mongodb';
import { DB } from 'src/db/db';
import { Restaurant } from 'src/shared/interfaces/restaurant.interface';
import { Counter } from 'src/shared/interfaces/counter.interface';

@Injectable()
export class FoodService extends DB {
  
  async findAll(idRestaurant: number): Promise<mongoose.mongo.WithId<mongoose.AnyObject>> {
    const db = this.getDbConnection();

    return db.collection('restaurant').findOne({ id: idRestaurant }, { projection: { _id: 0, foods: 1 } });
  }

  async findById(idRestaurant: number, id: number): Promise<mongoose.mongo.WithId<mongoose.AnyObject>> {
    const db = this.getDbConnection();

    return db.collection('restaurant').findOne({ id: idRestaurant }, { projection: { _id: 0, foods: { $elemMatch: { id: id }  } } });
  }

  async createOne(idRestaurant: number, body: ReadableStream<Uint8Array>): Promise<UpdateResult> {
    const db = this.getDbConnection();
    const id = await db.collection<Counter>('counter').findOneAndUpdate({ _id: 'foodId' }, { $inc: { sequence_value: 1 } }, { returnDocument: ReturnDocument.AFTER });

    body['id'] = id.sequence_value;
    return db.collection('restaurant').updateOne({ id: idRestaurant }, { $addToSet: { foods: body } });
  }

  async updateOne(idRestaurant: number, id: number, body: ReadableStream<Uint8Array>): Promise<UpdateResult> {
    const db = this.getDbConnection();

    return db.collection('restaurant').updateOne({ id: idRestaurant, "foods.id": id }, { $set: { "foods.$.name": body['name'], "foods.$.price": body['price'], "foods.$.id_restaurant": body['id_restaurant'], "foods.$.id_category": body['id_category'], "foods.$.details": body['details'], "foods.$.foods": body['foods'] } });
  }

  async deleteOne(idRestaurant: number, id: number): Promise<UpdateResult> {
    const db = this.getDbConnection();

    return db.collection<Restaurant>('restaurant').updateOne({ id: idRestaurant }, { $pull: { foods: { id: id } } });
  }

}
