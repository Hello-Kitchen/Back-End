require('dotenv').config();
const { MongoClient } = require('mongodb');
const client = new MongoClient(process.env.DB_URL, { serverSelectionTimeoutMS: 500 });
const DB_NAME = process.env.DB_NAME;
const salt = process.env.SALT_HASH;

module.exports = {
    client: client,
    DB_NAME: DB_NAME,
    salt: salt,
}