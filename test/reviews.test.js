const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../src/app/app');
const MONGODB = require('../src/database/mongodb.config');

//Assertion style
chai.should();
// chai.expect();
const expect = chai.expect;
chai.use(chaiHttp);


describe('REVIEWS: APIs', () => {

    // before(function (done) {
    //     // mongoose.connect('mongodb://localhost/test', done);
    //     MONGODB.getConnection();

    //     done();

    // });

    describe('Bulk Save API', () => {
        it('Bulk Save Reviews for initial load', (done) => {
            const reviews = [{
                    "review": "REview from test case",
                    "author": "RSD",
                    "review_source": "iTunes",
                    "rating": 3,
                    "title": "Mocha Chai 1",
                    "product_name": "Amazon Alexa"
                },
                {
                    "review": "Review from test case",
                    "author": "RSD",
                    "review_source": "GooglePlayStore",
                    "rating": 3,
                    "title": "Mocha Chai 1",
                    "product_name": "Amazon Alexa"
                }
            ];

            chai.request(server)
                .post('/api/reviews/bulk/save')
                .send(reviews)
                .end((err, res) => {
                    res.should.have.status(201);
                    res.body.should.have.property('status').eq(201);
                    res.body.should.have.property('message').eq('Reviews saved successfully.');
                    done();
                });
        });


        // it('Bulk Save Reviews : Wrong Input', (done) => {
        //     const reviewsN = [{
        //         "review": "REview from test case",
        //         "author": "RSD",
        //         "review_source": "iTunes",
        //         "rating": 0,
        //         "title": "Mocha Chai 1",
        //         "product_name": "Amazon Alexa"
        //     }];

        //     chai.request(server)
        //         .post('/api/reviews/bulk/save')
        //         .send(reviewsN)
        //         .end((err, res) => {
        //             // console.log(res);
        //             // console.log(err);
        //             // res.should.have.status(500);
        //             res.body.should.have.property('status').eq(500);
        //             // res.body.should.have.property('message').eq('Reviews saved successfully.');
        //             done();
        //         });
        // });
    });

    describe('Save API', () => {
        it('Review save API', (done) => {
            const review = {
                "review": "REview from test case",
                "author": "RSD",
                "review_source": "iTunes",
                "rating": 3,
                "title": "Mocha Chai 1",
                "product_name": "Amazon Alexa"
            };

            chai.request(server)
                .post('/api/reviews/save')
                .send(review)
                .end((err, res) => {
                    res.should.have.status(201);
                    res.body.should.have.property('status').eq(201);
                    res.body.should.have.property('message').eq('Review saved successfully.');
                    done();
                });
        });

        it('Review save API : Wrong Input', (done) => {
            const review = {
                "review": "",
                "author": "RSD",
                "review_source": "iTunes",
                "rating": 3,
                "title": "Mocha Chai 1",
                "product_name": "Amazon Alexa"
            };

            chai.request(server)
                .post('/api/reviews/save')
                .send(review)
                .end((err, res) => {
                    res.should.have.status(500);
                    res.body.should.have.property('status').eq(500);
                    res.body.should.have.property('message').eq('reviews validation failed: review: Path `review` is required.');
                    done();
                });
        });
    });

    describe('Fetch Reviews API', () => {
        it('Fetch only 5 reviews', (done) => {
            chai.request(server)
                .get('/api/reviews/fetch?page=1&size=5')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('status').eq(200);
                    res.body.should.have.property('message').eq('Fetched 5 reviews successfully.');
                    res.body.should.have.property('data');
                    res.body.data.should.be.an('array');
                    res.body.data.length.should.be.eq(5);
                    done();
                });
        });

        it('Fetch reviews for 6', (done) => {
            chai.request(server)
                .get('/api/reviews/fetch?rating=6')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('status').eq(200);
                    res.body.should.have.property('message').eq('Fetched 0 reviews successfully.');
                    res.body.should.have.property('data');
                    res.body.data.should.be.an('array');
                    res.body.data.length.should.be.eq(0);
                    done();
                });
        });

        it('Fetch reviews for GooglePlayStore, and not for iTunes', (done) => {
            const expectedStore = 'GooglePlayStore';
            const unexptedStore = 'iTunes';
            const page = 1;
            const size = 20;

            chai.request(server)
                .get(`/api/reviews/fetch?review_source=${expectedStore}&page=${page}&size=${size}`)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('status').eq(200);
                    res.body.should.have.property('message').eq(`Fetched ${size} reviews successfully.`);
                    res.body.should.have.property('data');
                    res.body.data.should.be.an('array');
                    expect(res.body.data.filter((e) => e['review_source'] === expectedStore).length === size ? true : false).to.be.true;
                    expect(res.body.data.filter((e) => e['review_source'] !== unexptedStore).length === size ? true : false).to.be.true;
                    done();
                });
        });

        // it('Fetch reviews in ascending order', (done) => {
        //     const sortBy = 'reviewed_date';
        //     const sortOrder = 'DESC';
        //     const page = 10;
        //     const size = 10;

        //     chai.request(server)
        //         .get(`/api/reviews/fetch?sortBy=${sortBy}&sortOrder=${sortOrder}&page=${page}&size=${size}`)
        //         .end((err, res) => {
        //             res.should.have.status(200);
        //             res.body.should.be.a('object');
        //             res.body.should.have.property('status').eq(200);
        //             res.body.should.have.property('message').eq(`Fetched ${size} reviews successfully.`);
        //             res.body.should.have.property('data');
        //             res.body.data.should.be.an('array');
        //             res.body.data.length.should.be.eq(size);

        //             const isSortedFn = (array) => {
        //                 for (let i = 1; i < array.length; i++) {
        //                     if (array[i] > array[i - 1]) {
        //                         return false;
        //                     }
        //                 }
        //                 return true;
        //             }
        //             expect(isSortedFn(res.body.data)).to.be.true;
        //             done();
        //         });
        // });
    });

    describe('Fetch Store average', () => {
        it('Fetch reviews for GooglePlayStore, and not for iTunes', (done) => {
            const store = 'GooglePlayStore';

            chai.request(server)
                .get(`/api/reviews/${store}/average`)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('status').eq(200);
                    res.body.should.have.property('message').eq(`Fetched mothly avergae rating for ${store}`);
                    res.body.should.have.property('data');
                    res.body.data.should.be.a('object');
                    res.body.data.should.have.property('monthlyAverage');
                    res.body.data.monthlyAverage[0].should.have.property('count');
                    res.body.data.monthlyAverage[0].should.have.property('date');
                    res.body.data.monthlyAverage[0].should.have.property('average');
                    expect(res.body.data.monthlyAverage[0]['average']).to.be.a('number')
                    done();
                });
        });

        it('Fetch reviews for GooglePlayStore, and not for iTunes', (done) => {
            const store = 'XYZ';

            chai.request(server)
                .get(`/api/reviews/${store}/average`)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('status').eq(200);
                    res.body.should.have.property('message').eq(`Fetched mothly avergae rating for ${store}`);
                    res.body.should.have.property('data');
                    res.body.data.should.be.a('object');
                    expect(res.body.data).to.have.property('monthlyAverage').which.is.an('array').and.have.lengthOf(0);
                    done();
                });
        });
    });

    describe('Rating Counts', () => {
        it('Fetch Rating count for all categories', (done) => {
            chai.request(server)
                .get(`/api/reviews/count`)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('status').eq(200);
                    res.body.should.have.property('message').eq('Fetched rating counts successfully');
                    expect(res.body).to.have.property('data').which.is.an('array').and.have.lengthOf(5);
                    expect(res.body.data[0]).to.have.property('rating').which.is.a('number').above(0);
                    expect(res.body.data[0]).to.have.property('count').which.is.a('number').above(0);
                    done();
                });
        });
    });


});