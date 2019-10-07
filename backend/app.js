'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const models = require('./models')
const jwt = require('jsonwebtoken');
const PORT = process.env.PORT || 8000;
const app = express()

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", 
        "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    next();
});

/**
 * Given a list of field names, will check the request body of a JSON
 * request to see if all of the fields are there. If not, will report
 * the missing fields and give a 400 error response.
 *
 * Assumes bodyParser middleware already in place.
 */
function validateJSONFields(fields) {
    return (req, res, next) => {
        if (req.header['content-type'] !== 'application/json') {
            next();
        }
        console.log('json validator:', req.body);
        let missingFields = [];
        for (let field of fields) {
            if (req.body[field] === undefined) {
                missingFields.push(field);
            }
        }
        if (missingFields.length > 0) {
            res.status(400).send("Missing JSON fields in request: " +
                missingFields.join(", "));
        }
    };
}

// This will only parse when the request's Content-Type is
// application/json
app.use(bodyParser.json());

//FIXME: Currently, both back and frontend have a preshared
//secret which is stored in the source of each file.
const secret = 'secret';

app.post('/login', validateJSONFields(['email', 'password']));
app.post('/login', async (req, res) => {
    //FIXME: Accept user information through post parameters, and
    //search for user in users database, and return a token through
    //this.
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

/**
 * Create a new transaction. Return status 200 if successful, otherwise
 * return 400.
 *
 * Creates a new transaction and creates or updates the balance for
 * the same stock under that user's id. 
 *
 * FIXME: This should only be available to an authenticated user.
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
            companyName: tickerName, numStocks, price, UserId: userId
        };
        //console.log('record to enter:', record);
        await models.Transaction.create(record, {transaction});
        const stockBalance = await models.OwnedStock.findOne({
            where: {companyName: tickerName, userId}
        });
        //console.log('stock balance', stockBalance);
        if (stockBalance === null) {
            await models.OwnedStock.create({
                companyName: tickerName, numStocks, userId
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
app.get('/transaction/:id', async (req, res) => {
    const userId = parseInt(req.params.id);
    const transactions = await models.Transaction.findAll({
        where: {userId},
        attributes: {include: ['userId']},
    });
    res.json(transactions);
});

//FIXME: This should only be available to the authenticated user with
//the given id.
app.get('/stocks/:id', async (req, res) => {
    const userId = parseInt(req.params.id);
    const transactions = await models.OwnedStock.findAll({
        where: {userId},
        include: [models.User],
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
