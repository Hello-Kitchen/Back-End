var express = require('express');
var router = express.Router();

var detail = require('./api/detail.js');
var food = require('./api/food.js');
var food_category = require('./api/foodCategory.js');
var food_ordered = require('./api/foodOrdered.js');
var ingredient = require('./api/ingredient.js');
var order = require('./api/order.js');
var user = require('./api/user.js');

router.get('/', (req, res) => {
    res.send("Welcome to the API. Available endpoints are /api/users, /api/orders, /api/details, /api/foods, /api/foodCategories, /api/foodOrdered, /api/foodCategory.");
});

router.use('/detail', detail);
router.use('/food', food);
router.use('/food_category', food_category);
router.use('/food_ordered', food_ordered);
router.use('/ingredient', ingredient);
router.use('/order', order);
router.use('/users', user);

module.exports = router;
