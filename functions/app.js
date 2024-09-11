const express = require('express');
const cors = require('cors');
const app = express();

// const foolApi = require('./api-routes/fool/fool');
app.use(cors({ origin: true }));
app.use(express.json());

// Use the routers for user and product routes
//app.use('/users', usersRouter);
//app.use('/products', productsRouter);

// app.use('/foolapi',require('./api-routes/fool'));
//console.log(foolApi)
//console.log(app)

module.exports = app

/*
const express = require('express');
const usersRouter = require('./routes/users');
const productsRouter = require('./routes/products');
const app = express();

// Middleware to parse JSON requests
app.use(express.json());

// Use routers for user and product routes
app.use('/users', usersRouter);
app.use('/products', productsRouter);

module.exports = app;
*/