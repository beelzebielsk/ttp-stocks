'use strict';
import React from 'react';

/* Both of these functions take a single number as their children
 */
// TODO: Put in the correct precision for money.
export function Currency(props) {
    const num = props.children;
    const rounded = num.toFixed(2);
    return <span>${rounded}</span>;
}

// TODO: Put in sensible precision for percent.
export function Percent(props) {
    const num = props.children;
    const rounded = num.toFixed(3);
    return <span>%{rounded}</span>;
}
