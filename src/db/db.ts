/**
 * The DB class handles the connection to the MongoDB database.
 * 
 * It establishes a connection to a specified database and provides
 * a method to retrieve the database connection.
 * 
 * @class DB
 */

import mongoose from 'mongoose';
import { Connection } from 'mongoose';

export class DB {
  private db: Connection;

  /**
   * Initializes a new instance of the DB class and creates a connection
   * to the MongoDB database using the provided DB_URL environment variable.
   * 
   * The connection is established with a timeout of 5000ms for server selection,
   * and the specific database used is 'HelloKitchen'.
   * 
   * @constructor
   */
  constructor() {
    const client = mongoose.createConnection(process.env.DB_URL, {
      serverSelectionTimeoutMS: 5000,
    });
    this.db = client.useDb('HelloKitchen');
  }

  /**
   * Retrieves the current database connection.
   * 
   * @returns {Connection} The mongoose connection to the 'HelloKitchen' database.
   * @memberof DB
   */
  getDbConnection(): Connection {
    return this.db;
  }
}
