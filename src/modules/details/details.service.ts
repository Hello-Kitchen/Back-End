import { Injectable } from '@nestjs/common';
import mongoose from 'mongoose';
import { UpdateResult, ReturnDocument } from 'mongodb';
import { DB } from 'src/db/db';
import { Restaurant } from 'src/shared/interfaces/restaurant.interface';
import { Counter } from 'src/shared/interfaces/counter.interface';

@Injectable()
export class DetailsService extends DB {
  async findAll(
    idRestaurant: number,
  ): Promise<mongoose.mongo.WithId<mongoose.AnyObject>> {
    const db = this.getDbConnection();

    return db
      .collection('restaurant')
      .findOne({ id: idRestaurant }, { projection: { _id: 0, details: 1 } });
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
        { projection: { _id: 0, details: { $elemMatch: { id: id } } } },
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
        { _id: 'detailId' },
        { $inc: { sequence_value: 1 } },
        { returnDocument: ReturnDocument.AFTER },
      );

    body['id'] = id.sequence_value;
    return db
      .collection('restaurant')
      .updateOne({ id: idRestaurant }, { $addToSet: { details: body } });
  }

  async updateOne(
    idRestaurant: number,
    id: number,
    body: ReadableStream<Uint8Array>,
  ): Promise<UpdateResult> {
    const db = this.getDbConnection();

    return db.collection('restaurant').updateOne(
      { id: idRestaurant, 'details.id': id },
      {
        $set: {
          'details.$.name': body['name'],
          'details.$.multiple': body['multiple'],
          'details.$.id_restaurant': body['id_restaurant'],
          'details.$.data': body['data'],
        },
      },
    );
  }

  async deleteOne(idRestaurant: number, id: number): Promise<UpdateResult> {
    const db = this.getDbConnection();

    return db
      .collection<Restaurant>('restaurant')
      .updateOne({ id: idRestaurant }, { $pull: { details: { id: id } } });
  }
}
