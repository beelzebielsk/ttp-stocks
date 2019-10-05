'use strict'

const express = require('express');
//const bodyParser = require('body-parser');
const PORT = process.env.PORT || 8000;
const app = express()
const db = require('./db')

app.get('/', (req, res) => {
    res.send('Hello, world!');
});

db.sequelize.sync({force: false})
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server is up and running on port: ${PORT}`)
        })
    })
    .catch(() => {
            console.log(`Error, server is not running.`)
    })
