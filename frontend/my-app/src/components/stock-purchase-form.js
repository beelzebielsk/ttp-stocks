import React from 'react';
import {Currency} from './number-display';
import {Loading} from './loading';
import {validateTickerName, validatePositiveInteger} from './form-validators';
import {fetchBackend, sendJSONBackend} from '../api';
import {getQuote} from '../iex-api';

/** 
 * A component to render a sign-in form.
 * Props:
 * @prop {int} userId - the id of the logged in user.
 *
 * - render the form for tickername and amount
 * - write the backend call to commit the transaction
 * - respond to the success or failure of the api call
 */
export class StockPurchase extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            tickerName: "",
            amount: "",
            failedAttempt : false,
            failReason: "",
        };

        this.handleKeyPress = this.handleKeyPress.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    // never changes bw all forms
    handleChange(e) {
        this.setState({
            [e.currentTarget.name]: e.currentTarget.value
        });
    }

    // never changes bw all forms
    async handleKeyPress(e) {
        //console.log(e.key);
        if (e.key === 'Enter') {
            await this.handleSubmit(e);
        }
    }

    async createNewTransaction({userId, price, numStocks, tickerName}) {
        return sendJSONBackend('/transaction',
            {userId, price, numStocks, tickerName},
            { method: 'POST' }
        );
    }
    
    // always changes b/w the forms
    // what never changes is that it doesn't return anything
    // it sets the failReason and failedAttempt states when some
    // failure occurs due to invalid fields.
    // I could separate out field validation from handleSubmit, which
    // would make it smaller, easier to read. They're not really the
    // same job, though fields need to be validated before submission
    // happens.
    // TODO: This component will have to notify portfolio that a
    // purchase has been made, so it can refresh the portfolio. One
    // way to do this is to have a prop onSubmit which gets run when
    // submission is successful. It would be the last line to execute
    // in handleSubmit, running prop.onSubmit if it exists.
    async handleSubmit(e) {
        console.log("enter handleSubmit.");
        let validationSuccess = validateTickerName(this.state.tickerName);
        // while the names of the state the hold the form variables
        // change, the general method of reporting errors does not:
        // perform action on current value of the state var, and give
        // a success indication and reason for failure if any.
        if (!validationSuccess.success) {
            this.setState({
                failedAttempt: true,
                failReason: validationSuccess.reason,
            });
            return;
        }
        validationSuccess = validatePositiveInteger(this.state.amount);
        if (!validationSuccess.success) {
            this.setState({
                failedAttempt: true,
                failReason: validationSuccess.reason,
            });
            return;
        }
        try {
            const {latestPrice} = await getQuote(this.state.tickerName);
            const price = this.state.amount * latestPrice;
            const apiSuccess = await this.createNewTransaction({
                tickerName: this.state.tickerName, 
                numStocks: this.state.amount,
                userId: this.props.userId,
                price,
            });
        } catch (err) {
            if (err.name === "RangeError") {
                this.setState({
                    failedAttempt: true,
                    failReason: err.message,
                });
            }
        }
    }

    // Not sure if/how this will change b/w the forms, but it would be
    // nice if it didn't matter. I can imagine putting a failReason
    // element of some kind somewhere, and I will definitely put
    // inputs into the form. It would be nice if I could have the form
    // figure out the state to keep track of from the children passed
    // to it.
    // The label names may change a bit from the input names.
    render() {
        let failReason = <span></span>;
        if (this.state.failedAttempt) {
            failReason = <span id="failMessage">{this.state.failReason}</span>;
        }
        return (
            <div onKeyPress={this.handleKeyPress} id="stockPurchaseForm">
            <label>Ticker Name</label>
            <input name="tickerName" 
                type="text" 
                value={this.state.tickerName}
                onChange={this.handleChange}/>
            <label>Amount to Purchase</label>
            <input name="amount" 
                type="text" 
                value={this.state.amount}
                onChange={this.handleChange}
                />
            <button onClick={this.handleSubmit}>Purchase Stock</button>
            {failReason}
            </div>
        );
    }
}

