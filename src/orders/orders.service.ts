import { Injectable } from '@nestjs/common';
import mongoose from 'mongoose';
import { UpdateResult } from 'mongodb';
import { DB } from 'src/db/db';

@Injectable()
export class OrdersService extends DB {
  
  async findAll(): Promise<mongoose.mongo.WithId<mongoose.AnyObject>[]> {
    const db = this.getDbConnection();

    return db.collection('order').find({}).toArray();
  }

  async findAllSortedByDate() {
    const db = this.getDbConnection();

    return await db.collection('order').find({}).sort({ date: 1 }).toArray();
  }

  async findFoodOrderedsById(foodOrderedIds: number[], part: string) {
    const db = this.getDbConnection();

    return await db.collection('food_ordered').find({ id: { $in: foodOrderedIds }, part: part }).toArray();
  }

  async findById(id: number): Promise<mongoose.mongo.WithId<mongoose.AnyObject>> {
    const db = this.getDbConnection();

    return db.collection('order').findOne({ id: id });
  }

  async createOne(body: ReadableStream<Uint8Array>): Promise<mongoose.mongo.InsertOneResult<mongoose.AnyObject>> {
    const db = this.getDbConnection();
    
    return db.collection('order').insertOne(body);
  }

  async updateOne(id: number, body: ReadableStream<Uint8Array>): Promise<UpdateResult> {
    const db = this.getDbConnection();

    return db.collection('order').updateOne({ id: id }, { $set: body }); 
  }

  async deleteOne(id: number): Promise<mongoose.mongo.DeleteResult> {
    const db = this.getDbConnection();

    return db.collection('order').deleteOne({ id: id })
  }

}
