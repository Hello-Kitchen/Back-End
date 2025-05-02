import { Injectable } from '@nestjs/common';
import mongoose from 'mongoose';
import { UpdateResult } from 'mongodb';
import { DB } from '../../db/db';
import { PosConfigDto } from './DTO/pos_config.dto';

/**
 * Service for managing the table configuration of a restaurant.
 *
 * The `PosConfigService` class provides methods for CRUD operations
 * related to the pos_config in the restaurant database.
 */
@Injectable()
export class PosConfigService extends DB {
    /**
   * Retrieves the pos_config of a specific restaurant.
   *
   * @param {number} idRestaurant - The ID of the restaurant.
   * @returns {Promise<mongoose.mongo.WithId<mongoose.AnyObject>>} The pos_config.
   */
  async findOne(
    idRestaurant: number,
  ): Promise<mongoose.mongo.WithId<mongoose.AnyObject> | null> {
    const db = this.getDbConnection();

    return db
      .collection('restaurant')
      .findOne(
        { id: idRestaurant },
        { projection: { _id: 0, pos_config: 1 } }
      );
  }

  /**
   * Updates the existing pos_config or creates it for a specific restaurant.
   *
   * @param {number} idRestaurant - The ID of the restaurant.
   * @param {PosConfigDto} body - The updated pos_config data.
   * @returns {Promise<UpdateResult>} The result of the update operation.
   */
  async updateOne(
    idRestaurant: number,
    body: PosConfigDto,
  ): Promise<UpdateResult> {
    const db = this.getDbConnection();

    return db
      .collection('restaurant')
      .updateOne(
        { id: idRestaurant },
        { $set: { pos_config: body } }
      );
  }
}