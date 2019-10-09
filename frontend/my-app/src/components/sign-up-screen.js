import React from 'react';
import {sendJSONBackend} from '../api';
import {validateEmail, validatePassword, fieldNotEmpty as notEmpty} from './form-validators';
import {Formik, Field, ErrorMessage, Form} from 'formik';
import {FailMessage, FailWrapper} from './fail-message';

function toFormikValidator(validator) {
    return (...args) => validator(...args).reason;
}

/** 
 * A component to render a sign-up form.
 *
 * - needs to render a form that takes in email, password, first name
 *   and last name. 
 * - needs to validate those inputs
 * - needs to submit api request to make a new user
 * - needs to handle response from that request to instruct user what
 *   to do if request was unsuccessful.
 * - When finished, should make user go to sign in page.
 * - I can imagine wanting to build on this base, especially as I try
 *   to make forms look nicer/better.
 * - Each form can outsource the work for figuring out if and why some
 *   input is invalid, and they take the reason in the same way:
 *   through a {success, reason} object. I can try to standardize all
 *   of this through a reusable form component.
 *
 * 3 forms:
 * - sign up
 * - sign in
 * - purchase stock
 */
export function SignUpScreen() {
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
