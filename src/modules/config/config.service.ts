import { Injectable } from '@nestjs/common';
import mongoose from 'mongoose';
import { UpdateResult } from 'mongodb';
import { DB } from '../../db/db';
import { ConfigDto } from './DTO/config.dto';

/**
 * Service for managing config within a restaurant.
 */
@Injectable()
export class ConfigService extends DB {
  /**
   * Retrieves the config for a specific restaurant.
   *
   * @param {number} idRestaurant - The ID of the restaurant.
   * @returns {Promise<mongoose.mongo.WithId<mongoose.AnyObject>>} The restaurant's tables.
   */
  async find(
    idRestaurant: number,
  ): Promise<mongoose.mongo.WithId<mongoose.AnyObject>> {
    const db = this.getDbConnection();

    return db
      .collection('restaurant')
      .findOne({ id: idRestaurant }, { projection: { _id: 0, pos_config: 1 } });
  }

  /**
   * Creates a new table for a specific restaurant.
   *
   * @param {number} idRestaurant - The ID of the restaurant.
   * @param {ConfigDto} body - The table data to be added.
   * @returns {Promise<UpdateResult>} The result of the update operation.
   */
  async create(idRestaurant: number, body: ConfigDto): Promise<UpdateResult> {
    const db = this.getDbConnection();

    return db
      .collection('restaurant')
      .updateOne(
        { id: idRestaurant },
        { $addToSet: { 'pos_config.tables': body } },
      );
  }

  /**
   * Updates an existing table for a specific restaurant.
   *
   * @param {number} idRestaurant - The ID of the restaurant.
   * @param {number} id - The ID of the table to update.
   * @param {ConfigDto} body - The updated table data.
   * @returns {Promise<UpdateResult>} The result of the update operation.
   */
  async update(idRestaurant: number, body: ConfigDto): Promise<UpdateResult> {
    const db = this.getDbConnection();

    return db.collection('restaurant').updateOne(
      { id: idRestaurant },
      {
        $set: {
          'pos_config.tables': body.tables,
          'pos_config.width': body.width,
          'pos_config.height': body.height,
        },
      },
    );
  }
}
