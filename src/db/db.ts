import mongoose from 'mongoose';
import { Connection } from 'mongoose';

export class DB {
  private db: Connection;

  constructor() {
    const client = mongoose.createConnection(process.env.DB_URL, {
      serverSelectionTimeoutMS: 5000,
    });
    this.db = client.useDb('HelloKitchen');
  }

  getDbConnection(): Connection {
    return this.db;
  }
}
