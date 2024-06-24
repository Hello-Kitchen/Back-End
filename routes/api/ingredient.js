module.exports = function(app, client) {

    const keys = require("./keys.apiroutes.js");

    app.get('/api/ingredients', (req, res) => {
        client.connect().then(client => {
            const db = client.db(keys.DB_NAME);
            const collection = db.collection(keys.INGREDIENT_COLLECTION_NAME);

            collection.find({}).toArray().then(ingredients => {
                res.json(ingredients);
            }).catch(err => {
                res.status(500).send("Error reading ingredients from database : " + err);
            });
        }).catch(err => {
            res.status(500).send("Error connecting to database : " + err);
        });
    });

    app.get('/api/ingredients/:id', (req, res) => {
        client.connect().then(client => {
            const db = client.db(keys.DB_NAME);
            const collection = db.collection(keys.INGREDIENT_COLLECTION_NAME);

            collection.findOne({id: Number(req.params.id)}).then(ingredient => {
                res.json(ingredient);
            }).catch(err => {
                res.status(500).send("Error reading ingredient from database : " + err);
            });
        }).catch(err => {
            res.status(500).send("Error connecting to database : " + err);
        });
    });

    app.post('/api/ingredients', (req, res) => {
        client.connect().then(client => {
            const db = client.db(keys.DB_NAME);
            const collection = db.collection(keys.INGREDIENT_COLLECTION_NAME);

            collection.insertOne(req.body).then(result => {
                res.json(result);
            }).catch(err => {
                res.status(500).send("Error inserting ingredient into database : " + err);
            });
        }).catch(err => {
            res.status(500).send("Error connecting to database : " + err);
        });
    });

    app.put('/api/ingredients/:id', (req, res) => {
        client.connect().then(client => {
            const db = client.db(keys.DB_NAME);
            const collection = db.collection(keys.INGREDIENT_COLLECTION_NAME);

            collection.updateOne({id: Number(req.params.id)}, {$set: req.body}).then(result => {
                res.json(result);
            }).catch(err => {
                res.status(500).send("Error updating ingredient in database : " + err);
            });
        }).catch(err => {
            res.status(500).send("Error connecting to database : " + err);
        });
    });

    app.delete('/api/ingredients/:id', (req, res) => {
        client.connect().then(client => {
            const db = client.db(keys.DB_NAME);
            const collection = db.collection(keys.INGREDIENT_COLLECTION_NAME);

            collection.deleteOne({id: Number(req.params.id)}).then(result => {
                res.json(result);
            }).catch(err => {
                res.status(500).send("Error deleting ingredient from database : " + err);
            });
        }).catch(err => {
            res.status(500).send("Error connecting to database : " + err);
        });
    });

}