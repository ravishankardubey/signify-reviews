const express = require('express');
const appRouter = express.Router();
const reviewsRouter = require('./reviews/routes/reviews.routes');

// Routers

appRouter.use('/api/reviews', reviewsRouter);

appRouter.use('/', function (req, res, next) {
    res.status(200).send('Welcome to API Service V1 of Alexa reviews');
});

module.exports = appRouter;