// FIXME: Make this work in production.
export const IEX_KEY = process.env.REACT_APP_API_KEY;
export const IEX_URL = process.env.REACT_APP_IEX_API_URL;

/**
 * Get a quote for the given tickerName from IEX.
 * If response is successful, will return {open, latestPrice}, the
 * open price of the day for the ticker and the latest recorded price
 * for the ticker respectively. If the ticker does not exist, will
 * throw RangeError.
 *
 * @param {string} tickerName - The ticker name corresponding to stock
 * to get quote on.
 */
export async function getQuote(tickerName) {
    let root = IEX_URL;
    let queryParams = new URLSearchParams({
            token : IEX_KEY,
            filter : 'open,latestPrice',
        });
    let url = `${root}/stock/${tickerName}/quote?${queryParams}`;
    return fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type' : 'application/json',
        },
    }).then(response => {
        if (!response.ok && response.status(404)) {
            throw RangeError(`Ticker name '${tickerName}' does not exist.`);
        }
        return response.json();
    });
}
