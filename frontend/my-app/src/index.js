import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import {LoginScreen} from './components'

/* Questions:
 * - Where should user identity be stored? A global variable? Some
 *   sort of site-wide state?
 */
/* Transactions page:
 * - I'm going to display a list of transactions. Would be nice to
 *   have a component which takes a trans list and renders them.
 *
 * Portfolio page:
 * - I'm going to display a list of stock balances, their current
 *   prices, and do some styling when compared to their opening
 *   prices. I will want to work with all of this data at once, and
 *   when any of this data changes, I should re-render things. So I
 *   should keep the stock data as state, and I should hold it all in
 *   some parent component which uses other components to render that
 *   information.
 * - Stock balances are going to come from the database. I can use the
 *   id of the element as a key, since I'm gonna do some mapping.
 *   Vague security concerns about this. I should get {id,
 *   companyName, amount, updatedAt} from my API for each owned stock,
 *   where amount is the total amt owned by the user. UpdatedAt is in
 *   case I want to display the stocks in the order they were most
 *   recently purchased.
 * - When I first render the portfolio page, I should fetch the user's
 *   portfolio and I should then use a component to display the
 *   portfolio.
 */


    render() {
        return (
            <div>
            </div>
        );
    }
}

// ========================================

ReactDOM.render(
    <LoginScreen />,
    document.getElementById('root')
);
