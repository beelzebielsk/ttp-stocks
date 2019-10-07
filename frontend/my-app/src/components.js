import React from 'react';
import {fetchPortfolio, fetchTransactions} from './fetch-data';
import {IEX_KEY as API_KEY, IEX_URL} from './iex-api';
import jwt from 'jsonwebtoken';
import {fetchBackend} from './api';

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

/**
 * Render a user's portfolio of stocks.
 *
 * @prop {int} userId - The id of the currently logged-in user.
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
        let stocks = await fetchPortfolio(this.props.userId);
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

    getFullStockValue() {
        return this.state.stocks.reduce(
            (accum, stock) => {return accum + stock.latestPrice * stock.numStocks},
            0
        );
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
            The full value of your stocks is
            <Currency>{this.getFullStockValue()}</Currency>
            </div>
        );
    }
}

/** 
 * A component to render a sign-in form.
 * Props:
 * @param {Function} login(email, password) - A function which will
 * login a user when given correct credentials. Should return an
 * object with the fields 'success' and 'reason', where 'success' is
 * true if login was successful, and false otherwise. 'reason' is the
 * reason that login was unsuccessful.
 */
export class LoginScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            email : "",
            password : "",
            failedAttempt : false,
            failReason: "",
        };

        this.handleKeyPress = this.handleKeyPress.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(e) {
        this.setState({
            [e.currentTarget.name]: e.currentTarget.value
        });
    }

    async handleKeyPress(e) {
        console.log(e.key);
        if (e.key === 'Enter') {
            await this.handleSubmit(e);
        }
    }
    
    // TODO: Give information about how the login attempt failed.
    // - invalid email
    // - no password given
    // - no such user/pass combination exists (done)
    async handleSubmit(e) {
        console.log("enter handleSubmit.");
        if (this.state.email === '') {
            this.setState({
                failedAttempt: true,
                failReason: "No email entered!",
            });
            return;
        }
        if (this.state.password === '') {
            this.setState({
                failedAttempt: true,
                failReason: "No password entered!",
            });
            return;
        }
        const loginResult = await this.props.handleLogin(
            this.state.email, this.state.password);
        if (!loginResult.success) {
            console.log("tried to submit, and failed.");
            this.setState({
                password: "",
                failedAttempt: true,
                failReason: loginResult.reason,
            });
        }
    }

    render() {
        let failReason = <span></span>;
        if (this.state.failedAttempt) {
            failReason = <span id="failMessage">{this.state.failReason}</span>;
        }
        if (this.state.authenticated) {
            return `You are user ${this.state.id}: ${this.state.firstName} ${this.state.lastName}`;
        }
        return (
            <div onKeyPress={this.handleKeyPress} id="loginForm">
            <label>Email</label>
            <input name="email" 
                type="text" 
                value={this.state.email}
                onChange={this.handleChange}/>
            <label>Password</label>
            <input name="password" 
                type="text" 
                value={this.state.password}
                onChange={this.handleChange}
                />
            <button onClick={this.handleSubmit}>Login</button>
            {failReason}
            </div>
        );
    }
}

/* These validators will take in some text and return an object
 * describing whether it is valid, and if it is not valid, why. The
 * object has fields 'success' and 'reason'. If the entry is valid,
 * then return { success: true }. If the entry is invalid, then return
 * {success: false, reason: why-is-invalid}.
 */
function validateEmail(email) {
    if (email === '') {
        return {success: false, reason: "No email entered!"};
    }
    return {success: true};
}

function validatePassword(password) {
    if (password === '') {
        return {success: false, reason: "No password entered!"};
    }
    return {success: true};
}

/** 
 * A component to render a sign-up form.
 *
 * - needs to render a form that takes in email, password, first name
 *   and last name. 
 * - needs to validate those inputs
 * - needs to submit api request to make a new user
 * - needs to handle response from that request to instruct user what
 *   to do if request was unsuccessful.
 * - When finished, should make user go to sign in page.
 */
export class SignUpScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            email : "",
            password : "",
            firstName : "",
            lastName : "",
            failedAttempt : false,
            failReason: "",
        };

        this.handleKeyPress = this.handleKeyPress.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(e) {
        this.setState({
            [e.currentTarget.name]: e.currentTarget.value
        });
    }

    async handleKeyPress(e) {
        if (e.key === 'Enter') {
            await this.handleSubmit(e);
        }
    }

    async createNewUser({email, password, firstName, lastName}) {
        console.log('create new user entered');
        let response = await fetchBackend('/user', {
            method: 'POST',
            body: JSON.stringify({email, password, firstName, lastName}),
            headers: {
                'Content-Type' : 'application/json',
            }
        });
        //TODO: This piece is shared with login. Is there some way to
        //extract this general pattern of {success, reason} and api
        //responses?
        if (!response.ok) {
            return { 
                success: false,
                reason: await response.text() 
            };
        }
        return {success: true};
    }
    
    // TODO: Give information about how the sign up attempt failed.
    // - invalid email
    // - no password given
    // - no such user/pass combination exists (done)
    async handleSubmit(e) {
        console.log("enter handle submit.");
        let validationSuccess = validateEmail(this.state.email);
        if (!validationSuccess.success) {
            this.setState({
                failedAttempt: true,
                failReason: validationSuccess.reason,
            });
            return;
        }
        validationSuccess = validatePassword(this.state.password);
        if (!validationSuccess.success) {
            this.setState({
                failedAttempt: true,
                failReason: validationSuccess.reason,
            });
            return;
        }
        console.log("Before create user.");
        let apiSuccess = await this.createNewUser(this.state);
        console.log("After create user.");
        if (!apiSuccess.success) {
            this.setState({
                failedAttempt: true,
                failReason: apiSuccess.reason,
            });
        }
    }

    render() {
        let failReason = <span></span>;
        if (this.state.failedAttempt) {
            failReason = <span id="failMessage">{this.state.failReason}</span>;
        }
        if (this.state.authenticated) {
            return `You are user ${this.state.id}: ${this.state.firstName} ${this.state.lastName}`;
        }
        return (
            <div onKeyPress={this.handleKeyPress} id="signUpForm">
            <label>Email</label>
            <input name="email" 
                type="text" 
                value={this.state.email}
                onChange={this.handleChange}/>
            <label>Password</label>
            <input name="password" 
                type="text" 
                value={this.state.password}
                onChange={this.handleChange}
                />
            <label>First Name</label>
            <input name="firstName" 
                type="text" 
                value={this.state.firstName}
                onChange={this.handleChange}
                />
            <label>Last Name</label>
            <input name="lastName" 
                type="text" 
                value={this.state.lastName}
                onChange={this.handleChange}
                />
            <button onClick={this.handleSubmit}>Sign up</button>
            {failReason}
            </div>
        );
    }
}
