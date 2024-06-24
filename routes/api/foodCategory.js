module.exports = function(app, client) {

    const keys = require("./keys.apiRoutes.js");

    app.get('/api/foodCategories', (req, res) => {
        client.connect().then(client => {
            const db = client.db(keys.DB_NAME);
            const collection = db.collection(keys.FOOD_CATEGORY_COLLECTION_NAME);

            collection.find({}).toArray().then(foodCategories => {
                res.json(foodCategories);
            }).catch(err => {
                res.status(500).send("Error reading food categories from database : " + err);
            });
        }).catch(err => {
            res.status(500).send("Error connecting to database : " + err);
        });
    });

    app.get('/api/foodCategories/:id', (req, res) => {
        client.connect().then(client => {
            const db = client.db(keys.DB_NAME);
            const collection = db.collection(keys.FOOD_CATEGORY_COLLECTION_NAME);

            collection.findOne({id: Number(req.params.id)}).then(foodCategory => {
                res.json(foodCategory);
            }).catch(err => {
                res.status(500).send("Error reading food category from database : " + err);
            });
        }).catch(err => {
            res.status(500).send("Error connecting to database : " + err);
        });
    });

    app.post('/api/foodCategories', (req, res) => {
        client.connect().then(client => {
            const db = client.db(keys.DB_NAME);
            const collection = db.collection(keys.FOOD_CATEGORY_COLLECTION_NAME);

            collection.insertOne(req.body).then(result => {
                res.json(result);
            }).catch(err => {
                res.status(500).send("Error inserting food category into database : " + err);
            });
        }).catch(err => {
            res.status(500).send("Error connecting to database : " + err);
        });
    });

    app.put('/api/foodCategories/:id', (req, res) => {
        client.connect().then(client => {
            const db = client.db(keys.DB_NAME);
            const collection = db.collection(keys.FOOD_CATEGORY_COLLECTION_NAME);

            collection.updateOne({id: Number(req.params.id)}, {$set: req.body}).then(result => {
                res.json(result);
            }).catch(err => {
                res.status(500).send("Error updating food category in database : " + err);
            });
        }).catch(err => {
            res.status(500).send("Error connecting to database : " + err);
        });
    });

    app.delete('/api/foodCategories/:id', (req, res) => {
        client.connect().then(client => {
            const db = client.db(keys.DB_NAME);
            const collection = db.collection(keys.FOOD_CATEGORY_COLLECTION_NAME);

            collection.deleteOne({id: Number(req.params.id)}).then(result => {
                res.json(result);
            }).catch(err => {
                res.status(500).send("Error deleting food category from database : " + err);
            });
        }).catch(err => {
            res.status(500).send("Error connecting to database : " + err);
        });
    });

}