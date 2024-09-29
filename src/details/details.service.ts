import { Injectable } from '@nestjs/common';
import mongoose from 'mongoose';
import { UpdateResult } from 'mongodb';
import { DB } from 'src/db/db';

@Injectable()
export class DetailsService extends DB {
  
  async findAll(): Promise<mongoose.mongo.WithId<mongoose.AnyObject>[]> {
    const db = this.getDbConnection();

    return db.collection('restaurant').find({}).toArray();
  }

  async findById(id: number): Promise<mongoose.mongo.WithId<mongoose.AnyObject>> {
    const db = this.getDbConnection();

    return db.collection('restaurant').findOne({ id: id });
  }

  async createOne(body: ReadableStream<Uint8Array>): Promise<mongoose.mongo.InsertOneResult<mongoose.AnyObject>> {
    const db = this.getDbConnection();
    
    return db.collection('restaurant').insertOne(body);
  }

  async updateOne(id: number, body: ReadableStream<Uint8Array>): Promise<UpdateResult> {
    const db = this.getDbConnection();

    return db.collection('restaurant').updateOne({ id: id }, { $set: body }); 
  }

  async deleteOne(id: number): Promise<mongoose.mongo.DeleteResult> {
    const db = this.getDbConnection();

    return db.collection('restaurant').deleteOne({ id: id })
  }

}
