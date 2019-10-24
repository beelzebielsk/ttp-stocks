'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const models = require('./models')
const validateJSONFields = require('./middlewares/validate-json-fields');
const verifyJWTToken = require('./middlewares/verify-token');

const router = express.Router();

// This will only parse when the request's Content-Type is
// application/json
router.use(bodyParser.json());
router.param('userId', (req, res, next, id) => {
    req.userId = parseInt(req.params.userId);
    next();
});

/* Response codes:
 * - 400, Bad Request: Missing data, malformed syntax. I shouldn't
 *   have to worry about syntax.
 *      - Anything that fails validateJSONFields
 *          - Incomplete info POST /login
 *          - Incomplete info POST /transaction
 * - 401, Unauthorized: I will use this exclusively to mean that a
 *   client has not provided correct credentials for the action that
 *   they're taking. Sign in failed, or they're accessing a privileged
 *   resource without credentials.
 *      - POST /login: Bad credentials sent.
 *      - Any of the GET routes which should need credentials. So
 *        authenticating middleware is going to send this error when
 *        the token is no good, or the claims don't match.
 * - 403, Forbidden: When someone isn't authorized to perform the
 *   operation they requested. I will use this exclusively to mean
 *   that a user has credentials, but not the right kind. When they're
 *   not the user who can perform the action
 *      - Any of the GET routes which should only be available to a
 *        particular user. (not implemented)
 * - 404, Not Found: When nothing matches the request URI. Express
 *   should handle this for me. I have no reason to send this myself.
 * - 409, Conflict: When performing the request would result in some
 *   kind of conflict with an existing thing, like modifying an old
 *   version of something, or trying to create a duplicate record. I
 *   will use this exclusively for dupes of any kind.
 *      - POST /login: Create dupe user
 */
/* Errors:
 * - POST /login: Couldn't find user with that name and pass
 *   combination. Sends 401 which means auth failed. Makes sense,
 *   because this is more about block of authorization.
 * - POST /user: Creates a user. Ways this can fail
 *      / Sent incomplete information, like a blank email address. The
 *        validateJSONFields middleware handles this for now. Sends
 *        400 because... the request is missing information.
 *      / Sent invalid information, like the email is not an email.
 *        Frontend will handled this for now.
 *      / Dupe email address. Apprently 403 and 409 fits this
 *        perfectly.  Create dupe record is stated in the description.
 *        I will use 409.
 * - GET /user/:userId: Gives user information
 *      / Someone is not authorized to get the information. Only the
 *        user themselves should be capable of getting user
 *        information.
 *      - The user with :userId doesn't exist.
 *      - Some DB error which I'd know nothing about.
 * - POST /transaction: Creates a new transaction.
 *      / The required JSON fields aren't there.
 *      / Not authorized at all.
 *      / Not the same user as is in userId.
 *      - The user with doesn't exist.
 *      - Some DB error which I'd know nothing about.
 * - GET /transaction/:userId: Gets all transactions associated with
 *   that user.
 *      / Not authorized at all.
 *      / Not the same user as is in userId.
 *      - The user with :userId doesn't exist.
 * - GET /stocks/:userId: Gets all owned stocks associated with that
 *   user.
 *      / Not authorized at all.
 *      / Not the same user as is in userId.
 *      - The user with :userId doesn't exist.
 */
//FIXME: Currently, both back and frontend have a preshared
//secret which is stored in the source of each file. Change backend to
//generate a private/public key pair and make api endpoint to get the
//public key.
const secret = 'secret';
//const verifyCredentials = verifyJWTToken(secret);
const verifyCredentials = (req, res, next) => { next(); }

router.post('/login', validateJSONFields(['email', 'password']));
router.post('/login', async (req, res) => {
    console.log('req.body', req.body);
    const {email, password} = req.body;

    const user = await models.user.findOne({
        where: {email}
    });
    if (user === null) {
        res.status(401).send("No user with that email and password exists.");
        return;
    }
    if (!(await bcrypt.compare(password, user.password))) {
        res.status(401).send("No user with that email and password exists.");
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
router.post('/user', validateJSONFields([
    'email', 'password', 'firstName', 'lastName'
]));
router.post('/user', async (req, res) => {
    const {email, password, firstName, lastName} = req.body;
    try {
        const hash = await bcrypt.hash(password, 10);
        const dbResult = await models.user.create({
            email, password: hash, firstName, lastName
        });
        console.log(dbResult);
        res.status(200).end();
    } catch(err) {
        console.error("error type:", err.name);
        if (err.name === 'SequelizeUniqueConstraintError') {
            res.status(409).send("User with this email already exists");
        }
        //TODO: What do I do with response here?
    }
});

router.get('/user/:userId', verifyCredentials, async (req, res) => {
    const dbResult = await models.user.findByPk(req.userId);
    if (dbResult === null) {
        res.status(404).end;
    }
    res.status(200).json(dbResult);
    //TODO: What other errors can occur from find? 
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
router.post('/transaction', validateJSONFields([
    'tickerName', 'numStocks', 'price', 'userId'
]));
router.post('/transaction', verifyCredentials, async (req, res) => {
    const {tickerName, numStocks, price, userId} = req.body;
    console.log('user id:', userId);
    const transaction = await models.sequelize.transaction();
    try {
        const user = await models.user.findByPk(userId);
        if (user.balance < price) {
            res.status(403).send("Not enough money for transaction.");
            return;
        }
        await user.update(
            {balance: user.balance - price},
            {fields: ['balance'], transaction});
        const record = {
            tickerName, numStocks, price, userId
        };
        console.log('record to enter:', record);
        await models.transaction.create(record, {transaction});
        const stockBalance = await models.ownedStock.findOne({
            where: {tickerName, userId}
        });
        //console.log('stock balance', stockBalance);
        if (stockBalance === null) {
            await models.ownedStock.create({
                tickerName, numStocks, userId
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
router.get('/transaction/:userId', verifyCredentials, async (req, res) => {
    const transactions = await models.transaction.findAll({
        where: {userId: req.userId},
    });
    res.json(transactions);
});

//FIXME: This should only be available to the authenticated user with
//the given id.
router.get('/stocks/:userId', verifyCredentials, async (req, res) => {
    const transactions = await models.ownedStock.findAll({
        where: {userId: req.userId},
    });
    res.json(transactions);
});

module.exports = router;
