import React, { useState } from 'react';
import {sendJSONBackend} from '../api';
import {validateEmail, validatePassword, fieldNotEmpty as notEmpty} from './form-validators';
import {Formik, Field, ErrorMessage, Form} from 'formik';
import {FailMessage, FailWrapper} from './fail-message';

/** 
 * A component to render a sign-up form.
 *
 * @prop{function} afterSuccessfulSubmit - A function to be executed
 * after a successful submission of the SignUpScreen form.
 *
 */
export function SignUpScreen({onSubmit: afterSuccessfulSubmit}) {
    // Default is to do nothing.
    afterSuccessfulSubmit = afterSuccessfulSubmit || (() => {});
    return (
        <Formik 
            initialValues={{
                email: "",
                password: "",
                firstName: "",
                lastName: ""
            }}
            onSubmit={async (values, actions) => {
                console.log("enter handle submit.");
                let apiSuccess = await createNewUser(values);
                if (!apiSuccess.success) {
                    actions.setStatus(apiSuccess.reason);
                } else {
                    afterSuccessfulSubmit();
                }
                actions.setSubmitting(false);
            }}
            render={({values, errors, status}) => (
                <div className='form'>
                    <h1> Sign Up </h1>
                    <Form>
                        <label>email</label>
                        <Field name="email" type="text" validate={validateEmail} />
                        <FailWrapper name="email"/>
                        <label>Password</label>
                        <Field name="password" type="password" validate={validatePassword} />
                        <FailWrapper name="password"/>
                        <label>First Name</label>
                        <Field name="firstName" type="text" validate={notEmpty} />
                        <FailWrapper name="firstName"/>
                        <label>Last Name</label>
                        <Field name="lastName" type="text" validate={notEmpty} />
                        <FailWrapper name="lastName"/>
                        <button type="submit">Sign Up</button>
                        {status && <FailMessage>{status}</FailMessage>}
                    </Form>
                </div>
            )}
        />
    );
}

async function createNewUser({email, password, firstName, lastName}) {
    console.log('create new user entered');
    let response = await sendJSONBackend('/user',
        {email, password, firstName, lastName},
        { method: 'POST' });
    //TODO: This piece is shared with login. Is there some way to
    //extract this general pattern of {success, reason} and api
    //responses?
    if (!response.ok) {
        return { 
            success: false,
            reason: await response.text() 
        };
    }
    return {success: true};
}
