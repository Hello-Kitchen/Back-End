import { Injectable } from '@nestjs/common';
import mongoose from 'mongoose';
import { UpdateResult, ReturnDocument } from 'mongodb';
import { DB } from '../../db/db';
import { Restaurant } from '../../shared/interfaces/restaurant.interface';
import { Counter } from '../../shared/interfaces/counter.interface';

@Injectable()
export class PermissionService extends DB {
  /**
   * Retrieves all permission for a specified restaurant.
   *
   * @param {number} idRestaurant - The ID of the restaurant.
   * @returns {Promise<mongoose.mongo.WithId<mongoose.AnyObject>>}
   *          A promise that resolves to the restaurant permission.
   * @async
   */
  async findAll(
    idRestaurant: number,
  ): Promise<mongoose.mongo.WithId<mongoose.AnyObject>> {
    const db = this.getDbConnection();

    return db
      .collection('restaurant')
      .findOne({ id: idRestaurant }, { projection: { _id: 0, permission: 1 } });
  }

  /**
   * Retrieves a specific permission by its ID for a specified restaurant.
   *
   * @param {number} idRestaurant - The ID of the restaurant.
   * @param {number} id - The ID of the permission to retrieve.
   * @returns {Promise<mongoose.mongo.WithId<mongoose.AnyObject>>}
   *          A promise that resolves to the specific permission.
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
        { projection: { _id: 0, permission: { $elemMatch: { id: id } } } },
      );
  }

  /**
   * Creates a new permission for a specified restaurant.
   *
   * @param {number} idRestaurant - The ID of the restaurant.
   * @param {ReadableStream<Uint8Array>} body - The permission data to be created.
   * @returns {Promise<UpdateResult>}
   *          A promise that resolves to the result of the update operation.
   * @async
   */
  async createOne(
    idRestaurant: number,
    body: ReadableStream<Uint8Array>,
  ): Promise<UpdateResult> {
    const db = this.getDbConnection();
    const id = await db
      .collection<Counter>('counter')
      .findOneAndUpdate(
        { _id: 'permissionId' },
        { $inc: { sequence_value: 1 } },
        { returnDocument: ReturnDocument.AFTER },
      );

    body['id'] = id.sequence_value; // Assign a new ID to the body.
    return db
      .collection('restaurant')
      .updateOne({ id: idRestaurant }, { $addToSet: { permission: body } });
  }

  /**
   * Updates an existing permission for a specified restaurant.
   *
   * @param {number} idRestaurant - The ID of the restaurant.
   * @param {number} id - The ID of the permission to update.
   * @param {ReadableStream<Uint8Array>} body - The updated permission data.
   * @returns {Promise<UpdateResult>}
   *          A promise that resolves to the result of the update operation.
   * @async
   */
  async updateOne(
    idRestaurant: number,
    id: number,
    body: ReadableStream<Uint8Array>,
  ): Promise<UpdateResult> {
    const db = this.getDbConnection();

    return db.collection('restaurant').updateOne(
      { id: idRestaurant, 'permission.id': id },
      {
        $set: { body },
      },
    );
  }

  /**
   * Deletes a specific permission for a specified restaurant.
   *
   * @param {number} idRestaurant - The ID of the restaurant.
   * @param {number} id - The ID of the permission to delete.
   * @returns {Promise<UpdateResult>}
   *          A promise that resolves to the result of the update operation.
   * @async
   */
  async deleteOne(idRestaurant: number, id: number): Promise<UpdateResult> {
    const db = this.getDbConnection();

    return db
      .collection<Restaurant>('restaurant')
      .updateOne({ id: idRestaurant }, { $pull: { permission: { id: id } } });
  }
}
