const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../src/app/app');

//Assertion style
chai.should();
chai.use(chaiHttp);

describe('GET Generic route', () => {
    it("Welcome message on generic route", (done) => {
        chai.request(server)
            .get('/')
            .end((err, res) => {
                res.should.have.status(200);
                res.text.should.be.eq('Welcome to API Service V1 of Alexa reviews');
                done();
            })
    });
});