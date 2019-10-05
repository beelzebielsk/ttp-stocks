import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import {fetchPortfolio, fetchTransactions} from './fetch-data'
import API_KEY from './iex-api-key'

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

function makeTimer() {
    let start = Date.now();
    return () => Date.now() - start;
}

function actionTimer() {
    let start = Date.now();
    return (actionName) => {
        console.log(`${actionName} @ ${Date.now() - start}ms`);
    }
}

/**
 * Renders a stock, given its name and amount.
 * @prop {int} numStocks - The number of stocks owned
 * @prop {string} tickerName - The ticker name of the company.
 * @prop {float} open - The opening price of the day for the stock.
 * @prop {float} latestPrice - The latest price for the stock.
 */
function Stock(props) {
    let totalWorth = props.numStocks * props.latestPrice;
    let className = props.latestPrice < props.open ? "under" : (
                    props.latestPrice > props.open ? "over" : "same-price"
    );
    let percentChangePrice = (props.latestPrice - props.open) / props.open;
    return (
        <div className={className}>
            {props.numStocks} shares of {props.tickerName} is worth {" "}
            <Currency>{totalWorth}</Currency>.{" "}

            Changed by <Percent>{percentChangePrice}</Percent>
        </div>);
}

// TODO: Put in the correct precision for money.
function Currency(props) {
    return <span>${props.children}</span>
}

// TODO: Put in sensible precision for percent.
function Percent(props) {
    return <span>%{props.children}</span>
}

async function getQuote(tickerName) {
    let root = 'https://sandbox.iexapis.com/stable'
    let queryParams = new URLSearchParams({
            token : API_KEY,
            filter : 'open,latestPrice',
        });
    let url = `${root}/stock/${tickerName}/quote?${queryParams}`;
    //console.log(`url: ${url}`);
    return fetch(url, {
        method: 'GET',
        //mode: 'no-cors',
        headers: {
            'Content-Type' : 'application/json',
        },
    });
}

/* Are there any props to this? Should anything control what it
 * renders, aside from site state like user identity?
 */
class Portfolio extends React.Component {
    constructor(props) {
        super(props);
        this.state = {stocks : []};
        this.t = actionTimer();
    }

    /* TODO: Augment these with information from IEX: the opening
     * price and current price. */
    async componentDidMount() {
        await this.getStockInfo();
        //this.timerId = setInterval(this.getStockInfo.bind(this), 2000);
    }

    componentWillUnmount() {
        //clearInterval(this.timerId);
    }

    async getStockInfo() {
        this.t("Mounted");
        let stocks = await fetchPortfolio();
        this.t("Got stocks");
        // TODO: Handle errors in the fetch.
        let priceInfo = await Promise.all(
            stocks.map(s => {
                return getQuote(s.tickerName).then(response => response.json());
            }));
        this.t("Got price info");
        for (let i = 0; i < stocks.length; i++) {
            stocks[i] = {...stocks[i], ...priceInfo[i]};
        }
        this.setState({stocks});
    }

    render() {
        console.log("Start rendering.");
        if (this.state.stocks.length === 0) {
            return <div>Loading...</div>;
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

// ========================================

ReactDOM.render(
    <Portfolio />,
    document.getElementById('root')
);

