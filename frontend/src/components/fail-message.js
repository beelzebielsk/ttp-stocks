'use strict';
import React from 'react';
import {ErrorMessage} from 'formik';

export function FailMessage({children}) {
    return (
        <div className="failMessage">
            {children}
        </div>
    );
}

export function FailWrapper(props) {
    return <ErrorMessage {...props} component={FailMessage}/>;
}

