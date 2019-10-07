import React from 'react';
import {fetchTransactions} from '../fetch-data';
import {Currency} from './number-display';
import {Loading} from './loading';

/**
 * Shows a user their transaction history.
 *
 * @prop {int} userId - The id of the user viewing the transactions.
 */
export class TransactionsViewer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            transactions : null
        }
    }

    async componentDidMount() {
        this.setState({
            transactions : await fetchTransactions(this.props.userId)
        });
    }
    render() {
        if (this.state.transactions === null) {
            return <Loading />;
        }
        if (this.state.transactions.length === 0) {
            return <div>You've never made a transations, you should make one.</div>;
        }
        let renderedTransactions = this.state.transactions.map(t => {
            return (<Transaction 
                        {...t} 
                        transactionTime={new Date(t.createdAt)}
                        key={t.id}
                        />);
        });
        return (
            <div>
                {renderedTransactions}
            </div>
        );
    }
}

/**
 * A component to display a transaction.
 * @prop {string} tickerName - The ticker name of the company the
 * stocks belong to.
 * @prop {int} numStocks - How many stocks were purchased in the
 * transaction.
 * @prop {float} price - The amount paid for the whole transaction
 * @prop {Date} transactionTime - When the transaction happened
 */
function Transaction(props) {
    return (
        <div>
        Purchased {props.numStocks} of {props.tickerName} for {" "}
        <Currency>{props.price}</Currency>{" "}
        at {props.transactionTime.toLocaleDateString()}
        </div>
    );
}
