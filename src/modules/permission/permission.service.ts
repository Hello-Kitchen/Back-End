import { Injectable } from '@nestjs/common';
import mongoose from 'mongoose';
import { UpdateResult, InsertOneResult, DeleteResult } from 'mongodb';
import { DB } from 'src/db/db';

@Injectable()
export class PermissionService extends DB {
  /**
   * Retrieves all permissions from the database.
   *
   * @returns {Promise<mongoose.mongo.WithId<mongoose.AnyObject>[]>} An array of permissions.
   */
  async findAll(): Promise<mongoose.mongo.WithId<mongoose.AnyObject>[]> {
    const db = this.getDbConnection();
    return db.collection('permission').find({}).toArray();
  }

  /**
   * Retrieves a specific permission by its ID.
   *
   * @param {number} id - The ID of the permission.
   * @returns {Promise<mongoose.mongo.WithId<mongoose.AnyObject> | null>} The permission if found, otherwise null.
   */
  async findById(
    id: number,
  ): Promise<mongoose.mongo.WithId<mongoose.AnyObject> | null> {
    const db = this.getDbConnection();
    return db.collection('permission').findOne({ id: id });
  }

  /**
   * Creates a new permission in the database.
   *
   * @param {ReadableStream<Uint8Array>} body - The data for the new permission.
   * @returns {Promise<InsertOneResult<mongoose.AnyObject>>} The result of the insert operation.
   */
  async createOne(
    body: ReadableStream<Uint8Array>,
  ): Promise<InsertOneResult<mongoose.AnyObject>> {
    const db = this.getDbConnection();
    return db.collection('permission').insertOne(body);
  }

  /**
   * Updates an existing permission by its ID.
   *
   * @param {number} id - The ID of the permission to update.
   * @param {ReadableStream<Uint8Array>} body - The updated data for the permission.
   * @returns {Promise<UpdateResult>} The result of the update operation.
   */
  async updateOne(
    id: number,
    body: ReadableStream<Uint8Array>,
  ): Promise<UpdateResult> {
    const db = this.getDbConnection();
    return db.collection('permission').updateOne({ id: id }, { $set: body });
  }

  /**
   * Deletes a permission by its ID.
   *
   * @param {number} id - The ID of the permission to delete.
   * @returns {Promise<DeleteResult>} The result of the delete operation.
   */
  async deleteOne(id: number): Promise<DeleteResult> {
    const db = this.getDbConnection();
    return db.collection('permission').deleteOne({ id: id });
  }
}
