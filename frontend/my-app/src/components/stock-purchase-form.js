import React from 'react';
import {Currency} from './number-display';
import {Loading} from './loading';
import {validatePositiveInteger, fieldNotEmpty} from './form-validators';
import {fetchBackend, sendJSONBackend} from '../api';
import {getQuote} from '../iex-api';
import {FailMessage, FailWrapper} from './fail-message';
import {Formik, Field, ErrorMessage, Form} from 'formik';

async function createNewTransaction({userId, price, numStocks, tickerName}) {
    return sendJSONBackend('/transaction',
        {userId, price, numStocks, tickerName},
        { method: 'POST' }
    );
}


/** 
 * A component to render a sign-in form.
 * Props:
 * @prop {int} userId - the id of the logged in user.
 *
 * - render the form for tickername and amount
 * - write the backend call to commit the transaction
 * - respond to the success or failure of the api call
 */
export function StockPurchase ({userId}) {
    async function handleSubmit(values, actions) {
        console.log("enter handleSubmit of stock purchase.");
        console.log(actions);
        console.log("userId on bag?", actions.userId);
        const numStocks = Number(values.amount);
        let apiSuccess;
        try {
            const {latestPrice} = await getQuote(values.tickerName);
            const price = numStocks * latestPrice;
            apiSuccess = await createNewTransaction({
                tickerName: values.tickerName, 
                numStocks,
                userId: userId,
                price,
            });
            if (!apiSuccess.ok && apiSuccess.status === 403) {
                actions.setStatus("You do not have enough money to make this purchase.");
                actions.setSubmitting(false);
                return;
            }
            if (!apiSuccess.ok) {
                actions.setStatus(await apiSuccess.text());
                actions.setSubmitting(false);
                return;
            }
        } catch (err) {
            if (err.name === "RangeError") {
                actions.setStatus(err.message);
                actions.setSubmitting(false);
                return;
            }
            throw err;
        }
    }
    return (
        <div id="stockPurchaseForm" className="form">
            <Formik
                onSubmit={handleSubmit}
                userId={userId}
                initialValues={{
                    tickerName: "",
                    amount: "",
                }}
            >
            {({status, values, errors}) => (
                <Form>
                    <label>Ticker Name</label>
                    <Field type="text" name="tickerName" placeholder="AAPL"
                        validate={fieldNotEmpty}/>
                    <FailWrapper name="tickerName" />
                    <label>Amount to Purchase</label>
                    <Field type="number" name="amount"
                        validate={validatePositiveInteger}/>
                    <FailWrapper name="amount" />
                    <button type="submit">Purchase Stock</button>
                    {status && <FailMessage>{status}</FailMessage>}
                </Form>
            )}
        </Formik>
    </div>
    );
}
