'use strict';

import React from 'react';
import {Stock} from './stock';
import {Currency} from './number-display';

/**
 * Render a user's portfolio of stocks.
 *
 * @prop {int} userId - The id of the currently logged-in user.
 */
export function OwnedStocks({stocks}) {
    if (stocks.length === 0) {
        console.log("No stocks.");
        return (
            <div>You have no stocks, you should buy some</div>
        );
    }
    let renderedStocks = stocks.map(s => (
        <Stock key={s.id} {...s} />
    ));
    let fullStockValue = getFullStockValue(stocks);
    return (<>
        <table id="portfolio">
            <thead><tr>
                <th>Ticker</th>
                <th># Owned</th>
                <th>Total Worth</th>
                <th>% Change</th>
            </tr></thead>
            <tbody>
                {renderedStocks}
            </tbody>
        </table>
        The full value of your stocks is{" "}
        <Currency>{fullStockValue}</Currency>
    </>);
}

function getFullStockValue(stocks) {
    return stocks.reduce(
        (accum, stock) => {return accum + stock.latestPrice * stock.numStocks},
        0
    );
}
