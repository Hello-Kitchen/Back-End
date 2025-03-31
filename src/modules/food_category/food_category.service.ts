import { Injectable } from '@nestjs/common';
import mongoose from 'mongoose';
import { UpdateResult, ReturnDocument } from 'mongodb';
import { DB } from '../../db/db';
import { Restaurant } from '../../shared/interfaces/restaurant.interface';
import { Counter } from '../../shared/interfaces/counter.interface';
import { FoodCategoryDto } from './DTO/food_category.dto';

/**
 * Service for managing food categories within a restaurant.
 *
 * The `FoodCategoryService` class provides methods for CRUD operations
 * related to food categories in the restaurant database.
 */
@Injectable()
export class FoodCategoryService extends DB {
  /**
   * Retrieves all food categories for a specific restaurant.
   *
   * @param {number} idRestaurant - The ID of the restaurant.
   * @returns {Promise<mongoose.mongo.WithId<mongoose.AnyObject>>} The food categories.
   */
  async findAll(
    idRestaurant: number,
  ): Promise<mongoose.mongo.WithId<mongoose.AnyObject>> {
    const db = this.getDbConnection();

    return db
      .collection('restaurant')
      .findOne(
        { id: idRestaurant },
        { projection: { _id: 0, food_category: 1 } },
      );
  }

  /**
   * Retrieves a specific food category by its ID for a given restaurant.
   *
   * @param {number} idRestaurant - The ID of the restaurant.
   * @param {number} id - The ID of the food category.
   * @returns {Promise<mongoose.mongo.WithId<mongoose.AnyObject>>} The food category.
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
        { projection: { _id: 0, food_category: { $elemMatch: { id: id } } } },
      );
  }

  /**
   * Creates a new food category for a specific restaurant.
   *
   * @param {number} idRestaurant - The ID of the restaurant.
   * @param {FoodCategoryDto} body - The food category data.
   * @returns {Promise<UpdateResult>} The result of the update operation.
   */
  async createOne(
    idRestaurant: number,
    body: FoodCategoryDto, // You may consider using a more specific type instead of ReadableStream
  ): Promise<UpdateResult> {
    const db = this.getDbConnection();

    // Increment the food category ID counter
    const idCounter = await db
      .collection<Counter>('counter')
      .findOneAndUpdate(
        { _id: 'foodCategoryId' },
        { $inc: { sequence_value: 1 } },
        { returnDocument: ReturnDocument.AFTER },
      );

    // Ensure the id exists
    if (!idCounter) {
      throw new Error('Counter not found');
    }

    // Assign the new ID to the food category
    const foodCategoryId = idCounter.sequence_value;
    body['id'] = foodCategoryId;

    // Insert the new food category into the restaurant document
    return db
      .collection('restaurant')
      .updateOne({ id: idRestaurant }, { $addToSet: { food_category: body } });
  }

  /**
   * Updates an existing food category for a specific restaurant.
   *
   * @param {number} idRestaurant - The ID of the restaurant.
   * @param {number} id - The ID of the food category to update.
   * @param {FoodCategoryDto} body - The updated food category data.
   * @returns {Promise<UpdateResult>} The result of the update operation.
   */
  async updateOne(
    idRestaurant: number,
    id: number,
    body: FoodCategoryDto, // Consider using a more specific type here as well
  ): Promise<UpdateResult> {
    const db = this.getDbConnection();

    return db.collection('restaurant').updateOne(
      { id: idRestaurant, 'food_category.id': id },
      {
        $set: {
          'food_category.$.name': body['name'],
        },
      },
    );
  }

  /**
   * Deletes a food category for a specific restaurant.
   *
   * @param {number} idRestaurant - The ID of the restaurant.
   * @param {number} id - The ID of the food category to delete.
   * @returns {Promise<UpdateResult>} The result of the update operation.
   */
  async deleteOne(idRestaurant: number, id: number): Promise<UpdateResult> {
    const db = this.getDbConnection();

    return db
      .collection<Restaurant>('restaurant')
      .updateOne(
        { id: idRestaurant },
        { $pull: { food_category: { id: id } } },
      );
  }
}
