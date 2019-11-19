'use strict';
const request = require('supertest');
const express = require('express');
const jwt = require('jsonwebtoken');
const verifyJWTToken = require('./middlewares/verify-token');

const secret = 'secret';
const verifyCredentials = verifyJWTToken(secret);
const app = express().get('/', verifyCredentials, (req, res) => {
    res.send("Success!");
});

test('responds with 401 with no Authorization header', () => {
    return request(app)
        .get('/')
        .expect(401);
});

test('responds with 400 with blank authorization header', () => {
    return request(app)
        .get('/')
        .set('Authorization', '')
        .expect(400);
});

test('responds with 401 with \'Authorization: "Bearer"\'', () => {
    return request(app)
        .get('/')
        .set('Authorization', 'Bearer')
        .expect(401, "Invalid token submitted.");
});

test('responds with 200 with valid token', () => {
    const claim = {
        id: 0,
        firstname: 'first',
        lastName: 'last',
    };
    const token = jwt.sign(claim, secret);
    return request(app)
        .get('/')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);
});

