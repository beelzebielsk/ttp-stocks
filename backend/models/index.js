'use strict';
    
const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const env = process.env.NODE_ENV || 'development';
const basename = path.basename(__filename);

/*Source:
 * <https://sequelize.readthedocs.io/en/1.7.0/articles/heroku/#introduction>
 */
if (!global.hasOwnProperty('db')) {
    const db = {};

    let sequelize;
    if (process.env.DATABASE_URL) {
        console.log("DB URL from models/index.js:", process.env.DATABASE_URL);
        sequelize = new Sequelize(process.env.DATABASE_URL)
    } else {
        sequelize = initSequelizeFromConfig();
    }

    fs
        .readdirSync(__dirname)
        .filter(file => {
            return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
        })
        .forEach(file => {
            const model = sequelize['import'](path.join(__dirname, file));
            db[model.name] = model;
        });

    Object.keys(db).forEach(modelName => {
        if (db[modelName].associate) {
            db[modelName].associate(db);
        }
    });

    db.sequelize = sequelize;
    db.Sequelize = Sequelize;

    global.db = db;
}

module.exports = global.db

function initSequelizeFromConfig() {
    let sequelize = null;
    const config = require(__dirname + '/../config/config.js')[env];
    if (config.use_env_variable) {
        sequelize = new Sequelize(process.env[config.use_env_variable], config);
    } else {
        sequelize = new Sequelize(config.database, config.username, config.password, config);
    }

    return sequelize;
}
