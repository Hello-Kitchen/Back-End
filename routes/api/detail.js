module.exports = function(app, client) {

    const keys = require("./keys.apiRoutes.js");

    app.get('/api/details', (req, res) => {
        client.connect().then(client => {
            const db = client.db(keys.DB_NAME);
            const collection = db.collection(keys.DETAIL_COLLECTION_NAME);

            collection.find({}).toArray().then(details => {
                res.json(details);
            }).catch(err => {
                res.status(500).send("Error reading details from database : " + err);
            });
        }).catch(err => {
            res.status(500).send("Error connecting to database : " + err);
        });
    });

    app.get('/api/details/:id', (req, res) => {
        client.connect().then(client => {
            const db = client.db(keys.DB_NAME);
            const collection = db.collection(keys.DETAIL_COLLECTION_NAME);

            collection.findOne({id: Number(req.params.id)}).then(detail => {
                res.json(detail);
            }).catch(err => {
                res.status(500).send("Error reading detail from database : " + err);
            });
        }).catch(err => {
            res.status(500).send("Error connecting to database : " + err);
        });
    });

    app.post('/api/details', (req, res) => {
        client.connect().then(client => {
            const db = client.db(keys.DB_NAME);
            const collection = db.collection(keys.DETAIL_COLLECTION_NAME);

            collection.insertOne(req.body).then(result => {
                res.json(result);
            }).catch(err => {
                res.status(500).send("Error inserting detail into database : " + err);
            });
        }).catch(err => {
            res.status(500).send("Error connecting to database : " + err);
        });
    });

    app.put('/api/details/:id', (req, res) => {
        client.connect().then(client => {
            const db = client.db(keys.DB_NAME);
            const collection = db.collection(keys.DETAIL_COLLECTION_NAME);

            collection.updateOne({id: Number(req.params.id)}, {$set: req.body}).then(result => {
                res.json(result);
            }).catch(err => {
                res.status(500).send("Error updating detail in database : " + err);
            });
        }).catch(err => {
            res.status(500).send("Error connecting to database : " + err);
        });
    });

    app.delete('/api/details/:id', (req, res) => {
        client.connect().then(client => {
            const db = client.db(keys.DB_NAME);
            const collection = db.collection(keys.DETAIL_COLLECTION_NAME);

            collection.deleteOne({id: Number(req.params.id)}).then(result => {
                res.json(result);
            }).catch(err => {
                res.status(500).send("Error deleting detail from database : " + err);
            });
        }).catch(err => {
            res.status(500).send("Error connecting to database : " + err);
        });
    });

}