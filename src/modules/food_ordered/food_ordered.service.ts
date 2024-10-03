import { Injectable } from '@nestjs/common';
import mongoose, { AnyObject } from 'mongoose';
import { UpdateResult, ReturnDocument, WithId } from 'mongodb';
import { DB } from 'src/db/db';
import { Order } from 'src/shared/interfaces/order.interface';
import { Counter } from 'src/shared/interfaces/counter.interface';

@Injectable()
export class FoodOrderedService extends DB {
  async findAll(
    idOrder: number,
  ): Promise<mongoose.mongo.WithId<mongoose.AnyObject>> {
    const db = this.getDbConnection();

    return db
      .collection('order')
      .findOne({ id: idOrder }, { projection: { _id: 0, food_ordered: 1 } });
  }

  async findById(
    idOrder: number,
    id: number,
  ): Promise<mongoose.mongo.WithId<mongoose.AnyObject>> {
    const db = this.getDbConnection();

    return db
      .collection('order')
      .findOne(
        { id: idOrder },
        { projection: { _id: 0, food_ordered: { $elemMatch: { id: id } } } },
      );
  }

  async createOne(
    idOrder: number,
    body: ReadableStream<Uint8Array>,
  ): Promise<UpdateResult> {
    const db = this.getDbConnection();
    const id = await db
      .collection<Counter>('counter')
      .findOneAndUpdate(
        { _id: 'foodOrderId' },
        { $inc: { sequence_value: 1 } },
        { returnDocument: ReturnDocument.AFTER },
      );

    body['id'] = id.sequence_value;
    return db
      .collection('order')
      .updateOne({ id: idOrder }, { $addToSet: { food_ordered: body } });
  }

  async updateOne(
    idOrder: number,
    id: number,
    body: ReadableStream<Uint8Array> | WithId<AnyObject>,
  ): Promise<UpdateResult> {
    const db = this.getDbConnection();

    return db.collection('order').updateOne(
      { id: idOrder, 'food_ordered.id': id },
      {
        $set: {
          'food_ordered.$.food': body['food'],
          'food_ordered.$.details': body['details'],
          'food_ordered.$.id_restaurant': body['id_restaurant'],
          'food_ordered.$.mods_ingredients': body['mods_ingredients'],
          'food_ordered.$.part': body['part'],
          'food_ordered.$.is_ready': body['is_ready'],
        },
      },
    );
  }

  async deleteOne(idOrder: number, id: number): Promise<UpdateResult> {
    const db = this.getDbConnection();

    return db
      .collection<Order>('order')
      .updateOne({ id: idOrder }, { $pull: { food_ordered: { id: id } } });
  }
}
