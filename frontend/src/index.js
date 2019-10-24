import React, { useState } from 'react';
import {BrowserRouter as Router, Switch, Route, Link, Redirect} from 'react-router-dom';
import ReactDOM from 'react-dom';
import './index.css';
import {LoginScreen, Portfolio, SignUpScreen,
    TransactionsViewer} from './components/index';
import jwt from 'jsonwebtoken';
import {fetchBackend, sendJSONBackend} from './api';

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

/*  Take a component and return a new component that takes a single
 *  renderAfter prop and then forwards all other props to the child
 *  component
 *
 *  There has to be a way to attach some method that lets the
 *  renderafter prop know when to render the after stuff.
 *
 *  Basically, I need a way to manipulate setSubmissionStatus from
 *  SignUpScreen using a different component. Either a HOC or render
 *  prop component.
 *
 *  children is a function which takes props and returns a react
 *  component. The props received are {switchToAfter}
 */
function RenderAfter({children, after}) {
    let [showAfter, switchToShowAfter] = useState(false);
    let setShowAfter = () => {switchToShowAfter(true);};
    if (showAfter) {
        return after;
    } 
    return children({switchToAfter : setShowAfter});
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
        const tokenResponse = await sendJSONBackend('/login',
            credentials,
            { method: 'POST' }
        );
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
            //NOTE: setting localStorage has to come before! putting
            //it after setState can mean that storage is not set while
            //re-render happens. Can cause subtle timing bug where the
            //next element is not authorized.
            localStorage.setItem('token', token)
            this.setState({
                userId: payload.id,
                firstName: payload.firstName,
                lastName: payload.lastName,
                authenticated: true
            });
            return {success: true};
        } catch(err) {
            console.error(err);
            return false;
        }
    }

    logout() {
        localStorage.removeItem('token');
        this.setState({
            authenticated : false,
            userId : null,
            firstName: null,
            lastName: null,
        });
    }
    
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
                            <RenderAfter after={<Redirect to="/" />}>
                                {({switchToAfter}) => (
                                    <SignUpScreen onSubmit={switchToAfter} />
                                )}
                            </RenderAfter>
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
