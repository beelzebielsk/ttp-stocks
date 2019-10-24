'use strict';
require('dotenv').config() // get environment variables from .env file using dotenv

module.exports = {
    "development": {
        "dialect": "postgres",
        "database" : process.env.DB_NAME,
        "username" : process.env.DB_USERNAME,
        "password" : process.env.DB_PASSWORD,
    },
    "test": {
        "dialect": "postgres",
        "database" : process.env.DB_NAME,
        "username" : process.env.DB_USERNAME,
        "password" : process.env.DB_PASSWORD,
    },
    "production": {
        "dialect": "postgres",
        "use_env_variable" : "DATABASE_URL"
    }
}
