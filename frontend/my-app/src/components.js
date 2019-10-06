import React from 'react';
import {fetchPortfolio, fetchTransactions} from './fetch-data';
import {IEX_KEY as API_KEY, IEX_URL} from './iex-api';
import jwt from 'jsonwebtoken';

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


async function getQuote(tickerName) {
    let root = IEX_URL;
    let queryParams = new URLSearchParams({
            token : API_KEY,
            filter : 'open,latestPrice',
        });
    let url = `${root}/stock/${tickerName}/quote?${queryParams}`;
    console.log(`url: ${url}`);
    return fetch(url, {
        method: 'GET',
        //mode: 'no-cors',
        headers: {
            'Content-Type' : 'application/json',
        },
    });
}

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

// TODO: Put in the correct precision for money.
export function Currency(props) {
    return <span>${props.children}</span>;
}

// TODO: Put in sensible precision for percent.
export function Percent(props) {
    return <span>%{props.children}</span>;
}

/* Are there any props to this? Should anything control what it
 * renders, aside from site state like user identity?
 */
export class Portfolio extends React.Component {
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

//FIXME: Fetch a public key from the backend instead.
const secret = 'secret';

/* - Make a form which accepts email and password.
 * - Make function to submit request to /login and handle returned
 *   results.
 */
export class LoginScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            email : "",
            password : "",
            authenticated : false,
            failedAttempt : false,
            id : null,
            firstName: null,
            lastName: null,
        };

        this.handleKeyPress = this.handleKeyPress.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleKeyPress(e) {
        //console.log(e.currentTarget.value);
        this.setState({
            [e.currentTarget.name]: e.currentTarget.value
        });
    }

    async login() {
        let credentials = new FormData();
        credentials.append('email', this.state.email);
        credentials.append('password', this.state.password);
        //FIXME: Put the URL here into an environment variable.
        const tokenResponse = await fetch('http://localhost:8000/login', {
            method: 'POST',
            body: credentials,
        });
        const token = await tokenResponse.text();
        try {
            let payload = jwt.verify(token, secret);
            console.log(payload);
            this.setState({
                id: payload.id,
                firstName: payload.firstName,
                lastName: payload.lastName,
                authenticated: true
            });
        } catch(err) {
            this.setState({failedAttempt: true});
            console.error(err);
        }
    }

    handleSubmit(e) {
        this.login()
    }

    render() {
        if (this.state.authenticated) {
            return `You are user ${this.state.id}: ${this.state.firstName} ${this.state.lastName}`;
        }
        return (
            <div>
            <label>Email</label>
            <input name="email" 
                type="text" 
                value={this.state.email}
                onChange={this.handleKeyPress}/>
            <label>Password</label>
            <input name="password" 
                type="text" 
                value={this.state.password}
                onChange={this.handleKeyPress}/>
            <button onClick={this.handleSubmit}>Login</button>
            </div>
        );
    }
}
