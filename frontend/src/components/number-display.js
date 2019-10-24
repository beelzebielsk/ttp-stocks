'use strict';
import React from 'react';

/* Both of these functions take a single number as their children
 */
export function Currency(props) {
    const num = props.children;
    const rounded = num.toFixed(2);
    return <span>${rounded}</span>;
}

export function Percent(props) {
    const num = props.children;
    const rounded = num.toFixed(3);
    return <span>%{rounded}</span>;
}
