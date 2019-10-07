'use strict';
import React from 'react';

// TODO: Put in the correct precision for money.
export function Currency(props) {
    return <span>${props.children}</span>;
}

// TODO: Put in sensible precision for percent.
export function Percent(props) {
    return <span>%{props.children}</span>;
}
