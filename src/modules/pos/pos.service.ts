import { Injectable } from '@nestjs/common';
import mongoose from 'mongoose';
import { UpdateResult, ReturnDocument } from 'mongodb';
import { DB } from 'src/db/db';
import { Restaurant } from 'src/shared/interfaces/restaurant.interface';
import { Counter } from 'src/shared/interfaces/counter.interface';

@Injectable()
export class PosService extends DB{
  
  async findRestaurant(id: number) {
    const db = this.getDbConnection();

    return db.collection('restaurant').findOne({ id: id });
  }

}
