var express = require('express');
var router = express.Router();
const keys = require("./keys.apiRoutes.js");
const {client, DB_NAME} = require('../../config/config.js');

router.get('/:id', (req, res) => {
    client.connect().then(client => {
        const db = client.db(DB_NAME);
        const collection = db.collection(keys.FOOD_CATEGORY_COLLECTION_NAME);
        var catData;
        var foodData;
        var detailData;
        var ingData;

        collection.find({ id_restaurant: Number(req.params.id) }).toArray().then(categories => {
            catData = categories;
        }).then(() => {
            const catIdList = [];
            catData.map((category) => {
                catIdList.push(category.id);
            });
            db.collection(keys.FOOD_COLLECTION_NAME).find({ id_category: {$in: catIdList} }).toArray().then(food => {
                foodData = food;
            }).then(() => {
                const detailIdList = [];
                const ingIdList = [];
                foodData.map((food) => {
                    if (food.details) {
                        food.details.map((id) => {
                            detailIdList.push(id);
                        });
                    }
                    if (food.ingredients) {
                        food.ingredients.map((id) => {
                            ingIdList.push(id);
                        });
                    }
                });
                db.collection(keys.DETAIL_COLLECTION_NAME).find({ id: {$in: detailIdList} }).toArray().then(detail => {
                    detailData = detail;
                }).then(() => {
                    db.collection(keys.INGREDIENT_COLLECTION_NAME).find({ id: {$in: ingIdList} }).toArray().then(ing => {
                        ingData = ing;
                    }).then(() => {
                        const resultDetail = foodData.map(food => {
                            return {
                                id: food.id,
                                name: food.name,
                                id_category: food.id_category,
                                price: food.price,
                                details: detailData.filter(detail => food.details != null && food.details.includes(detail.id)),
                                ingredients: ingData.filter(ing => food.ingredients != null && food.ingredients.includes(ing.id))
                            };
                        });
                        const resultFood = catData.map(category => {
                            return {
                                id: category.id,
                                name: category.name,
                                food: resultDetail.filter(food => food.id_category === category.id)
                            };
                        });
                        res.status(200).send(resultFood);
                    });
                });
            });
        }).catch(err => {
            res.status(500).send("Error reading restaurant from database : " + err);
        });
    }).catch(err => {
        res.status(500).send("Error connecting to database : " + err);
    });
});

module.exports = router;