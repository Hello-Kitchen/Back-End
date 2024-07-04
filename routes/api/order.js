var express = require('express');
var router = express.Router();
const keys = require("./keys.apiRoutes.js");
const {client, DB_NAME} = require('../../config/config.js');

router.get('/', (req, res) => {
    client.connect().then(client => {
        const db = client.db(DB_NAME);
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

router.get('/:id', (req, res) => {
    client.connect().then(client => {
        const db = client.db(DB_NAME);
        const collection = db.collection(keys.ORDER_COLLECTION_NAME);

        if (req.query.forKDS === "true") {
            var orderData;
            var foodOrderedData;
            var foodData;

            // Get the order data
            collection.findOne({ id: Number(req.params.id) }).then(order => {
                orderData = order;
            }).then (() => {

                // For each food ordered, get the food_ordered data
                db.collection(keys.FOOD_ORDERED_COLLECTION_NAME).find({ id: {$in: orderData.food_ordered}, part: orderData.part }).toArray().then(foodOrdered => {
                    foodOrderedData = foodOrdered;
                }).then(() => {
                    const foodIdList = [];
                    foodOrderedData.map((foodOrdered) => {
                        foodIdList.push(foodOrdered.food);
                    });
                    // For each food_ordered, get the food data
                    db.collection(keys.FOOD_COLLECTION_NAME).find({ id: {$in: foodIdList} }).toArray().then(food => {
                        foodData = food;
                    }).then(() => {
                        const foodDetailsList = [];

                        // For every food ordered, wrap the necessary food data in an object
                        foodOrderedData.forEach(foodOrdered => {
                            const food = foodData.find(food => food.id === foodOrdered.food);
                            const foodDetails = {
                                name: food.name,
                                mods_ingredients: foodOrdered.mods_ingredients,
                                details: foodOrdered.details,
                                note: foodOrdered.note,
                                is_ready: foodOrdered.is_ready
                            };

                            function omit(obj, keys) {
                                const newObj = { ...obj };
                                keys.forEach(key => delete newObj[key]);
                                return newObj;
                            }
                            
                            const existingFoodDetails = foodDetailsList.find(item => {
                                const modifiedItem = omit(item, ['id']);
                                const modifiedFoodDetails = omit(foodDetails, ['id']);
                                return JSON.stringify(modifiedItem) === JSON.stringify({ ...modifiedFoodDetails, quantity: modifiedItem.quantity });
                            });

                            if (existingFoodDetails) {
                                existingFoodDetails.quantity += 1;
                            } else {
                                foodDetailsList.push({
                                    ...foodDetails,
                                    "id": foodOrdered.id,
                                    quantity: 1
                                });
                            }
                        });

                        // Send the list
                        res.status(200).send({
                            channel: orderData.channel,
                            number: orderData.number,
                            date: orderData.date,
                            food: foodDetailsList
                        });

                    })
                    .catch(err => {
                        res.status(500).send("Error reading foodOrdered from database : " + err);
                    });
                })
                .catch(err => {
                    res.status(500).send("Error reading foodOrdered from database : " + err);
                });
            }).catch(err => {
                res.status(500).send("Error reading order from database : " + err);
            });
        } else {
            collection.findOne({ id: Number(req.params.id) }).then(order => {
                res.json(order);
            }).catch(err => {
                res.status(500).send("Error reading order from database : " + err);
            });
        }
    }).catch(err => {
        res.status(500).send("Error connecting to database : " + err);
    });
});

router.post('/', (req, res) => {
    client.connect().then(client => {
        const db = client.db(DB_NAME);
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

router.put('/:id', (req, res) => {
    client.connect().then(client => {
        const db = client.db(DB_NAME);
        const collection = db.collection(keys.ORDER_COLLECTION_NAME);

        collection.updateOne({ id: Number(req.params.id) }, { $set: req.body }).then(result => {
            res.json(result);
        }).catch(err => {
            res.status(500).send("Error updating order in database : " + err);
        });
    }).catch(err => {
        res.status(500).send("Error connecting to database : " + err);
    });
});

router.delete('/:id', (req, res) => {
    client.connect().then(client => {
        const db = client.db(DB_NAME);
        const collection = db.collection(keys.ORDER_COLLECTION_NAME);

        collection.deleteOne({ id: Number(req.params.id) }).then(result => {
            res.json(result);
        }).catch(err => {
            res.status(500).send("Error deleting order from database : " + err);
        });
    }).catch(err => {
        res.status(500).send("Error connecting to database : " + err);
    });
});

router.get('/status/ready', async (req, res) => {
    try {
        await client.connect();
        const db = client.db(DB_NAME);
        const collection = db.collection(keys.ORDER_COLLECTION_NAME);

        const orders = await collection.find({}).toArray();
        const readyOrders = [];

        for (let order of orders) {
            const foodOrdered = await db.collection(keys.FOOD_ORDERED_COLLECTION_NAME).find({ id: { $in: order.food_ordered } }).toArray();
            const allReady = foodOrdered.every(food => food.is_ready);

            if (allReady) {
                readyOrders.push(order);
            }
        }
        res.status(200).json(readyOrders);
    } catch (err) {
        res.status(500).send("Error connecting to database: " + err);
    }
});

router.get('/status/pending', async (req, res) => {
    try {
        await client.connect();
        const db = client.db(DB_NAME);
        const collection = db.collection(keys.ORDER_COLLECTION_NAME);

        const orders = await collection.find({}).toArray();
        const readyOrders = [];

        for (let order of orders) {
            const foodOrdered = await db.collection(keys.FOOD_ORDERED_COLLECTION_NAME).find({ id: { $in: order.food_ordered } }).toArray();
            const allReady = foodOrdered.every(food => food.is_ready);

            if (!allReady) {
                readyOrders.push(order);
            }
        }
        res.status(200).json(readyOrders);
    } catch (err) {
        res.status(500).send("Error connecting to database: " + err);
    }
});

router.get('/next/:id', async (req, res) => {
    try {
        await client.connect();
        const db = client.db(DB_NAME);
        const collection = db.collection(keys.ORDER_COLLECTION_NAME);

        collection.findOne({ id: Number(req.params.id) })
        .then ((order) => {
            const newPart = order.part + 1;
            collection.updateOne({ id: Number(req.params.id) }, { $set: { part: newPart, date: new Date().toISOString() } })
            .then(() => {
                res.status(200).send();
            }).catch(err => {
                res.status(500).send("Error updating order in database : " + err);
            });
        }).catch(err => {
            res.status(500).send("Error reading order from database : " + err);
        });
        
    } catch (err) {
        res.status(500).send("Error connecting to database: " + err);
    }
});


module.exports = router;