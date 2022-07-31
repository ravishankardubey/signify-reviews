const express = require('express');
const bodyParser = require('body-parser');
const appRouter = require('./app.router');
const MONGODB = require('../database/mongodb.config');
require('dotenv').config();

const app = express();

app.use(bodyParser.json({
    extended: true,
    limit: '5mb',
}));
app.use(bodyParser.urlencoded({
    extended: false,
    limit: '5mb',
}));

MONGODB.getConnection();

app.use(appRouter);

app.listen(process.env.PORT, () => console.log('Application Running on Port:', process.env.PORT));