const reviewsModel = require('../../models/reviews.model');

exports.saveBulkReviews = async (reviews) => {
    try {
        return await reviewsModel.insertMany(reviews);
    } catch (e) {
        throw Error(e.errmsg || e.message || 'Error occured while bulk storing the reviews');
    }
}

exports.saveReview = async (reviews) => {
    try {
        const reviewData = await reviewsModel(reviews).save();
        return reviewData;
    } catch (e) {
        throw Error(e.errmsg || e.message || 'Error occured while saving the review');
    }
}

exports.fetchReviews = async (queries) => {
    try {
        const match = {
            $match: {
                ...queries.reviewed_date && {
                    reviewed_date: queries.reviewed_date
                },
                ...queries.review_source && {
                    review_source: queries.review_source
                },
                ...queries.rating && {
                    rating: queries.rating
                }
            }
        };

        const project = {
            $project: {
                _id: 0,
                __v: 0
            }
        };

        return await reviewsModel.aggregate([match, project]);

    } catch (e) {
        throw Error(e.errmsg || e.message || 'Error occured fetching reviews');
    }
}

exports.monthlyStoreAverageRating = async (timezone, storeName) => {
    try {

        const match = {
            $match: {
                review_source: storeName
            }
        }

        const group = {
            $group: {
                _id: {
                    $dateToString: {
                        format: "%Y-%m",
                        date: "$reviewed_date",
                        timezone: timezone
                    }
                },
                count: {
                    $sum: 1
                },
                avg: {
                    $avg: '$rating'
                }
            }
        };

        const project = {
            $project: {
                _id: 0,
                date: "$_id",
                count: 1,
                average: {
                    $round: ["$avg", 2]
                }
            }
        };

        const sort = {
            $sort: {
                "date": 1
            }
        };

        const ratings = await reviewsModel.aggregate([match, group, project, sort]);

        return {
            store: storeName,
            monthlyAverage: ratings
        };

    } catch (e) {
        throw Error(e.errmsg || e.message || 'Error occured fetching mothly store average ratings');
    }
}

exports.fetchRatingCounts = async (reviews) => {
    try {
        const group = {
            $group: {
                _id: "$rating",
                count: {
                    $sum: 1
                }
            }
        };

        const project = {
            $project: {
                _id: 0,
                rating: "$_id",
                count: 1
            }
        };

        const sort = {
            $sort: {
                "rating": -1
            }
        };

        return await reviewsModel.aggregate([group, project, sort]);
    } catch (e) {
        throw Error(e.errmsg || e.message || 'Error occured while saving the review');
    }
}