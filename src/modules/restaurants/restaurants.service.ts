import { Injectable } from '@nestjs/common';
import mongoose from 'mongoose';
import { UpdateResult, DeleteResult } from 'mongodb';
import { DB } from 'src/db/db';

@Injectable()
export class RestaurantsService extends DB {
  /**
   * Fetches all restaurants from the database.
   *
   * @returns {Promise<mongoose.mongo.WithId<mongoose.AnyObject>[]>} An array of restaurants.
   */
  async findAll(): Promise<mongoose.mongo.WithId<mongoose.AnyObject>[]> {
    const db = this.getDbConnection();
    return db.collection('restaurant').find({}).toArray();
  }

  /**
   * Fetches a restaurant by its ID.
   *
   * @param {number} id - The ID of the restaurant.
   * @returns {Promise<mongoose.mongo.WithId<mongoose.AnyObject>>} The restaurant if found.
   */
  async findById(id: number): Promise<mongoose.mongo.WithId<mongoose.AnyObject>> {
    const db = this.getDbConnection();
    return db.collection('restaurant').findOne({ id });
  }

  /**
   * Creates a new restaurant in the database.
   *
   * @param {mongoose.AnyObject} body - The restaurant data to be inserted.
   * @returns {Promise<mongoose.mongo.InsertOneResult<mongoose.AnyObject>>} The result of the insert operation.
   */
  async createOne(
    body: mongoose.AnyObject, // Changed from ReadableStream<Uint8Array> to the correct type
  ): Promise<mongoose.mongo.InsertOneResult<mongoose.AnyObject>> {
    const db = this.getDbConnection();
    return db.collection('restaurant').insertOne(body);
  }

  /**
   * Updates a restaurant by its ID.
   *
   * @param {number} id - The ID of the restaurant to update.
   * @param {mongoose.AnyObject} body - The updated restaurant data.
   * @returns {Promise<UpdateResult>} The result of the update operation.
   */
  async updateOne(
    id: number,
    body: mongoose.AnyObject, // Changed from ReadableStream<Uint8Array> to the correct type
  ): Promise<UpdateResult> {
    const db = this.getDbConnection();
    return db.collection('restaurant').updateOne({ id }, { $set: body });
  }

  /**
   * Deletes a restaurant by its ID.
   *
   * @param {number} id - The ID of the restaurant to delete.
   * @returns {Promise<DeleteResult>} The result of the delete operation.
   */
  async deleteOne(id: number): Promise<DeleteResult> {
    const db = this.getDbConnection();
    return db.collection('restaurant').deleteOne({ id });
  }
}
