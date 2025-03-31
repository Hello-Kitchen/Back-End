import { Injectable } from '@nestjs/common';
import mongoose from 'mongoose';
import { UpdateResult, ReturnDocument } from 'mongodb';
import { DB } from '../../db/db';
import { Restaurant } from 'src/shared/interfaces/restaurant.interface';
import { Counter } from 'src/shared/interfaces/counter.interface';
import { DetailDto } from './DTO/detail.dto';

/**
 * Service for managing details associated with restaurants.
 *
 * The `DetailsService` class extends the `DB` class and provides methods to
 * interact with the restaurant details in the database. This includes
 * fetching, creating, updating, and deleting details.
 *
 * @extends DB
 */
@Injectable()
export class DetailsService extends DB {
  /**
   * Retrieves all details for a specified restaurant.
   *
   * @param {number} idRestaurant - The ID of the restaurant.
   * @returns {Promise<mongoose.mongo.WithId<mongoose.AnyObject>>}
   *          A promise that resolves to the restaurant details.
   * @async
   */
  async findAll(
    idRestaurant: number,
  ): Promise<mongoose.mongo.WithId<mongoose.AnyObject>> {
    const db = this.getDbConnection();

    return db
      .collection('restaurant')
      .findOne({ id: idRestaurant }, { projection: { _id: 0, details: 1 } });
  }

  /**
   * Retrieves a specific detail by its ID for a specified restaurant.
   *
   * @param {number} idRestaurant - The ID of the restaurant.
   * @param {number} id - The ID of the detail to retrieve.
   * @returns {Promise<mongoose.mongo.WithId<mongoose.AnyObject>>}
   *          A promise that resolves to the specific detail.
   * @async
   */
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

  /**
   * Creates a new detail for a specified restaurant.
   *
   * @param {number} idRestaurant - The ID of the restaurant.
   * @param {DetailDto} body - The detail data to be created.
   * @returns {Promise<UpdateResult>}
   *          A promise that resolves to the result of the update operation.
   * @async
   */
  async createOne(
    idRestaurant: number,
    body: DetailDto,
  ): Promise<UpdateResult> {
    const db = this.getDbConnection();
    const id = await db
      .collection<Counter>('counter')
      .findOneAndUpdate(
        { _id: 'detailId' },
        { $inc: { sequence_value: 1 } },
        { returnDocument: ReturnDocument.AFTER },
      );

    body['id'] = id.sequence_value; // Assign a new ID to the body.
    return db
      .collection('restaurant')
      .updateOne({ id: idRestaurant }, { $addToSet: { details: body } });
  }

  /**
   * Updates an existing detail for a specified restaurant.
   *
   * @param {number} idRestaurant - The ID of the restaurant.
   * @param {number} id - The ID of the detail to update.
   * @param {DetailDto} body - The updated detail data.
   * @returns {Promise<UpdateResult>}
   *          A promise that resolves to the result of the update operation.
   * @async
   */
  async updateOne(
    idRestaurant: number,
    id: number,
    body: DetailDto,
  ): Promise<UpdateResult> {
    const db = this.getDbConnection();

    return db.collection('restaurant').updateOne(
      { id: idRestaurant, 'details.id': id },
      {
        $set: {
          'details.$.name': body['name'], // Update the name of the detail.
          'details.$.multiple': body['multiple'], // Update the multiple field.
          'details.$.data': body['data'], // Update the detail data.
        },
      },
    );
  }

  /**
   * Deletes a specific detail for a specified restaurant.
   *
   * @param {number} idRestaurant - The ID of the restaurant.
   * @param {number} id - The ID of the detail to delete.
   * @returns {Promise<UpdateResult>}
   *          A promise that resolves to the result of the update operation.
   * @async
   */
  async deleteOne(idRestaurant: number, id: number): Promise<UpdateResult> {
    const db = this.getDbConnection();

    return db
      .collection<Restaurant>('restaurant')
      .updateOne({ id: idRestaurant }, { $pull: { details: { id: id } } });
  }
}
