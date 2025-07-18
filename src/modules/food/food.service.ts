import { Injectable } from '@nestjs/common';
import mongoose from 'mongoose';
import { UpdateResult, ReturnDocument } from 'mongodb';
import { DB } from '../../db/db';
import { Restaurant } from '../../shared/interfaces/restaurant.interface';
import { Counter } from '../../shared/interfaces/counter.interface';
import { FoodDto } from './DTO/food.dto';

/**
 * Service for managing food items in a restaurant.
 *
 * The `FoodService` class extends the `DB` class and provides methods to
 * interact with the food items associated with a specific restaurant. This
 * includes operations such as finding all food items, finding a specific
 * food item by ID, creating a new food item, updating an existing food
 * item, and deleting a food item.
 *
 * @extends DB
 */
@Injectable()
export class FoodService extends DB {
  /**
   * Retrieves all food items for a specific restaurant.
   *
   * @param {number} idRestaurant - The ID of the restaurant.
   * @returns {Promise<mongoose.mongo.WithId<mongoose.AnyObject>>}
   *          A promise that resolves to the foods associated with the restaurant.
   * @async
   */
  async findAll(
    idRestaurant: number,
  ): Promise<mongoose.mongo.WithId<mongoose.AnyObject>> {
    const db = this.getDbConnection();

    return db
      .collection('restaurant')
      .findOne({ id: idRestaurant }, { projection: { _id: 0, foods: 1 } });
  }

  /**
   * Retrieves a specific food item by its ID for a given restaurant.
   *
   * @param {number} idRestaurant - The ID of the restaurant.
   * @param {number} id - The ID of the food item.
   * @returns {Promise<mongoose.mongo.WithId<mongoose.AnyObject>>}
   *          A promise that resolves to the food item.
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
        { projection: { _id: 0, foods: { $elemMatch: { id: id } } } },
      );
  }

  /**
   * Retrieves a specific food item by its ID for a given restaurant and found each ingredient et details into array associated.
   *
   * @param {number} idRestaurant - The ID of the restaurant.
   * @param {number} id - The ID of the food item.
   * @returns {Promise<mongoose.mongo.BSON.Document[]>}
   *          A promise that resolves to the food item.
   * @async
   */
  async findByIdWithParam(
    idRestaurant: number,
    id: number,
  ): Promise<mongoose.mongo.BSON.Document[]> {
    const db = this.getDbConnection();

    return db
      .collection('restaurant')
      .aggregate([
        { $match: { id: idRestaurant } },
        { $unwind: '$foods' },
        { $match: { 'foods.id': id } },
        {
          $project: {
            _id: 0,
            food: {
              id: '$foods.id',
              name: '$foods.name',
              price: '$foods.price',
              id_restaurant: '$foods.id_restaurant',
              id_category: '$foods.id_category',
              details: {
                $map: {
                  input: '$foods.details',
                  as: 'detailId',
                  in: {
                    $arrayElemAt: ['$details', '$$detailId'],
                  },
                },
              },
              ingredients: {
                $map: {
                  input: '$foods.ingredients',
                  as: 'ingredient',
                  in: {
                    id_ingredient: '$$ingredient.id_ingredient',
                    quantity: '$$ingredient.quantity',
                    suppPrice: '$$ingredient.suppPrice',
                    name: {
                      $arrayElemAt: [
                        '$ingredients.name',
                        '$$ingredient.id_ingredient',
                      ],
                    },
                  },
                },
              },
            },
          },
        },
      ])
      .toArray();
  }

  /**
   * Creates a new food item for a specific restaurant.
   *
   * @param {number} idRestaurant - The ID of the restaurant.
   * @param {FoodDto} body - The details of the food item to create.
   * @returns {Promise<UpdateResult>}
   *          A promise that resolves to the result of the update operation.
   * @async
   */
  async createOne(idRestaurant: number, body: FoodDto): Promise<UpdateResult> {
    const db = this.getDbConnection();
    const id = await db.collection<Counter>('counter').findOneAndUpdate(
      { _id: 'foodId' }, // Query to find the counter for food IDs
      { $inc: { sequence_value: 1 } }, // Increment the sequence value for the next ID
      { returnDocument: ReturnDocument.AFTER }, // Return the updated document
    );

    body['id'] = id.sequence_value; // Assign the new ID to the food item
    return db
      .collection('restaurant')
      .updateOne({ id: idRestaurant }, { $addToSet: { foods: body } }); // Add the food item to the restaurant's foods array
  }

  /**
   * Updates an existing food item for a specific restaurant.
   *
   * @param {number} idRestaurant - The ID of the restaurant.
   * @param {number} id - The ID of the food item to update.
   * @param {FoodDto} body - The updated details of the food item.
   * @returns {Promise<UpdateResult>}
   *          A promise that resolves to the result of the update operation.
   * @async
   */
  async updateOne(
    idRestaurant: number,
    id: number,
    body: FoodDto,
  ): Promise<UpdateResult> {
    const db = this.getDbConnection();

    return db.collection('restaurant').updateOne(
      { id: idRestaurant, 'foods.id': id }, // Find the specific restaurant and food item
      {
        $set: {
          'foods.$.name': body['name'], // Update the name of the food item
          'foods.$.price': body['price'], // Update the price of the food item
          'foods.$.id_category': body['id_category'], // Update the category ID
          'foods.$.details': body['details'], // Update the details of the food item
          'foods.$.ingredients': body['ingredients'], // Update the ingredients of the food item
        },
      },
    );
  }

  /**
   * Deletes a food item for a specific restaurant.
   *
   * @param {number} idRestaurant - The ID of the restaurant.
   * @param {number} id - The ID of the food item to delete.
   * @returns {Promise<UpdateResult>}
   *          A promise that resolves to the result of the delete operation.
   * @async
   */
  async deleteOne(idRestaurant: number, id: number): Promise<UpdateResult> {
    const db = this.getDbConnection();

    return db
      .collection<Restaurant>('restaurant')
      .updateOne({ id: idRestaurant }, { $pull: { foods: { id: id } } }); // Remove the food item from the restaurant's foods array
  }
}
