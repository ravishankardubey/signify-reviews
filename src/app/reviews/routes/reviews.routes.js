const express = require('express');
const reviewRouter = express.Router();
const reviewControllers = require('../controllers/reviews.controller');

// Below API is written just for initial use of the application to backfill the JSON data.
reviewRouter.post('/bulk/save', reviewControllers.saveBulkReviews);

reviewRouter.post('/save', reviewControllers.saveReview);
reviewRouter.get('/fetch', reviewControllers.fetchReviews);
reviewRouter.get('/:storeName/average', reviewControllers.monthlyStoreAverageRating);
reviewRouter.get('/count', reviewControllers.fetchRatingCounts);


module.exports = reviewRouter;