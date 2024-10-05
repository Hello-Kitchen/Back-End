import { Injectable } from '@nestjs/common';
import mongoose from 'mongoose';
import { UpdateResult, ReturnDocument } from 'mongodb';
import { DB } from 'src/db/db';
import { Restaurant } from 'src/shared/interfaces/restaurant.interface';
import { Counter } from 'src/shared/interfaces/counter.interface';

@Injectable()
export class IngredientService extends DB {
  async findAll(
    idRestaurant: number,
  ): Promise<mongoose.mongo.WithId<mongoose.AnyObject>> {
    const db = this.getDbConnection();

    return db
      .collection('restaurant')
      .findOne(
        { id: idRestaurant },
        { projection: { _id: 0, ingredients: 1 } },
      );
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
        { projection: { _id: 0, ingredients: { $elemMatch: { id: id } } } },
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
        { _id: 'ingredientId' },
        { $inc: { sequence_value: 1 } },
        { returnDocument: ReturnDocument.AFTER },
      );

    body['id'] = id.sequence_value;
    return db
      .collection('restaurant')
      .updateOne({ id: idRestaurant }, { $addToSet: { ingredients: body } });
  }

  async updateOne(
    idRestaurant: number,
    id: number,
    body: ReadableStream<Uint8Array>,
  ): Promise<UpdateResult> {
    const db = this.getDbConnection();

    return db.collection('restaurant').updateOne(
      { id: idRestaurant, 'ingredients.id': id },
      {
        $set: {
          'ingredients.$.name': body['name'],
          'ingredients.$.price': body['price'],
          'ingredients.$.id_restaurant': body['id_restaurant'],
        },
      },
    );
  }

  async deleteOne(idRestaurant: number, id: number): Promise<UpdateResult> {
    const db = this.getDbConnection();

    return db
      .collection<Restaurant>('restaurant')
      .updateOne({ id: idRestaurant }, { $pull: { ingredients: { id: id } } });
  }
}