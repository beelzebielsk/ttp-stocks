'use strict';

const express = require('express');
const allowCors = require('./middlewares/cors');
const models = require('./models')
const api_router = require('./api-router');

const PORT = process.env.PORT || 8000;
const app = express()

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Headers", 
        "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    next();
});
app.use(allowCors);
app.use('/api', api_router);

models.sequelize.sync({force: false})
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server is up and running on port: ${PORT}`)
        })
    })
    .catch(() => {
            console.log(`Error, server is not running.`)
    })
