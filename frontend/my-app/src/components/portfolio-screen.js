import React from 'react';
import {Portfolio} from './portfolio';
import {StockPurchase} from './stock-purchase-form';

/**
 * Render a user's portfolio.
 * @prop {int} userId - The id of the logged in user.
 * TODO: Change name to Portfolio
 * FIXME: Display user balance here.
 */
export function PortfolioScreen(props) {
    return (
        <div>
            <Portfolio {...props} />
            <StockPurchase {...props} />
        </div>
    );
}
