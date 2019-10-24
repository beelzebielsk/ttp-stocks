'use strict';
try {
    require('dotenv').config() // get environment variables from .env file using dotenv
} catch (error) {
    if (!error.message.startsWith('Cannot find module')) {
        throw error;
    }
    const env = process.env.NODE_ENV || 'development';
    if (env !== 'production' && process.env.DB_NAME === undefined) {
        throw Error("Local database name not given when not in production.");
    }
}

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
