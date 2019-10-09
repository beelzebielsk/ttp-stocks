'use strict';
import React from 'react';
import {validateEmail, validatePassword} from './form-validators';
import {Formik, Field, ErrorMessage, Form} from 'formik';
import {FailMessage} from './fail-message';

/** 
 * A component to render a sign-in form.
 * Props:
 * @param {Function} handleLogin(email, password) - A function which will
 * login a user when given correct credentials. Should return an
 * object with the fields 'success' and 'reason', where 'success' is
 * true if login was successful, and false otherwise. 'reason' is the
 * reason that login was unsuccessful.
 *
 * NOTE: Looks like Formik's errors object will only hold as many
 * fields as there are fields in initialValues.
 */
export function LoginScreen({handleLogin}) { 
    return (
        <div id="loginForm" className="form">
            <h1>Sign in</h1>
            <Formik
                initialValues={{ email: "", password: ""}}
                validate={({email, password}) => {
                    let errors = {};
                    let v = validateEmail(email);
                    if (!v.success) {
                        errors.email = v.reason;
                    }
                    v = validatePassword(password);
                    if (!v.success) {
                        errors.password = v.reason;
                    }
                    console.log('validation errors:', errors);
                    return errors;
                }}
                onSubmit={async (values, actions) => {
                    const loginResult = await handleLogin(
                        values.email, values.password);
                    console.log(loginResult);
                    if (!loginResult.success) {
                        actions.setStatus(loginResult.reason);
                    }
                    actions.setSubmitting(false);
                }}
                render={({values,
                    errors,
                    status, // top-level form state
                    handleChange,
                    handleSubmit, handleBlur}) => (
                    <Form>
                        <label>Email</label>
                        <Field type="text" name="email" placeholder="user@example.com"/>
                        <ErrorMessage name="email" component={FailMessage} />
                        <label>Password</label>
                        <Field type="password" name="password" />
                        <ErrorMessage name="password" component={FailMessage} />
                        {status && <FailMessage>{status}</FailMessage>}
                        <button type="submit">Submit</button>
                    </Form>
                )}
                />
        </div>
    );
}
