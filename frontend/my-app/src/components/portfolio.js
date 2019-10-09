import React from 'react';
import {OwnedStocks} from './owned-stocks';
import {StockPurchase} from './stock-purchase-form';
import {fetchPortfolio} from '../fetch-data';
import {getQuote} from '../iex-api';
import {Loading} from './loading';
import {Currency} from './number-display';
import {fetchBackend} from '../api';

/**
 * Render a user's portfolio of stocks.
 *
 * @prop {int} userId - The id of the currently logged-in user.
 */
export class Portfolio extends React.Component {
    constructor(props) {
        super(props);
        // When stocks is null, no fetch made yet.
        // If stocks is an array, then fetch made.
        this.state = {
            stocks : null,
            userBalance : null,
        };
        this.t = actionTimer();
        this.handlePurchase= this.handlePurchase.bind(this);
    }

    async getStockInfo() {
        this.t("Mounted");
        let stocks = await fetchPortfolio(this.props.userId);
        this.t("Got stocks");
        // TODO: Handle errors in the fetch.
        let priceInfo = await Promise.all(
            stocks.map(s => {
                return getQuote(s.tickerName);
            }));
        this.t("Got price info");
        for (let i = 0; i < stocks.length; i++) {
            stocks[i] = {...stocks[i], ...priceInfo[i]};
        }
        console.log("Next state of stocks:", stocks);
        return stocks;
    }

    async getUserBalance() {
        const response = await fetchBackend(`/user/${this.props.userId}`);
        if (!response.ok) {
            throw Error("getUserBalance: fetch failed.");
        }
        const {balance} = await response.json();
        return balance;
    }

    async update() {
        const stocks = await this.getStockInfo();
        const userBalance = await this.getUserBalance(); 
        this.setState({
            stocks, userBalance,
        });

    }

    getFullStockValue() {
        return this.state.stocks.reduce(
            (accum, stock) => {return accum + stock.latestPrice * stock.numStocks},
            0
        );
    }

    async componentDidMount() {
        await this.update();
    }

    async handlePurchase() {
        await this.update();
    }

    render() {
        if (this.state.stocks === null) {
            return <Loading />;
        }
        const balance = (<Currency>{this.state.userBalance}</Currency>);
        return (<>
            <OwnedStocks stocks={this.state.stocks} />
            Your account's balance is {balance}
            <hr/>
            <StockPurchase userId={this.props.userId}
            handlePurchase={this.handlePurchase}
            />
        </>);
    }
}

function actionTimer() {
    let start = Date.now();
    return (actionName) => {
        console.log(`${actionName} @ ${Date.now() - start}ms`);
    }
}

