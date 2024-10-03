import mongoose from 'mongoose'
import { Connection } from 'mongoose'


export class DB {
    private db: Connection

    constructor() {
        let client = mongoose.createConnection(process.env.DB_URL_LOCAL, { serverSelectionTimeoutMS: 5000 });
        this.db = client.useDb('HelloKitchen')
    }

    getDbConnection(): Connection {
        return this.db;
    }

}