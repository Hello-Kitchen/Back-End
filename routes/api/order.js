module.exports = function(app, client) {

    const keys = require("./keys.apiRoutes.js");

    app.get('/api/orders', (req, res) => {
        client.connect().then(client => {
            const db = client.db(keys.DB_NAME);
            const collection = db.collection(keys.ORDER_COLLECTION_NAME);

            collection.find({}).toArray().then(orders => {
                res.json(orders);
            }).catch(err => {
                res.status(500).send("Error reading orders from database : " + err);
            });
        }).catch(err => {
            res.status(500).send("Error connecting to database : " + err);
        });
    });

    app.get('/api/orders/:id', (req, res) => {
        client.connect().then(client => {
            const db = client.db(keys.DB_NAME);
            const collection = db.collection(keys.ORDER_COLLECTION_NAME);

            collection.findOne({id: Number(req.params.id)}).then(order => {
                res.json(order);
            }).catch(err => {
                res.status(500).send("Error reading order from database : " + err);
            });
        }).catch(err => {
            res.status(500).send("Error connecting to database : " + err);
        });
    });

    app.post('/api/orders', (req, res) => {
        client.connect().then(client => {
            const db = client.db(keys.DB_NAME);
            const collection = db.collection(keys.ORDER_COLLECTION_NAME);

            collection.insertOne(req.body).then(result => {
                res.json(result);
            }).catch(err => {
                res.status(500).send("Error inserting order into database : " + err);
            });
        }).catch(err => {
            res.status(500).send("Error connecting to database : " + err);
        });
    });

    app.put('/api/orders/:id', (req, res) => {
        client.connect().then(client => {
            const db = client.db(keys.DB_NAME);
            const collection = db.collection(keys.ORDER_COLLECTION_NAME);

            collection.updateOne({id: Number(req.params.id)}, {$set: req.body}).then(result => {
                res.json(result);
            }).catch(err => {
                res.status(500).send("Error updating order in database : " + err);
            });
        }).catch(err => {
            res.status(500).send("Error connecting to database : " + err);
        });
    });

    app.delete('/api/orders/:id', (req, res) => {
        client.connect().then(client => {
            const db = client.db(keys.DB_NAME);
            const collection = db.collection(keys.ORDER_COLLECTION_NAME);

            collection.deleteOne({id: Number(req.params.id)}).then(result => {
                res.json(result);
            }).catch(err => {
                res.status(500).send("Error deleting order from database : " + err);
            });
        }).catch(err => {
            res.status(500).send("Error connecting to database : " + err);
        });
    });

}