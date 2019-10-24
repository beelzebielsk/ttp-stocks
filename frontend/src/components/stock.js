import React from 'react';
import {Currency, Percent} from './number-display';
/**
 * Renders a stock, given its name and amount.
 * @prop {int} numStocks - The number of stocks owned
 * @prop {string} tickerName - The ticker name of the company.
 * @prop {float or null} open - The opening price of the day for the stock. If
 * not available, then pass in null.
 * @prop {float} latestPrice - The latest price for the stock.
 */
export function Stock({tickerName, numStocks, latestPrice, open, ...rest}) {
    let totalWorth = <Currency>{numStocks * latestPrice}</Currency>;
    let className, percentChangePrice;
    if (open === null) {
        className = '';
        percentChangePrice = 'N/A';
    } else {
        className = latestPrice < open ? "under" : (
            latestPrice > open ? "over" : "same-price"
        );
        percentChangePrice = (
            <Percent>
                {(latestPrice - open) / open}
            </Percent>
        );
    }
    return (
        <tr {...rest}>
            <td>{tickerName}</td>
            <td>{numStocks}</td>
            <td className={className}>{totalWorth}</td>
            <td className={className}>{percentChangePrice}</td>
        </tr>
    );
}

