var express = require('express');
var router = express.Router();
const keys = require("./keys.apiRoutes.js");

router.get('/', (req, res) => {
    client.connect().then(client => {
        const db = client.db(keys.DB_NAME);
        const collection = db.collection(keys.USER_COLLECTION_NAME);

        collection.find({}).toArray().then(users => {
            res.json(users);
        }).catch(err => {
            res.status(500).send("Error reading users from database : " + err);
        });
    }).catch(err => {
        res.status(500).send("Error connecting to database : " + err);
    });
});

router.get('/:id', (req, res) => {
    client.connect().then(client => {
        const db = client.db(keys.DB_NAME);
        const collection = db.collection(keys.USER_COLLECTION_NAME);

        collection.findOne({ id: Number(req.params.id) }).then(user => {
            res.json(user);
        }).catch(err => {
            res.status(500).send("Error reading user from database : " + err);
        });
    }).catch(err => {
        res.status(500).send("Error connecting to database : " + err);
    });
});

router.post('/', (req, res) => {
    client.connect().then(client => {
        const db = client.db(keys.DB_NAME);
        const collection = db.collection(keys.USER_COLLECTION_NAME);

        collection.insertOne(req.body).then(result => {
            res.json(result);
        }).catch(err => {
            res.status(500).send("Error inserting user into database : " + err);
        });
    }).catch(err => {
        res.status(500).send("Error connecting to database : " + err);
    });
});

router.put('/:id', (req, res) => {
    client.connect().then(client => {
        const db = client.db(keys.DB_NAME);
        const collection = db.collection(keys.USER_COLLECTION_NAME);

        collection.updateOne({ id: Number(req.params.id) }, { $set: req.body }).then(result => {
            res.json(result);
        }).catch(err => {
            res.status(500).send("Error updating user in database : " + err);
        });
    }).catch(err => {
        res.status(500).send("Error connecting to database : " + err);
    });
});

router.delete('/:id', (req, res) => {
    client.connect().then(client => {
        const db = client.db(keys.DB_NAME);
        const collection = db.collection(keys.USER_COLLECTION_NAME);

        collection.deleteOne({ id: Number(req.params.id) }).then(result => {
            res.json(result);
        }).catch(err => {
            res.status(500).send("Error deleting user from database : " + err);
        });
    }).catch(err => {
        res.status(500).send("Error connecting to database : " + err);
    });
});

module.exports = router;