'use strict';
import React from 'react';
import {validateEmail, validatePassword} from './form-validators';

/** 
 * A component to render a sign-in form.
 * Props:
 * @param {Function} login(email, password) - A function which will
 * login a user when given correct credentials. Should return an
 * object with the fields 'success' and 'reason', where 'success' is
 * true if login was successful, and false otherwise. 'reason' is the
 * reason that login was unsuccessful.
 */
export class LoginScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            email : "",
            password : "",
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
        //console.log(e.key);
        if (e.key === 'Enter') {
            await this.handleSubmit(e);
        }
    }
    
    async handleSubmit(e) {
        console.log("enter handleSubmit.");
        if (this.state.email === '') {
            this.setState({
                failedAttempt: true,
                failReason: "No email entered!",
            });
            return;
        }
        if (this.state.password === '') {
            this.setState({
                failedAttempt: true,
                failReason: "No password entered!",
            });
            return;
        }
        const loginResult = await this.props.handleLogin(
            this.state.email, this.state.password);
        if (!loginResult.success) {
            console.log("tried to submit, and failed.");
            this.setState({
                password: "",
                failedAttempt: true,
                failReason: loginResult.reason,
            });
        }
    }

    render() {
        let failReason = <span></span>;
        if (this.state.failedAttempt) {
            failReason = <span id="failMessage">{this.state.failReason}</span>;
        }
        return (
            <div onKeyPress={this.handleKeyPress} id="loginForm" className="form">
            <h1>Sign in</h1>
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
            <button onClick={this.handleSubmit}>Login</button>
            {failReason}
            </div>
        );
    }
}
