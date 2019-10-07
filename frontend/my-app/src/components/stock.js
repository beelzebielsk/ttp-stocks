import React from 'react';
import {Currency, Percent} from './number-display';
/**
 * Renders a stock, given its name and amount.
 * @prop {int} numStocks - The number of stocks owned
 * @prop {string} tickerName - The ticker name of the company.
 * @prop {float} open - The opening price of the day for the stock.
 * @prop {float} latestPrice - The latest price for the stock.
 */
export function Stock(props) {
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

