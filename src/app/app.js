const express = require('express');
const bodyParser = require('body-parser');
const appRouter = require('./app.routes');
const MONGODB = require('../database/mongodb.config');
const CORS = require('cors');
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

app.options('*', CORS());
app.use(CORS());
app.use(appRouter);

async function main() {
    try {
        MONGODB.getConnection().then((db) => {
            console.log('Connected to MongoCloud');
            app.listen(process.env.PORT, () => console.log('Application Running on Port:', process.env.PORT));
        });
    } catch (e) {
        console.error(e);
    }
}

main();
module.exports = app;