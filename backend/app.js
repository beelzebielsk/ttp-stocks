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

models.sequelize.sync({force: false})
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server is up and running on port: ${PORT}`)
        })
    })
    .catch(() => {
            console.log(`Error, server is not running.`)
    })
