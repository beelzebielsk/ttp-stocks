'use strict'

const express = require('express');
//const bodyParser = require('body-parser');
const models = require('./models')
const jwt = require('jsonwebtoken');
const PORT = process.env.PORT || 8000;
const app = express()

app.get('/', (req, res) => {
    res.send('Hello, world!');
});

function putCORSHeaders(response) {
    response.header("Access-Control-Allow-Origin", "*");
    response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
}

app.post('/login', (req, res) => {
    console.log(req);
    //FIXME: Currently, both back and frontend have a preshared
    //secret which is stored in the source of each file.
    const secret = 'secret';
    //FIXME: Accept user information through post parameters, and
    //search for user in users database, and return a token through
    //this.
    const token = jwt.sign({id: 1, firstName: 'Mikey', lastName: 'Mike'}, secret);
    putCORSHeaders(res);
    res.header('Authorization', `Bearer ${token}`);
    res.send("Hello World!");
    /* res.send can only be used once.
    res.send("Hello");
    res.send(" World!");
    res.end();
    */
});

app.use((req, res, next) => {
    console.log("first: I'm called all the time.");
    next();
    console.log("first: I return.");
});

app.get('/stack/test', (req, res, next) => {
    console.log("second: I'm called, and handle exactly GET /stack/test only.");
    next();
    console.log("second: I return.");
});

app.use('/stack', (req, res, next) => {
    console.log("third: I'm called, and handle any request with /stack as prefix.");
    next();
    console.log("third: I return.");
});

app.get('/stack', (req, res, next) => {
    console.log("3.5: I'm called, and handle exactly GET /stack only.");
    next();
    console.log("3.5: I return.");
});

app.use((req, res, next) => {
    console.log("fourth: I'm called all the time.");
    next();
    console.log("fourth: I return.");
});

app.get('/stack/test', (req, res, next) => {
    console.log("fifth: I'm called, and handle exactly GET /stack/test only.");
    next();
    console.log("fifth: I return.");
});

app.get('/stack/test', (req, res, next) => {
    console.log("sixth: I'm called, and handle exactly GET /stack/test only.");
    next();
    console.log("sixth: I return.");
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
