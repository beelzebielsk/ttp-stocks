import React from 'react';
import {OwnedStocks} from './portfolio';
import {StockPurchase} from './stock-purchase-form';

/**
 * Render a user's portfolio.
 * @prop {int} userId - The id of the logged in user.
 * FIXME: Display user balance here.
 */
export function Portfolio(props) {
    return (
        <div>
            <OwnedStocks {...props} />
            <hr/>
            <StockPurchase {...props} />
        </div>
    );
}
