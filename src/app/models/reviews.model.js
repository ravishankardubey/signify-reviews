const mongoose = require('mongoose');

const reviewsSchema = new mongoose.Schema({
    review: {
        type: String,
        required: true,
        trim: true
    },
    author: {
        type: String,
        required: false,
        trim: true
    },
    review_source: {
        type: String,
        required: true,
        trim: true
    },
    rating: {
        type: Number,
        required: true,
        min: 1
    },
    title: {
        type: String,
        required: false,
        trim: true
    },
    product_name: {
        type: String,
        required: true,
        trim: true
    },
    reviewed_date: {
        type: Date,
        required: true,
        trim: true
    }
});

const reviewsModel = mongoose.model('reviews', reviewsSchema);
module.exports = reviewsModel;