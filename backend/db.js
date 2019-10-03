/* Use this to use sequelize utilities, like creating a db connection,
 * reference db data types during table defn.  */
const Sequelize = require('sequelize');
/* Use this to interact with db. Creating tables, querying/adding
 * data. */
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './db.sqlite'
});

sequelize
    .authenticate()
    .then(() => {
        console.log('You connected to the database!');
    })
    .catch(() => {
        console.log('Some error happened while connecting to database!');
    })

const User = sequelize.define('user', {
    firstName: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    lastName: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    email: {
        type: Sequelize.STRING,
        allowNull: false,
        /* Email belongs to one account, not more */
        unique: true,
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    balance: {
        type: Sequelize.DOUBLE,
        allowNull: false,
        defaultValue: 5000,
    }
});

/* This should have user id as fkey */
const Transaction = sequelize.define('transaction', {
    companyName : {
        type: Sequelize.STRING,
        allowNull: false,
    },
    numStocks : {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
    /* Full price of the whole transaction */
    price : {
        type: Sequelize.DOUBLE,
        allowNull: false,
    }
});

/* This should have user id as fkey */
const OwnedStock = sequelize.define('OwnedStock', {
    companyName : {
        type: Sequelize.STRING,
        allowNull: false,
    },
    numStocks : {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
});

User.hasMany(Transaction);
User.hasMany(OwnedStock);
Transaction.belongsTo(User);
OwnedStock.belongsTo(User);

sequelize.sync();
