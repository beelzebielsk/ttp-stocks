import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

/* Questions:
 * - Where should user identity be stored? A global variable? Some
 *   sort of site-wide state?
 */
/* Transactions page:
 * - I'm going to display a list of transactions. Would be nice to
 *   have a component which takes a trans list and renders them.
 *
 * Portfolio page:
 * - I'm going to display a list of stock balances, their current
 *   prices, and do some styling when compared to their opening
 *   prices. I will want to work with all of this data at once, and
 *   when any of this data changes, I should re-render things. So I
 *   should keep the stock data as state, and I should hold it all in
 *   some parent component which uses other components to render that
 *   information.
 * - Stock balances are going to come from the database. I can use the
 *   id of the element as a key, since I'm gonna do some mapping.
 *   Vague security concerns about this. I should get {id,
 *   companyName, amount, updatedAt} from my API for each owned stock,
 *   where amount is the total amt owned by the user. UpdatedAt is in
 *   case I want to display the stocks in the order they were most
 *   recently purchased.
 * - When I first render the portfolio page, I should fetch the user's
 *   portfolio and I should then use a component to display the
 *   portfolio.
 */

const testPortfolio = [
    {
        id: 1,
        tickerName: 'msft',
        numStocks: 300,
        updatedAt: new Date('2019-10-03T23:41:19.634Z'),
    },
    {
        id: 2,
        tickerName: 'aapl',
        numStocks: 1000,
        updatedAt: new Date('2019-10-03T23:41:19.634Z'),
    }
]

const testTransactions = [
    {
        id: 1,
        tickerName: 'msft',
        numStocks: 100,
        price: 100,
        createdAt: new Date('2019-01-01T05:00:00.000Z'),
        updatedAt: new Date('2019-01-01T05:00:00.000Z'),
    },
    {
        id: 2,
        tickerName: 'msft',
        numStocks: 200,
        price: 100,
        createdAt: new Date('2019-01-01T05:00:01.000Z'),
        updatedAt: new Date('2019-01-01T05:00:01.000Z'),
    },
    {
        id: 3,
        tickerName: 'aapl',
        numStocks: 1000,
        price: 50,
        createdAt: new Date('2019-01-01T05:00:02.000Z'),
        updatedAt: new Date('2019-01-01T05:00:02.000Z'),
    }
];

/* Delay performing an action by some # of ms. The action is 0 arg cb.
 * Will return a promise which is resolved when action is finished.
 * The resolved value will the be the result of the action, if any.
 */
function delay(action, ms) {
    return new Promise((resolve, reject) => {
        let delayed = () => resolve(action());
        setTimeout(delayed, ms);
    });
}

const UNIVERSAL_DELAY = 2000;
/* TODO: May have to put user identity as an argument to these two.
 */
async function fetchPortfolio() {
    return delay(() => testPortfolio, UNIVERSAL_DELAY);
}

async function fetchTransactions() {
    return delay(() => testTransactions, UNIVERSAL_DELAY);
}

/**
 * Renders a stock, given its name and amount.
 */
function Stock(props) {
    return <div>{props.numStocks} of {props.tickerName}</div>;
}
/* Are there any props to this? Should anything control what it
 * renders, aside from site state like user identity?
 */
class Portfolio extends React.Component {
    constructor(props) {
        super(props);
        this.state = {stocks : []};
    }

    async componentDidMount() {
        let stocks = await fetchPortfolio();
        this.setState({stocks});
    }

    render() {
        console.log("Start rendering.");
        if (this.state.stocks.length === 0) {
            return <div></div>;
        }
        let stocks = this.state.stocks.map(s => (
            <Stock key={s.id} {...s} />
        ));
        return (
            <div>
            {stocks}
            </div>
        );
    }
}

function makeTimer() {
    let start = Date.now();
    return () => Date.now() - start;
}

class Clock extends React.Component {
    constructor(props) {
        super(props);
        this.state = {date : new Date()};
        this.t = makeTimer();
    }

    updateClock = () => {
        this.setState({date : new Date()});
    }
    /* Fires after the CLock component has been rendered to the DOM.
     * So I suppose this is kinda like onload for Clock. */
    componentDidMount() {
        /* It is safe to add properties to this so long as it is not
         * data that will flow down to other elements, and so long as
         * it shouldn't control whether Clock should rerender.
         */
        console.log(`Mount @ ${this.t()}ms`);
        this.timerId = setInterval(this.updateClock, 1000);
    }

    /* TODO: When does this fire? */
    componentWillUnmount() {
        console.log(`Unmount @ ${this.t()}ms`);
        clearInterval(this.timerId);
    }

    render() {
        console.log(`Render @ ${this.t()}ms`);
        return (
            <div>
            <h1>Hello, World!</h1>
            <h2>It is {this.state.date.toLocaleTimeString()}</h2>
            </div>
        );
    }
}

ReactDOM.render(
    <Portfolio />,
    document.getElementById('root')
);

// ========================================

