import React from 'react';
import {BrowserRouter as Router, Switch, Route, Link, Redirect} from 'react-router-dom';
import ReactDOM from 'react-dom';
import './index.css';
import {LoginScreen, Portfolio, SignUpScreen,
    TransactionsViewer} from './components/index';
import jwt from 'jsonwebtoken';
import {fetchBackend} from './api';

import {Form} from './components/form';

//FIXME: Fetch a public key from the backend instead.
const secret = 'secret';

/* TODO: 
 * <https://reacttraining.com/react-router/web/guides/primary-components>
 * this could be good for nav styling
 */

function LogoutButton({onClick: clickHandler}) {
    return <button onClick={clickHandler}>Sign Out</button>;
}

function Site({children, ...rest}) {
    return (
        <div id='site' {...rest}>
            <Switch>
                {children}
            </Switch>
        </div>
    );
}

/* TODO: 
 * <https://reacttraining.com/react-router/web/example/auth-workflow>
 * this could be helpful for redirects and such, but I think having
 * the two different renders is fine for now. Something to be improved
 * later. Either that or use this just once wrapping a router.
 */
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
        this.logout = this.logout.bind(this);
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

    //TODO: Implement me. I should clear all state related to user
    //identity, and any entries in local storage. If I ever invalidate
    //jwt tokens, then I should perform that here, too.
    logout() {
        localStorage.removeItem('token');
        this.setState({
            authenticated : false,
            userId : null,
            firstName: null,
            lastName: null,
        });
    }
    
    // TODO: Set the route correctly for the login. Don't just render
    // the login, route them to that page.
    render() {
        if (!this.state.authenticated) {
            return (
                <Router>
                    <div>
                        <nav id='sitenav'>
                            <Link to="/">sign in</Link>
                            <Link to="/signup">sign up</Link>
                        </nav> 
                    </div>

                    <Site>
                        <Route exact path="/">
                            <LoginScreen handleLogin={this.login} />
                        </Route>
                        <Route path="/signup">
                            <SignUpScreen />
                        </Route>
                        <Route path="/">
                            <Redirect to="/" />
                        </Route>
                    </Site>
                </Router>
            );
        }
        return (
        <Router>
            <div>
                <nav id='sitenav'>
                    <Link to="/">Portfolio</Link>
                    <Link to="/transactions">Transaction Log</Link>
                    <LogoutButton onClick={this.logout}/>
                </nav> 
            </div>

            <Site>
                <Route path="/signout">This is sign out</Route>
                <Route exact path="/">
                    Hello {this.state.firstName} {this.state.lastName}.
                    How are you?
                    <Portfolio userId={this.state.userId}/>
                </Route>
                <Route path="/transactions">
                    <TransactionsViewer userId={this.state.userId}/>
                </Route>
            </Site>
        </Router>
        );
    }
}

// ========================================

ReactDOM.render(
    <App />,
    document.getElementById('root')
);
