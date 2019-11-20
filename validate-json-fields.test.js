'use strict';

const request = require('supertest');
const express = require('express');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');

const validateJSONFields = require('./middlewares/validate-json-fields');


function makeAppWithJSONValidator(fields) {
    return (express()
        .use(bodyParser.json())
        .use(validateJSONFields(fields))
        .get( '/', (req, res) => {
            res.send("Success!");
        }));
}

test('request whose type is not application/json returns 200', () => {
    const app = makeAppWithJSONValidator(['fieldOne']);
    return request(app)
        .get('/')
        .expect(200);
});

test('request with a missing field returns 400', () => {
    const app = makeAppWithJSONValidator(['fieldOne']);
    return request(app)
        .get('/')
        .set('content-type', 'application/json')
        .expect(400);
});
