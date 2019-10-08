import React from 'react';
import {fetchBackend} from '../api';
import {validateEmail, validatePassword} from './form-validators';

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
export class SignUpScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            email : "",
            password : "",
            firstName : "",
            lastName : "",
            failedAttempt : false,
            failReason: "",
        };

        this.handleKeyPress = this.handleKeyPress.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(e) {
        this.setState({
            [e.currentTarget.name]: e.currentTarget.value
        });
    }

    async handleKeyPress(e) {
        if (e.key === 'Enter') {
            await this.handleSubmit(e);
        }
    }

    async createNewUser({email, password, firstName, lastName}) {
        console.log('create new user entered');
        let response = await fetchBackend('/user', {
            method: 'POST',
            body: JSON.stringify({email, password, firstName, lastName}),
            headers: {
                'Content-Type' : 'application/json',
            }
        });
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
    
    // TODO: Give information about how the sign up attempt failed.
    // - invalid email
    // - no password given
    // - no such user/pass combination exists (done)
    async handleSubmit(e) {
        console.log("enter handle submit.");
        let validationSuccess = validateEmail(this.state.email);
        if (!validationSuccess.success) {
            this.setState({
                failedAttempt: true,
                failReason: validationSuccess.reason,
            });
            return;
        }
        validationSuccess = validatePassword(this.state.password);
        if (!validationSuccess.success) {
            this.setState({
                failedAttempt: true,
                failReason: validationSuccess.reason,
            });
            return;
        }
        console.log("Before create user.");
        let apiSuccess = await this.createNewUser(this.state);
        console.log("After create user.");
        if (!apiSuccess.success) {
            this.setState({
                failedAttempt: true,
                failReason: apiSuccess.reason,
            });
        }
    }

    render() {
        let failReason = <span></span>;
        if (this.state.failedAttempt) {
            failReason = <span id="failMessage">{this.state.failReason}</span>;
        }
        if (this.state.authenticated) {
            return `You are user ${this.state.id}: ${this.state.firstName} ${this.state.lastName}`;
        }
        return (
            <div onKeyPress={this.handleKeyPress} id="signUpForm">
            <label>Email</label>
            <input name="email" 
                type="text" 
                value={this.state.email}
                onChange={this.handleChange}/>
            <label>Password</label>
            <input name="password" 
                type="password" 
                value={this.state.password}
                onChange={this.handleChange}
                />
            <label>First Name</label>
            <input name="firstName" 
                type="text" 
                value={this.state.firstName}
                onChange={this.handleChange}
                />
            <label>Last Name</label>
            <input name="lastName" 
                type="text" 
                value={this.state.lastName}
                onChange={this.handleChange}
                />
            <button onClick={this.handleSubmit}>Sign up</button>
            {failReason}
            </div>
        );
    }
}
