import React from 'react';
import {BrowserRouter as Router, Switch, Route, Link} from 'react-router-dom';
import ReactDOM from 'react-dom';
import './index.css';
import {LoginScreen, Portfolio} from './components'
import jwt from 'jsonwebtoken';
import {fetchBackend} from './api';

/* Questions:
 * - Where should user identity be stored? A global variable? Some
 *   sort of site-wide state?
 */
/* Transactions page:
 * - I'm going to display a list of transactions. Would be nice to
 *   have a component which takes a trans list and renders them.
 *
 * Portfolio page:
 * - I'm going to display a list of stock balances, their current
 *   prices, and do some styling when compared to their opening
 *   prices. I will want to work with all of this data at once, and
 *   when any of this data changes, I should re-render things. So I
 *   should keep the stock data as state, and I should hold it all in
 *   some parent component which uses other components to render that
 *   information.
 * - Stock balances are going to come from the database. I can use the
 *   id of the element as a key, since I'm gonna do some mapping.
 *   Vague security concerns about this. I should get {id,
 *   companyName, amount, updatedAt} from my API for each owned stock,
 *   where amount is the total amt owned by the user. UpdatedAt is in
 *   case I want to display the stocks in the order they were most
 *   recently purchased.
 * - When I first render the portfolio page, I should fetch the user's
 *   portfolio and I should then use a component to display the
 *   portfolio.
 */


//FIXME: Fetch a public key from the backend instead.
const secret = 'secret';

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            authenticated : false,
            userId : null,
            firstName: null,
            lastName: null,
        }
        this.login = this.login.bind(this);
    }

    async login(email, password) {
        console.log("enter login.");
        let credentials = {email, password};
        //FIXME: Put the URL here into an environment variable.
        const tokenResponse = await fetchBackend('/login', {
            method: 'POST',
            body: JSON.stringify(credentials),
            headers: {
                'Content-Type' : 'application/json',
            },
        });
        if (!tokenResponse.ok) {
            return { 
                success: false,
                reason: await tokenResponse.text() 
            };
        }
        const token = await tokenResponse.text();
        console.log(token);
        try {
            let payload = jwt.verify(token, secret);
            console.log('token payload:', payload);
            this.setState({
                userId: payload.id,
                firstName: payload.firstName,
                lastName: payload.lastName,
                authenticated: true
            });
            localStorage.setItem('token', token);
            return {success: true};
        } catch(err) {
            console.error(err);
            return false;
        }
    }
    
    // TODO: Set the route correctly for the login. Don't just render
    // the login, route them to that page.
    render() {
        if (!this.state.authenticated) {
            return (
                <LoginScreen handleLogin={this.login} />
            );
        }
        return (
        <Router>
            <div>
                <nav id='sitenav'>
                    <Link to="/">Home</Link>
                    <Link to="/signout">Sign Out</Link>
                    <Link to="/signup">Sign up</Link>
                </nav> 
            </div>

            <div id="site">
                <Switch>
                    <Route path="/signout">This is sign out</Route>
                    <Route path="/signup">
                        {"This is where I sign up, where's the form?"}
                    </Route>
                    <Route path="/">
                        Hello {this.state.firstName} {this.state.lastName}.
                        How are you?
                        <Portfolio userId={this.state.userId}/>
                    </Route>
                </Switch>
            </div>
        </Router>
        );
    }
}

// ========================================

ReactDOM.render(
    <App />,
    document.getElementById('root')
);
