import { Injectable } from '@nestjs/common';
import mongoose from 'mongoose';
import { UpdateResult } from 'mongodb';
import { DB } from 'src/db/db';

@Injectable()
export class OrdersService extends DB {
  async findAll(): Promise<mongoose.mongo.WithId<mongoose.AnyObject>[]> {
    const db = this.getDbConnection();

    return db.collection('order').find({}).toArray();
  }

  async findAllSortedByDate() {
    const db = this.getDbConnection();

    return await db.collection('order').find({}).sort({ date: 1 }).toArray();
  }

  async findByPart() {
    const db = this.getDbConnection();

    return await db
      .collection('order')
      .aggregate([
        {
          $project: {
            food_ordered: {
              $filter: {
                input: '$food_ordered',
                as: 'item',
                cond: { $eq: ['$$item.part', '$part'] },
              },
            },
            part: 1,
            channel: 1,
            number: 1,
            id_restaurant: 1,
            date: 1,
            _id: 0,
            id: 1,
          },
        },
      ])
      .toArray();
  }

  async findReady() {
    const db = this.getDbConnection();

    return await db
      .collection('order')
      .aggregate([
        {
          $project: {
            food_ordered: {
              $filter: {
                input: '$food_ordered',
                as: 'item',
                cond: { $eq: ['$$item.part', '$part'] },
              },
            },
            part: 1,
            channel: 1,
            number: 1,
            id_restaurant: 1,
            date: 1,
            _id: 0,
            id: 1,
          },
        },
        {
          $match: {
            food_ordered: { $not: { $elemMatch: { is_ready: false } } },
          },
        },
      ])
      .toArray();
  }

  async findReadySortedByDate() {
    const db = this.getDbConnection();

    return await db
      .collection('order')
      .aggregate([
        {
          $project: {
            food_ordered: {
              $filter: {
                input: '$food_ordered',
                as: 'item',
                cond: { $eq: ['$$item.part', '$part'] },
              },
            },
            part: 1,
            channel: 1,
            number: 1,
            id_restaurant: 1,
            date: 1,
            _id: 0,
            id: 1,
          },
        },
        {
          $match: {
            food_ordered: { $not: { $elemMatch: { is_ready: false } } },
          },
        },
      ])
      .sort({ date: 1 })
      .toArray();
  }

  async findPending() {
    const db = this.getDbConnection();

    return await db
      .collection('order')
      .aggregate([
        {
          $project: {
            food_ordered: {
              $filter: {
                input: '$food_ordered',
                as: 'item',
                cond: { $eq: ['$$item.part', '$part'] },
              },
            },
            part: 1,
            channel: 1,
            number: 1,
            id_restaurant: 1,
            date: 1,
            _id: 0,
            id: 1,
          },
        },
        { $match: { food_ordered: { $elemMatch: { is_ready: true } } } },
        { $match: { food_ordered: { $elemMatch: { is_ready: false } } } },
      ])
      .toArray();
  }

  async findPendingSortedByDate() {
    const db = this.getDbConnection();

    return await db
      .collection('order')
      .aggregate([
        {
          $project: {
            food_ordered: {
              $filter: {
                input: '$food_ordered',
                as: 'item',
                cond: { $eq: ['$$item.part', '$part'] },
              },
            },
            part: 1,
            channel: 1,
            number: 1,
            id_restaurant: 1,
            date: 1,
            _id: 0,
            id: 1,
          },
        },
        { $match: { food_ordered: { $elemMatch: { is_ready: true } } } },
        { $match: { food_ordered: { $elemMatch: { is_ready: false } } } },
      ])
      .sort({ date: 1 })
      .toArray();
  }

  async findById(
    id: number,
  ): Promise<mongoose.mongo.WithId<mongoose.AnyObject>> {
    const db = this.getDbConnection();

    return db.collection('order').findOne({ id: id });
  }

  async findByIdWithParam(
    id: number,
    param: Record<string, any>,
  ): Promise<mongoose.mongo.WithId<mongoose.AnyObject>> {
    const db = this.getDbConnection();

    return db.collection('order').findOne({ id: id }, param);
  }

  async findFoodByIdsWithParam(id: number[], param: Record<string, any>) {
    const db = this.getDbConnection();

    return await db.collection('food').findOne({ id: id }, param);
  }

  async createOne(
    body: ReadableStream<Uint8Array>,
  ): Promise<mongoose.mongo.InsertOneResult<mongoose.AnyObject>> {
    const db = this.getDbConnection();

    return db.collection('order').insertOne(body);
  }

  async updateOne(
    id: number,
    body: ReadableStream<Uint8Array>,
  ): Promise<UpdateResult> {
    const db = this.getDbConnection();

    return db.collection('order').updateOne({ id: id }, { $set: body });
  }

  async deleteOne(id: number): Promise<mongoose.mongo.DeleteResult> {
    const db = this.getDbConnection();

    return db.collection('order').deleteOne({ id: id });
  }
}
