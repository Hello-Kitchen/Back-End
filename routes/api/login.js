var express = require('express');
var router = express.Router();
const keys = require("./keys.apiRoutes.js");
const {client, DB_NAME, salt} = require('../../config/config.js');
const bcrypt = require('bcryptjs')

router.post('/', (req, res) => {
    client.connect().then(client => {
        const db = client.db(DB_NAME);
        const collection = db.collection(keys.USER_COLLECTION_NAME);

        collection.findOne({ username: req.body.username }).then(user => {
            if (user === null) {
                res.status(500).send("USER NOT FOUND");
            } else if (bcrypt.hashSync(req.body.password, salt) === user.password) {
                res.status(200).send("OK");
            } else {
                res.status(500).send("WRONG PASSWORD");
            }
        }).catch(err => {
            res.status(500).send("USER NOT FOUND " + err);
        });
    }).catch(err => {
        res.status(500).send("Error connecting to database : " + err);
    });
});

module.exports = router;