'use strict';

import {fetchBackend} from './api';

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
export function delay(action, ms) {
    return new Promise((resolve, reject) => {
        let delayed = () => resolve(action());
        setTimeout(delayed, ms);
    });
}

const UNIVERSAL_DELAY = Number(process.env.REACT_APP_TEST_DELAY);

async function dummyFetchPortfolio(userId) {
    return delay(() => testPortfolio, UNIVERSAL_DELAY);
}

async function dummyFetchTransactions(userId) {
    return delay(() => testTransactions, UNIVERSAL_DELAY);
}

export async function fetchPortfolio(userId) {
    return fetchBackend(`/stocks/${userId}`).then(r => r.json());
}

export async function fetchTransactions(userId) {
    return fetchBackend(`/transaction/${userId}`).then(r => r.json());
}
