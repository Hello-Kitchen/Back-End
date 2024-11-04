import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { DB } from '../../db/db';
import mongoose from 'mongoose';

@Injectable()
export class PosService extends DB {
  /**
   * Retrieves a restaurant by its ID.
   *
   * @param {number} id - The ID of the restaurant to retrieve.
   * @returns {Promise<mongoose.mongo.WithId<mongoose.AnyObject> | null>} The restaurant if found, otherwise null.
   * @throws {NotFoundException} If the restaurant is not found.
   * @throws {InternalServerErrorException} For any unexpected errors during the database operation.
   */
  async findRestaurant(
    id: number,
  ): Promise<mongoose.mongo.WithId<mongoose.AnyObject> | null> {
    const db = this.getDbConnection();

    try {
      const restaurant = await db.collection('restaurant').findOne({ id: id });
      if (!restaurant) {
        throw new NotFoundException(`Restaurant with id ${id} not found`);
      }
      return restaurant;
    } catch (error) {
      throw new InternalServerErrorException(
        `Error fetching restaurant with id ${id}: ${error.message}`,
      );
    }
  }
}
