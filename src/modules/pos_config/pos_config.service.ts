import { Injectable } from '@nestjs/common';
import mongoose from 'mongoose';
import { UpdateResult, DeleteResult, ReturnDocument } from 'mongodb';
import { Counter } from '../../shared/interfaces/counter.interface';
import { DB } from '../../db/db';
import { PosConfigDto } from './DTO/pos_config.dto';

@Injectable()
export class PosConfigService extends DB {
  /**
   * Fetches all PosConfig from the database.
   *
   * @returns {Promise<mongoose.mongo.WithId<mongoose.AnyObject>[]>} An array of PosConfig.
   */
  async findAll(): Promise<mongoose.mongo.WithId<mongoose.AnyObject>[]> {
    const db = this.getDbConnection();
    return db.collection('pos_config').find({}).toArray();
  }

  /**
   * Fetches a pos_config by its ID.
   *
   * @param {number} id - The ID of the pos_config.
   * @returns {Promise<mongoose.mongo.WithId<mongoose.AnyObject>>} The pos_config if found.
   */
  async findById(
    id: number,
  ): Promise<mongoose.mongo.WithId<mongoose.AnyObject>> {
    const db = this.getDbConnection();
    return db.collection('pos_config').findOne({ id });
  }

  /**
   * Creates a new pos_config in the database.
   *
   * @param {PosConfigDto} body - The pos_config data to be inserted.
   * @returns {Promise<mongoose.mongo.InsertOneResult<mongoose.AnyObject>>} The result of the insert operation.
   */
  async createOne(
    body: PosConfigDto, // Changed from ReadableStream<Uint8Array> to the correct type
  ): Promise<mongoose.mongo.InsertOneResult<mongoose.AnyObject>> {
    const db = this.getDbConnection();
    const res = await db
      .collection<Counter>('counter')
      .findOneAndUpdate(
        { _id: 'posConfigId' },
        { $inc: { sequence_value: 1 } },
        { returnDocument: ReturnDocument.AFTER },
      );

    body['id'] = res.sequence_value; // Assuming the body is mutable
    return db.collection('pos_config').insertOne(body);
  }

  /**
   * Updates a pos_config by its ID.
   *
   * @param {number} id - The ID of the pos_config to update.
   * @param {PosConfigDto} body - The updated pos_config data.
   * @returns {Promise<UpdateResult>} The result of the update operation.
   */
  async updateOne(
    id: number,
    body: PosConfigDto, // Changed from ReadableStream<Uint8Array> to the correct type
  ): Promise<UpdateResult> {
    const db = this.getDbConnection();

    return db.collection('pos_config').updateOne({ id }, { $set: body });
  }

  /**
   * Deletes a pos_config by its ID.
   *
   * @param {number} id - The ID of the pos_config to delete.
   * @returns {Promise<DeleteResult>} The result of the delete operation.
   */
  async deleteOne(id: number): Promise<DeleteResult> {
    const db = this.getDbConnection();
    return db.collection('pos_config').deleteOne({ id });
  }
}
