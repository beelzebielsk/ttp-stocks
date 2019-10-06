'use strict'

const express = require('express');
//const bodyParser = require('body-parser');
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

//FIXME: Currently, both back and frontend have a preshared
//secret which is stored in the source of each file.
const secret = 'secret';

app.post('/login', (req, res) => {
    //FIXME: Accept user information through post parameters, and
    //search for user in users database, and return a token through
    //this.
    const token = jwt.sign({id: 1, firstName: 'Mikey', lastName: 'Mike'}, secret);
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
