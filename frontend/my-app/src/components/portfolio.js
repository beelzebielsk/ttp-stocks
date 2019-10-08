'use strict';

import React from 'react';
import {Stock} from './stock';
import {Currency} from './number-display';
import {fetchPortfolio} from '../fetch-data';
import {getQuote} from '../iex-api';
import {Loading} from './loading';
import {fetchBackend} from '../api';

/**
 * Render a user's portfolio of stocks.
 *
 * @prop {int} userId - The id of the currently logged-in user.
 */
export class OwnedStocks extends React.Component {
    constructor(props) {
        super(props);
        // When stocks is null, no fetch made yet.
        // If stocks is an array, then fetch made.
        this.state = {
            stocks : null,
            userBalance : null,
        };
        this.t = actionTimer();
    }

    async componentDidMount() {
        const stocks = await this.getStockInfo();
        const userBalance = await this.getUserBalance(); 
        this.setState({
            stocks, userBalance,
        });

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
        //this.setState({stocks});
    }

    async getUserBalance() {
        const response = await fetchBackend(`/user/${this.props.userId}`);
        if (!response.ok) {
            throw Error("getUserBalance: fetch failed.");
        }
        const {balance} = await response.json();
        return balance;
    }

    getFullStockValue() {
        return this.state.stocks.reduce(
            (accum, stock) => {return accum + stock.latestPrice * stock.numStocks},
            0
        );
    }

    render() {
        console.log("Start rendering.");
        if (this.state.stocks === null) {
            return <Loading />;
        }
        const balance = (<Currency>{this.state.userBalance}</Currency>);
        if (this.state.stocks.length === 0) {
            return (
                <>
                <div>You have no stocks, you should buy some</div>
                <div>Your current balance is {balance} </div>
                </>
            );
        }
        let stocks = this.state.stocks.map(s => (
            <Stock key={s.id} {...s} />
        ));
        return (
            <>
            <table id="portfolio">
                <thead><tr>
                    <th>Ticker</th>
                    <th># Owned</th>
                    <th>Total Worth</th>
                    <th>% Change</th>
                </tr></thead>
            {stocks}
            </table>
            The full value of your stocks is{" "}
            <Currency>{this.getFullStockValue()}</Currency>
            <br/>
            Your account's balance is {balance}
            </>
        );
    }
}

function actionTimer() {
    let start = Date.now();
    return (actionName) => {
        console.log(`${actionName} @ ${Date.now() - start}ms`);
    }
}


