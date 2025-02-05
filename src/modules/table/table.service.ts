import { Injectable } from '@nestjs/common';
import mongoose from 'mongoose';
import { UpdateResult, ReturnDocument } from 'mongodb';
import { DB } from '../../db/db';
import { Restaurant } from '../../shared/interfaces/restaurant.interface';
import { Counter } from '../../shared/interfaces/counter.interface';
import { TableDto } from './DTO/table.dto';

/**
 * Service for managing tables within a restaurant.
 */
@Injectable()
export class TableService extends DB {
  /**
   * Retrieves all tables for a specific PosConfig.
   *
   * @param {number} idPosConfig - The ID of the PosConfig.
   * @returns {Promise<mongoose.mongo.WithId<mongoose.AnyObject>>} The PosConfig's tables.
   */
  async findAll(
    idPosConfig: number,
  ): Promise<mongoose.mongo.WithId<mongoose.AnyObject>> {
    const db = this.getDbConnection();

    return db
      .collection('pos_config')
      .findOne({ id: idPosConfig }, { projection: { _id: 0, tables: 1 } });
  }

  /**
   * Retrieves a specific table by its ID for a given PosConfig.
   *
   * @param {number} idPosConfig - The ID of the PosConfig.
   * @param {number} id - The ID of the table.
   * @returns {Promise<mongoose.mongo.WithId<mongoose.AnyObject>>} The table.
   */
  async findById(
    idPosConfig: number,
    id: number,
  ): Promise<mongoose.mongo.WithId<mongoose.AnyObject>> {
    const db = this.getDbConnection();

    return db
      .collection('pos_config')
      .findOne(
        { id: idPosConfig },
        { projection: { _id: 0, tables: { $elemMatch: { id: id } } } },
      );
  }

  /**
   * Creates a new table for a specific PosConfig.
   *
   * @param {number} idPosConfig - The ID of the PosConfig.
   * @param {tableDto} body - The table data to be added.
   * @returns {Promise<UpdateResult>} The result of the update operation.
   */
  async createOne(
    idPosConfig: number,
    body: TableDto, // Change type based on your actual body structure
  ): Promise<UpdateResult> {
    const db = this.getDbConnection();
    const id = await db
      .collection<Counter>('counter')
      .findOneAndUpdate(
        { _id: 'tableId' },
        { $inc: { sequence_value: 1 } },
        { returnDocument: ReturnDocument.AFTER },
      );

    body['id'] = id.sequence_value; // Assuming the body is mutable
    return db
      .collection('pos_config')
      .updateOne({ id: idPosConfig }, { $addToSet: { tables: body } });
  }

  /**
   * Updates an existing table for a specific PosConfig.
   *
   * @param {number} idPosConfig - The ID of the PosConfig.
   * @param {number} id - The ID of the table to update.
   * @param {tableDto} body - The updated table data.
   * @returns {Promise<UpdateResult>} The result of the update operation.
   */
  async updateOne(
    idPosConfig: number,
    id: number,
    body: TableDto, // Change type based on your actual body structure
  ): Promise<UpdateResult> {
    const db = this.getDbConnection();

    return db.collection('pos_config').updateOne(
      { id: idPosConfig, 'tables.id': id },
      {
        $set: {
          'tables.$.x': body.x,
          'tables.$.y': body.y,
          'tables.$.name': body.name,
        },
      },
    );
  }

  /**
   * Deletes a specific table for a PosConfig.
   *
   * @param {number} idPosConfig - The ID of the PosConfig.
   * @param {number} id - The ID of the table to delete.
   * @returns {Promise<UpdateResult>} The result of the delete operation.
   */
  async deleteOne(idPosConfig: number, id: number): Promise<UpdateResult> {
    const db = this.getDbConnection();

    return db
      .collection<Restaurant>('pos_config')
      .updateOne({ id: idPosConfig }, { $pull: { tables: { id: id } } });
  }
}
