var expect  = require('chai').expect;
var request = require('request');

it('Main page status', function(done) {
    request('http://localhost:10000' , function(error, response, body) {
        expect(response.statusCode).to.equal(200);
        done();
    });
});

it('Search page status', function(done) {
    request('http://localhost:10000/search.html' , function(error, response, body) {
        expect(response.statusCode).to.equal(200);
        done();
    });
});

it('History page status', function(done) {
    request('http://localhost:10000/history.html' , function(error, response, body) {
        expect(response.statusCode).to.equal(200);
        done();
    });
});

it('Data Dashboard page status', function(done) {
    request('http://localhost:10000/dashboard.html' , function(error, response, body) {
        expect(response.statusCode).to.equal(200);
        done();
    });
});