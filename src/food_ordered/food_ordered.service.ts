import { Injectable } from '@nestjs/common';
import mongoose from 'mongoose';
import { UpdateResult, ObjectId } from 'mongodb';
import { DB } from 'src/db/db';

@Injectable()
export class FoodOrderedService extends DB {
  async findAll(): Promise<mongoose.mongo.WithId<mongoose.AnyObject>[]> {
    const db = this.getDbConnection();

    return db.collection('food_ordered').find({}).toArray();
  }

  async findById(id: number): Promise<mongoose.mongo.WithId<mongoose.AnyObject>> {
    const db = this.getDbConnection();

    return db.collection('food_ordered').findOne({ id: id });
  }

  async createOne(body: ReadableStream<Uint8Array>): Promise<mongoose.mongo.InsertOneResult<mongoose.AnyObject>> {
    const db = this.getDbConnection();
    const userId = 'foodOrderId' as unknown as ObjectId;

    const id = await db.collection('counter').findOneAndUpdate({ _id: userId }, { $inc: { sequence_value: 1 } }, { returnDocument: 'after' });
    return db.collection('food_ordered').insertOne({...body, id: id.sequence_value, is_ready: false});
  }

  async updateOne(id: number, body: ReadableStream<Uint8Array>): Promise<UpdateResult> {
    const db = this.getDbConnection();

    return db.collection('food_ordered').updateOne({ id: id }, { $set: body }); 
  }

  async deleteOne(id: number): Promise<mongoose.mongo.DeleteResult> {
    const db = this.getDbConnection();

    return db.collection('food_ordered').deleteOne({ id: id })
  }

  async updateMany(id: number, food: mongoose.mongo.WithId<mongoose.AnyObject>) {
    const db = this.getDbConnection();
    return await db.collection('food_ordered').updateMany({ id: id }, { $set: food });
  }
}
