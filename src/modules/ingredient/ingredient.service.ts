import { Injectable } from '@nestjs/common';
import mongoose from 'mongoose';
import { UpdateResult, ReturnDocument } from 'mongodb';
import { DB } from 'src/db/db';
import { Restaurant } from 'src/shared/interfaces/restaurant.interface';
import { Counter } from 'src/shared/interfaces/counter.interface';
import { IngredientDto } from './DTO/ingredient.dto';
import { Ingredient } from './interfaces/ingredient.interface';

/**
 * Service for managing ingredients within a restaurant.
 */
@Injectable()
export class IngredientService extends DB {
  /**
   * Retrieves all ingredients for a specific restaurant.
   * 
   * @param {number} idRestaurant - The ID of the restaurant.
   * @returns {Promise<mongoose.mongo.WithId<mongoose.AnyObject>>} The restaurant's ingredients.
   */
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

  /**
   * Retrieves a specific ingredient by its ID for a given restaurant.
   * 
   * @param {number} idRestaurant - The ID of the restaurant.
   * @param {number} id - The ID of the ingredient.
   * @returns {Promise<mongoose.mongo.WithId<mongoose.AnyObject>>} The ingredient.
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
        { projection: { _id: 0, ingredients: { $elemMatch: { id: id } } } },
      );
  }

  /**
   * Creates a new ingredient for a specific restaurant.
   * 
   * @param {number} idRestaurant - The ID of the restaurant.
   * @param {IngredientDto} body - The ingredient data to be added.
   * @returns {Promise<UpdateResult>} The result of the update operation.
   */
  async createOne(
    idRestaurant: number,
    body: IngredientDto, // Change type based on your actual body structure
  ): Promise<UpdateResult> {
    const db = this.getDbConnection();
    const id = await db
      .collection<Counter>('counter')
      .findOneAndUpdate(
        { _id: 'ingredientId' },
        { $inc: { sequence_value: 1 } },
        { returnDocument: ReturnDocument.AFTER },
      );

    body['id'] = id.sequence_value; // Assuming the body is mutable
    return db
      .collection('restaurant')
      .updateOne({ id: idRestaurant }, { $addToSet: { ingredients: body } });
  }

  /**
   * Updates an existing ingredient for a specific restaurant.
   * 
   * @param {number} idRestaurant - The ID of the restaurant.
   * @param {number} id - The ID of the ingredient to update.
   * @param {IngredientDto} body - The updated ingredient data.
   * @returns {Promise<UpdateResult>} The result of the update operation.
   */
  async updateOne(
    idRestaurant: number,
    id: number,
    body: IngredientDto, // Change type based on your actual body structure
  ): Promise<UpdateResult> {
    const db = this.getDbConnection();

    return db.collection('restaurant').updateOne(
      { id: idRestaurant, 'ingredients.id': id },
      {
        $set: {
          'ingredients.$.name': body.name,
          'ingredients.$.price': body.price,
          'ingredients.$.id_restaurant': body.id_restaurant,
        },
      },
    );
  }

  /**
   * Deletes a specific ingredient for a restaurant.
   * 
   * @param {number} idRestaurant - The ID of the restaurant.
   * @param {number} id - The ID of the ingredient to delete.
   * @returns {Promise<UpdateResult>} The result of the delete operation.
   */
  async deleteOne(idRestaurant: number, id: number): Promise<UpdateResult> {
    const db = this.getDbConnection();

    return db
      .collection<Restaurant>('restaurant')
      .updateOne({ id: idRestaurant }, { $pull: { ingredients: { id: id } } });
  }
}