import { Injectable } from '@nestjs/common';
import mongoose from 'mongoose';
import { UpdateResult, ReturnDocument } from 'mongodb';
import { DB } from 'src/db/db';
import { Restaurant } from 'src/shared/interfaces/restaurant.interface';
import { Counter } from 'src/shared/interfaces/counter.interface';
import { UsersDto } from './DTO/users.dto';

@Injectable()
export class UsersService extends DB {
  /**
   * Retrieves all users for a specific restaurant.
   *
   * @param {number} idRestaurant - The ID of the restaurant.
   * @returns {Promise<mongoose.mongo.WithId<mongoose.AnyObject>>} The restaurant document with users.
   */
  async findAll(idRestaurant: number): Promise<mongoose.mongo.WithId<mongoose.AnyObject>> {
    const db = this.getDbConnection();

    return db.collection('restaurant').findOne(
      { id: idRestaurant },
      { projection: { _id: 0, users: 1 } },
    );
  }

  /**
   * Retrieves a single user by their ID.
   *
   * @param {number} idRestaurant - The ID of the restaurant.
   * @param {number} id - The ID of the user.
   * @returns {Promise<mongoose.mongo.WithId<mongoose.AnyObject>>} The user object if found.
   */
  async findById(idRestaurant: number, id: number): Promise<mongoose.mongo.WithId<mongoose.AnyObject>> {
    const db = this.getDbConnection();

    const restaurant = await db.collection('restaurant').findOne(
      { id: idRestaurant },
      { projection: { _id: 0, users: { $elemMatch: { id: id } } } },
    );

    return restaurant?.users[0]; // Return the matched user object or undefined
  }

  /**
   * Retrieves a single user by their username.
   *
   * @param {number} idRestaurant - The ID of the restaurant.
   * @param {string} username - The username of the user.
   * @returns {Promise<mongoose.mongo.WithId<mongoose.AnyObject>>} The user object if found.
   */
  async findOne(idRestaurant: number, username: string): Promise<mongoose.mongo.WithId<mongoose.AnyObject>> {
    const db = this.getDbConnection();

    const restaurant = await db.collection('restaurant').findOne(
      { id: idRestaurant },
      { projection: { _id: 0, users: { $elemMatch: { username: username } } } },
    );

    return restaurant?.users[0]; // Return the matched user object or undefined
  }

  /**
   * Creates a new user for a specific restaurant.
   *
   * @param {number} idRestaurant - The ID of the restaurant.
   * @param {UsersDto} body - The user data.
   * @returns {Promise<UpdateResult>} The update result.
   */
  async createOne(idRestaurant: number, body: Record<string, any>): Promise<UpdateResult> {
    const db = this.getDbConnection();

    const counterDoc = await db.collection<Counter>('counter').findOneAndUpdate(
      { _id: 'userId' },
      { $inc: { sequence_value: 1 } },
      { returnDocument: ReturnDocument.AFTER },
    );

    if (!counterDoc) {
      throw new Error('Counter not found or updated');
    }

    body['id'] = counterDoc.sequence_value;

    return db.collection('restaurant').updateOne(
      { id: idRestaurant },
      { $addToSet: { users: body } },
    );
  }

  /**
   * Updates an existing user for a specific restaurant.
   *
   * @param {number} idRestaurant - The ID of the restaurant.
   * @param {number} id - The ID of the user.
   * @param {UsersDto} body - The updated user data.
   * @returns {Promise<UpdateResult>} The update result.
   */
  async updateOne(idRestaurant: number, id: number, body: Record<string, any>): Promise<UpdateResult> {
    const db = this.getDbConnection();

    return db.collection('restaurant').updateOne(
      { id: idRestaurant, 'users.id': id }, // Corrected the filter field
      {
        $set: {
          'users.$.username': body['username'],
          'users.$.password': body['password'],
        },
      },
    );
  }

  /**
   * Deletes a user for a specific restaurant.
   *
   * @param {number} idRestaurant - The ID of the restaurant.
   * @param {number} id - The ID of the user.
   * @returns {Promise<UpdateResult>} The update result.
   */
  async deleteOne(idRestaurant: number, id: number): Promise<UpdateResult> {
    const db = this.getDbConnection();

    return db.collection<Restaurant>('restaurant').updateOne(
      { id: idRestaurant },
      { $pull: { users: { id: id } } },
    );
  }
}
