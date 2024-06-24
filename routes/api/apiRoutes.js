module.exports = function(app){

    const keys = require("./keys.apiRoutes.js");

    const {MongoClient} = require('mongodb');
    const client = new MongoClient(keys.DB_URL, {serverSelectionTimeoutMS: 500});

    app.get('/api/', (req, res) => {
        res.send("Welcome to the API. Available endpoints are /api/users, /api/orders, /api/details, /api/foods, /api/foodCategories, /api/foodOrdered, /api/foodCategory.");
    });

    require('./user')(app, client);
    require('./order')(app, client);
    require('./detail')(app, client);
    require('./food')(app, client);
    require('./foodCategory')(app, client);
    require('./foodOrdered')(app, client);
    require('./foodCategory')(app, client);
}