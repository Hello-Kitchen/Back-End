import { Injectable } from '@nestjs/common';
import { DB } from 'src/db/db';

@Injectable()
export class PosService extends DB {
  async findRestaurant(id: number) {
    const db = this.getDbConnection();

    return db.collection('restaurant').findOne({ id: id });
  }
}
