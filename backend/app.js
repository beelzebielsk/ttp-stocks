'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const models = require('./models')
const allowCors = require('./middlewares/cors');
const validateJSONFields = require('./middlewares/validate-json-fields');

const PORT = process.env.PORT || 8000;
const app = express()

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Headers", 
        "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    next();
});
app.use(allowCors);
// This will only parse when the request's Content-Type is
// application/json
app.use(bodyParser.json());
app.param('userId', (req, res, next, id) => {
    req.userId = parseInt(req.params.userId);
    next();
});

//FIXME: Currently, both back and frontend have a preshared
//secret which is stored in the source of each file.
const secret = 'secret';

app.post('/login', validateJSONFields(['email', 'password']));
app.post('/login', async (req, res) => {
    const {email, password} = req.body;

    const user = await models.User.findOne({
        where: {email, password}
    });
    if (user === null) {
        res.status(401).send("No user with that name and password exists.");
        return;
    }
    const token = jwt.sign({
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName
    }, secret);
    res.status(200).send(token);
});

/**
 * Create a new user. Return status 200 if successful, otherwise
 * return 400.
 */
app.post('/user', validateJSONFields([
    'email', 'password', 'firstName', 'lastName'
]));
app.post('/user', async (req, res) => {
    const {email, password, firstName, lastName} = req.body;
    console.log(req.body);
    try {
        const dbResult = await models.User.create({email, password, firstName, lastName});
        console.log(dbResult);
        res.status(200).end();
    } catch(err) {
        console.error("error type:", err.name);
        if (err.name === 'SequelizeUniqueConstraintError') {
            res.status(400).send("User with this email already exists");
        }
        //TODO: What do I do with response here?
    }
});

app.get('/user/:userId', async (req, res) => {
    try {
        const dbResult = await models.User.findByPk(req.userId);
        res.status(200).json(dbResult);
    } catch(err) {
        console.error("error type:", err.name);
        if (err.name === 'SequelizeUniqueConstraintError') {
            res.status(400).send("User with this email already exists");
        }
        //TODO: What do I do with response here?
    }
});

/**
 * Create a new transaction. Return status 200 if successful, otherwise
 * return 400.
 *
 * Creates a new transaction and creates or updates the balance for
 * the same stock under that user's id. 
 *
 * FIXME: This should only be available to an authenticated user.
 * FIXME: Reduce a user's balance by the price of the transaction.
 */
app.post('/transaction', validateJSONFields([
    'tickerName', 'numStocks', 'price', 'userId'
]));
app.post('/transaction', async (req, res) => {
    const {tickerName, numStocks, price, userId} = req.body;
    console.log('user id:', userId);
    const transaction = await models.sequelize.transaction();
    try {
        // Q: Why did I have to capitalize the first U in userId here to
        // make this work?
        const record = {
            tickerName, numStocks, price, UserId: userId
        };
        //console.log('record to enter:', record);
        await models.Transaction.create(record, {transaction});
        const stockBalance = await models.OwnedStock.findOne({
            where: {tickerName, userId}
        });
        //console.log('stock balance', stockBalance);
        if (stockBalance === null) {
            // Q: Why did I have to capitalize the first U in userId
            // here to make this work?
            await models.OwnedStock.create({
                tickerName, numStocks, UserId: userId
            }, {transaction});
        } else {
            await stockBalance.update(
                {numStocks: stockBalance.numStocks + numStocks},
                {fields: ['numStocks'], transaction});
        }
        await transaction.commit();
        res.status(200).end();
    } catch(err) {
        console.error(err);
        await transaction.rollback();
        res.status(400).send(err.stack);
    }
});

//FIXME: This should only be available to the authenticated user with
//the given id.
app.get('/transaction/:userId', async (req, res) => {
    const transactions = await models.Transaction.findAll({
        where: {userId: req.userId},
    });
    res.json(transactions);
});

//FIXME: This should only be available to the authenticated user with
//the given id.
app.get('/stocks/:userId', async (req, res) => {
    const transactions = await models.OwnedStock.findAll({
        where: {userId: req.userId},
    });
    res.json(transactions);
});

models.sequelize.sync({force: false})
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server is up and running on port: ${PORT}`)
        })
    })
    .catch(() => {
            console.log(`Error, server is not running.`)
    })
