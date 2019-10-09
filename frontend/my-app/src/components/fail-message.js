'use strict';
import React from 'react';

export function FailMessage({children}) {
    return (
        <div className="failMessage">
            {children}
        </div>
    );
}
