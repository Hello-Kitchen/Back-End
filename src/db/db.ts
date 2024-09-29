import mongoose from 'mongoose'
import { Connection } from 'mongoose'


export class DB {
    private db: Connection

    constructor() {
        let client = mongoose.createConnection('mongodb+srv://back:cEAxkXCdz13wyDM629OW@mongodb-bef27478-o08faf477.database.cloud.ovh.net/admin?replicaSet=replicaset&tls=true', { serverSelectionTimeoutMS: 5000 });
        this.db = client.useDb('HelloKitchen')
    }

    getDbConnection(): Connection {
        return this.db;
    }

}