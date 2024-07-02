var express = require('express');
var router = express.Router();
const keys = require("./keys.apiRoutes.js");
const {client, DB_NAME} = require('../../config/config.js');

router.get('/', (req, res) => {
    client.connect().then(client => {
        const db = client.db(DB_NAME);
        const collection = db.collection(keys.FOOD_ORDERED_COLLECTION_NAME);

        collection.find({}).toArray().then(foodOrdered => {
            res.json(foodOrdered);
        }).catch(err => {
            res.status(500).send("Error reading foodOrdered from database : " + err);
        });
    }).catch(err => {
        res.status(500).send("Error connecting to database : " + err);
    });
});

router.get('/:id', (req, res) => {
    client.connect().then(client => {
        const db = client.db(DB_NAME);
        const collection = db.collection(keys.FOOD_ORDERED_COLLECTION_NAME);

        collection.findOne({ id: Number(req.params.id) }).then(foodOrdered => {
            res.json(foodOrdered);
        }).catch(err => {
            res.status(500).send("Error reading foodOrdered from database : " + err);
        });
    }).catch(err => {
        res.status(500).send("Error connecting to database : " + err);
    });
});

router.post('/', (req, res) => {
    client.connect().then(client => {
        const db = client.db(DB_NAME);
        const collection = db.collection(keys.FOOD_ORDERED_COLLECTION_NAME);

        collection.insertOne(req.body).then(result => {
            res.json(result);
        }).catch(err => {
            res.status(500).send("Error inserting foodOrdered into database : " + err);
        });
    }).catch(err => {
        res.status(500).send("Error connecting to database : " + err);
    });
});

router.put('/:id', (req, res) => {
    client.connect().then(client => {
        const db = client.db(DB_NAME);
        const collection = db.collection(keys.FOOD_ORDERED_COLLECTION_NAME);

        collection.updateOne({ id: Number(req.params.id) }, { $set: req.body }).then(result => {
            res.json(result);
        }).catch(err => {
            res.status(500).send("Error updating foodOrdered in database : " + err);
        });
    }).catch(err => {
        res.status(500).send("Error connecting to database : " + err);
    });
});

router.delete('/:id', (req, res) => {
    client.connect().then(client => {
        const db = client.db(DB_NAME);
        const collection = db.collection(keys.FOOD_ORDERED_COLLECTION_NAME);

        collection.deleteOne({ id: Number(req.params.id) }).then(result => {
            res.json(result);
        }).catch(err => {
            res.status(500).send("Error deleting foodOrdered from database : " + err);
        });
    }).catch(err => {
        res.status(500).send("Error connecting to database : " + err);
    });
});

router.post('/status/:id', (req, res) => {
    client.connect().then(client => {
        const db = client.db(DB_NAME);
        const collection = db.collection(keys.FOOD_ORDERED_COLLECTION_NAME);

        collection.findOne({ id: Number(req.params.id) }).then(food => {
            food.is_ready = true;
            collection.updateMany({ id: Number(req.params.id) }, { $set: food}).then(result => {
                res.json(result);
            }).catch(err => {
                res.status(500).send("Error updating foodOrdered into database : " + err);
            });
        }).catch((err) => {
            res.status(500).send("Error readinf foodOrdered from database " + err);
        });
    }).catch(err => {
        res.status(500).send("Error connecting to database : " + err);
    });
});

module.exports = router;