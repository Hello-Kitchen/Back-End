var express = require('express');
var router = express.Router();

router.get('/', (req, res) => {
    res.send("Welcome to the API. Available endpoints are /api/users, /api/orders, /api/details, /api/foods, /api/foodCategories, /api/foodOrdered, /api/foodCategory.");
});

router.use('/details', require('./api/detail.js'));
router.use('/food', require('./api/food.js'));
router.use('/food_category', require('./api/foodCategory.js'));
router.use('/food_ordered', require('./api/foodOrdered.js'));
router.use('/ingredient', require('./api/ingredient.js'));
router.use('/orders', require('./api/order.js'));
router.use('/users', require('./api/user.js'));
router.use('/restaurants', require('./api/restaurant.js'));
router.use('/pos', require('./api/pos.js'));
router.use('/login', require('./api/login.js'));

module.exports = router;
