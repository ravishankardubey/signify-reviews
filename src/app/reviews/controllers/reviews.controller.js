const reviewService = require('../services/reviews.service');

exports.saveBulkReviews = async (req, res, next) => {
    try {
        const reviews = req.body.reviews || [];
        const data = await reviewService.saveBulkReviews(reviews);

        return res.status(201).json({
            status: 201,
            message: "Reviews saved successfully."
        });
    } catch (e) {
        return res.status(500).json({
            status: 500,
            message: e.message
        });
    }
}

exports.saveReview = async (req, res, next) => {
    try {
        const review = req.body || {};
        review['reviewed_date'] = new Date();

        const data = await reviewService.saveReview(review);

        return res.status(201).json({
            status: 201,
            data: data,
            message: "Review saved successfully."
        });
    } catch (e) {
        return res.status(500).json({
            status: 500,
            message: e.message
        });
    }
}

exports.fetchReviews = async (req, res, next) => {
    try {
        const query = {
            // reviewed_date: isNaN(Date.parse(req.query.reviewed_date)) ? null : new Date(req.query.reviewed_date),
            reviewed_date: req.query.reviewed_date ? new Date(req.query.reviewed_date) : null,
            review_source: req.query.review_source || null,
            rating: Number(req.query.rating) || null
        };

        const data = await reviewService.fetchReviews(query);

        return res.status(200).json({
            status: 200,
            data: data,
            message: `Fetched ${data.length} reviews successfully.`
        });
    } catch (e) {
        return res.status(500).json({
            status: 500,
            message: e.message
        });
    }
}

exports.monthlyStoreAverageRating = async (req, res, next) => {
    try {
        const timezone = req.headers.timezone || "GMT";
        const storeName = req.params.storeName;

        const data = await reviewService.monthlyStoreAverageRating(timezone, storeName);

        return res.status(200).json({
            status: 200,
            data: data,
            message: `Fetched mothly avergae rating for ${storeName}`
        });
    } catch (e) {
        return res.status(500).json({
            status: 500,
            message: e.message
        });
    }
}

exports.fetchRatingCounts = async (req, res, next) => {
    try {
        const data = await reviewService.fetchRatingCounts();

        return res.status(200).json({
            status: 200,
            data: data,
            message: "Fetched rating counts successfully"
        });
    } catch (e) {
        return res.status(500).json({
            status: 500,
            message: e.message
        });
    }
}