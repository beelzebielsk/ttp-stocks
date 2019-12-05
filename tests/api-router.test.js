'use strict';
const request = require('supertest');
const express = require('express');
const apiRouter = require('../api-router');
const app = express().use('/api', apiRouter);
const models = require('../models');
const {exec} = require ('child_process');
const path = require('path');

const testUser = {
    email: 'mikeymike@funkybunch.com',
    password: 'password',
}

test('login without email and password gives 400', () => {
    return request(app)
        .post('/api/login')
        .expect(400);
});

test('login without email gives 400', () => {
    return request(app)
        .post('/api/login')
        .send({password: 'password'})
        .expect(400);
});

test('login without password gives 400', () => {
    return request(app)
        .post('/api/login')
        .send({email: 'email'})
        .expect(400);
});

test('login as test user gives 200', () => {
    return request(app)
        .post('/api/login')
        .send(testUser)
        .expect(200);
});

/*
 *test('login as test user gives 200 and correct token', () => {
 *    return request(app)
 *        .post('/api/login')
 *        .send(testUser)
 *        .expect(200);
 *});
 */

test('create user with not existing email gives 200 ' +
     'and user in db', () => {
});

test('create user with existing email gives 409', () => {
});

test('get existing user returns 200', () => {
})

test('get not existing user returns 404', () => {
})

test('transaction for too much money returns 403', () => {
});

test('transaction for non-existent user is not 200', () => {
});

test('transaction for enough money returns 200 ' +
     'and ownedStocks changed', () => {
});
