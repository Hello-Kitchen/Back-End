module.exports = function(app, client) {

    const keys = require("./keys.apiRoutes.js");

    app.get('/api/users', (req, res) => {
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

    app.get('/api/users/:id', (req, res) => {
        client.connect().then(client => {
            const db = client.db(keys.DB_NAME);
            const collection = db.collection(keys.USER_COLLECTION_NAME);

            collection.findOne({id: Number(req.params.id)}).then(user => {
                res.json(user);
            }).catch(err => {
                res.status(500).send("Error reading user from database : " + err);
            });
        }).catch(err => {
            res.status(500).send("Error connecting to database : " + err);
        });
    });

    app.post('/api/users', (req, res) => {
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

    app.put('/api/users/:id', (req, res) => {
        client.connect().then(client => {
            const db = client.db(keys.DB_NAME);
            const collection = db.collection(keys.USER_COLLECTION_NAME);

            collection.updateOne({id: Number(req.params.id)}, {$set: req.body}).then(result => {
                res.json(result);
            }).catch(err => {
                res.status(500).send("Error updating user in database : " + err);
            });
        }).catch(err => {
            res.status(500).send("Error connecting to database : " + err);
        });
    });

    app.delete('/api/users/:id', (req, res) => {
        client.connect().then(client => {
            const db = client.db(keys.DB_NAME);
            const collection = db.collection(keys.USER_COLLECTION_NAME);

            collection.deleteOne({id: Number(req.params.id)}).then(result => {
                res.json(result);
            }).catch(err => {
                res.status(500).send("Error deleting user from database : " + err);
            });
        }).catch(err => {
            res.status(500).send("Error connecting to database : " + err);
        });
    });

}