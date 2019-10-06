TODO And Sources 
================

<https://www.nerdwallet.com/blog/investing/how-to-research-stocks/>
Could give helpful info to show for stocks
<https://reactjs.org/docs/faq-functions.html> Talks about react and
speed 
<http://jankfree.org/> May help with speed
<https://marmelab.com/blog/2017/02/06/react-is-slow-react-is-fast.html>
May help with speed
<https://stackoverflow.com/questions/40714583/how-to-specify-a-port-to-run-a-create-react-app-based-project>
default react port is 3000
<https://reactjs.org/docs/create-a-new-react-app.html#create-react-app>
How to setup the app for local development
<https://reactjs.org/tutorial/tutorial.html> app tutorial
<https://www.alphavantage.co/documentation/> alpha vantage tutorial
<https://blog.rapidapi.com/google-finance-api-alternatives/> In case IEX sucks for some reason
<https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events/Using_server-sent_events> In case I switch to an API where this is available
<https://jsdoc.app/about-getting-started.html> For learning JS documentation
<https://medium.com/@trekinbami/using-environment-variables-in-react-6b0a99d83cf5> For letting react stuff be in environment vars in production
<https://expressjs.com/en/starter/hello-world.html> Express reading
<https://devcenter.heroku.com/articles/preparing-a-codebase-for-heroku-deployment> For deploying to heroku

Planning 
========

Done
- db done along with sample data.
- Create a mock of the Portfolio component.

Up next
- Authentication needs to get made

Remaining
- api endpoints need to get made
- frontend needs to get made
- Find+read up on stocks api
- Make api calls to stocks from backend. My API key should NOT be in
  my frontend. Though I can do as such at the start.
- Follow [these directions](https://iexcloud.io/docs/api/#attribution)
  at the end.
- An decent model for the portfolio page <https://www.bloomberg.com/markets/stocks>
- Find and use a linter.
- Make color changes s use a transition
- Make sure that secrets and stuff are decent, not just jokes.

I need a backend and a frontend. They want user authentication. The
backend has to store users that will get registered. And I suppose it
will send/render the correct pages based on what I use to make pages.

- Sign in page
- Sign up page

- Users will have a balance and will own stocks. So I'll have to store
  that information on the backend. The backend will keep a table of
  users, and it should keep a table of transactions so that a user can
  see the transactions that they made. I should also be able to view
  the full amount of stocks that a user has.
    - Should I store the balance of stocks that a user has and their
      transactions separately? Or should I calculate their totals from
      a transactions table? Transactions calculations will get really
      expensive fast if there are a lot of users, which I won't have.
      I'll have a long history. Balances are good, but the two pieces
      of information are somewhat duplicates... but not really.
      **Track balances+transactions separately.**
    - Users have an email, password, name, and account balance. I can
      give them an id as well for foreign keys.
- A transaction is a trade of money and stocks at a particular time by
  a user. 
    - So I should store:
        - the user that made the transaction
        - which stock was purchased
        - how many of them were purchased
        - the price per stock or full price of transaction
    - From the look of the mockup, i can buy just one stock from a
      company per transaction, given the form.
- Each user can own more than one stock, but a stock cannot be owned
  by more than one user. Better to call this a *stock balance*, all
  the stocks that they own of a single company. So this needs a table,
  too.
    - I should store:
        - the user that owns the stock
        - the company name
        - how much stock is owned

Frontend choices:

I need to have multiple pages to the application
- Express and... handlebars? Just render the HTML and scripts, I
  guess. I should consider doing this as an experiment afterwards. I'm
  sure it'll be a pain, but I'll probably understand what's going on better.
- Express + React + React-router
    - This is what I used for Hoopla, so I have a good reference for
      this. The main pro here is familiarity.
- Express + React + Next.js
    - They make this seem really easy. Easy when compared to whatever
      we did for Hoopla. Seeing nextjs is the only reason I even started this search.
- Vue
    - <https://vuejs.org/v2/guide/index.html#>

Hard Requirements 
=================

1. Should have a sign in page, where a user can sign in using an
existing account.
    1. Should not allow a user with no existing account (ie a user
    that cannot submit a valid email/pass pair) to login.
2. SHould have a sign up page, where a user can create a new account
with which to sign in.
    1. The initial balance of a user's account should be $5000.
    2. No email should be usable for registration more than once.
3. Should have a user portfolio page.
    1. Should display the worth of each stock in their portfolio at
    the moment that the page is opened (or some decent defn of
    'current moment').
        1. If the price of the stock is the same as it was at the
        day's open, display grey.
        2. If the price of the stock is *less than* it was at the
        day's open, display red.
        3. If the price of the stock is *greater than* as it was at
        the day's open, display green.
        4. me: display the change in percent of the stock.
    2. Should display the net worth of all of their stocks in their
    portfolio. Q: How do I calc that?
    3. Should allow user to purchase new stocks from a single company
    at a time.
    4. Should display user's balance of cash.
    5. Should allow a user to purchase a stock from a company at the
    stock's current price.
        1. Can only buy from a valid ticker.
        2. Can only buy if they have enough cash.
        3. Can only buy whole number quantities of shares
        4. me: Cannot buy more stocks than exist at the moment for the
        company.
4. Should have user transactions page.
    1. Should show the ticker name, number of stocks purchased, and
    the full price of the transaction at the price/time that the
    transaction took place.
5. Visitor should not be able to access transaction or portfolio page
without being logged in.

Roadblocks
==========

### Stock Prices

- How do I calculate the worth of a stock? The open/high/low/close
  prices don't really fit with price calculation. I think the quote
  endpoint is what I'm looking for.
    - Generally, what is the precise meanings of the words from AV
      api? What is being reported to me, and how do I use them?

I think the Quote endpoint is the way to go.

- How do I use sequelize to create my db?
    - One option is the `sequelize.sync()` method.

- How do I make sure that sequelize made the correct db? Verify its
  output? Am I doing something wrong which causes changes to not
  happen/persist on my db? Maybe it is the sync function that I'm
  looking for.

### Day's Open

This looks simple with IEX API. Just use their quote endpoint. The
price, open, and close prices are all given in the same request.

I am not sure what point in time the open and close refer to. If I ask
for a stock price in the middle of the day, how can there be a closing
price, unless it is yesterday's closing price?

### Mixing the db with express

- How do I mix the db with express? Should I just clone the hoopla
  backend and scrape out the original db and drop in the db for this
  application? It would get me started, tho I'd have no idea what I
  was doing.

```
models.sequelize.sync({force: false})
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is up and running on port: ${PORT}`)
    });
  });
```

That's how. I sync the models like I've already done (why do sync?)
and then I tell my express application to listen on the port we've
chosen.

### Migrations

Making the migrations with the cli, wansn't sure how to match accuracy
of `sync` with models. Needed to edit migrations by hand to get things
to be unique, not null, and have foreign keys. Had to edit both the
generated model files, and the migrations.

<https://sequelize.org/master/class/lib/query-interface.js~QueryInterface.html#instance-method-createTable> 
This gave me different things to write to make the migrations correct.

I had `validation error` when trying to use seeders with no clear
reason as to why. Didn't get better error msg than that. It was
because I didn't have a value for every field of the table. Have to
have values for everything, except for id.

### Date Arithmetic 

Use `Date.valueOf()` to get epoch milliseconds which can be added.
Then date constructor can turn this back into a date object.

<https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/valueOf>

### Rendering Portfolio

Portfolio requires resources that are going to come asynchronously:
stock balances from my API and price+open information from a stocks
API. I can't render without them. How do I write the component to
reflect this? Vaguely remember showing Sasana how to do this once.

```
class Portfolio extends React.Component {
    constructor(props) {
        super(props);
        // FIXME: Change component to use fetchPortfolio
        //this.state = testPortfolio;
        this.state = null;
    }

    giveState() {
        this.setState({haveState: true});
    }

    takeAwayState() {
        this.setState(null);
    }

    render() {
        console.log("Start rendering.");
        let hasState = (
            this.state === null ?
            <div>I have no state</div> :
            <div>I have state</div>
        );
        console.log(`${this.state === null ? 'Has no' : 'Has'} state`);
        return (
            <div>
                {hasState}
                <button onClick={this.giveState.bind(this)}>Gimme state</button>
                <button onClick={this.takeAwayState.bind(this)}>Remove state</button>
            </div>
        );
    }
}

ReactDOM.render(
  <Portfolio id={0}/>,
  document.getElementById('root')
);

setTimeout(() => {
    ReactDOM.render(
        <Portfolio id={1}/>,
        document.getElementById('root')
    );
}, 3000);
```

When I do this, click the "Gimme state" button w/in 3 seconds, and
then wait until 3 seconds pass in total, I see 3 renders. I see "start
rendering" logged 3 times. The first time has no state, and the last
two times have state. Why? I expect `<Portfolio id={1} />` to create
an object with `this.state = null` and I expect it to replace the old
Portfolio element.

I created the `id` property on them to try and force a change. There
are 3 renders again, no state change.

However, when I changed `id` to the react reserved property `key`, I
got a state change. **Seems that's a way to force a state change.**

Rendering components like portfolio should work like:

- Give them a state in the constructor which signifies it has nothing
  to render yet.
- Write what render should do with this initial state.
- Define the `componentDidMount` method, which is sort like `onload`
  for react apps. On the first render, make all the asynchronous calls
  you want, and then call `this.setState` with the resulting data.

### Using Environment Variables in Frontend

<https://create-react-app.dev/docs/adding-custom-environment-variables>

Prefix them with `REACT_APP` and it'll work out.

### Authentication

Perhaps a user generates a private key once per session to have
public/private key pairs. The server just trusts that if the
authentication information was correct the first time, then any
signatures from that person must be correct. I think that signatures
are something like encryption with a private key which can get
'undone' by their public key---and only the corresponding public key.

I know that the user sends their credentials to server first. Then
server responds with token. How should user send their credentials to
the server? Is there a secure way? And how should server block/allow
access to restricted areas?

The user's navigation is all client-side. So the client has to detect
whether they're logged in or not and disallow access. There's nothing
the server can do bc it is not the gatekeeper to the content they
wanna access. Server only is gatekeeper for API calls.

Focus on figuring out the exchange. A first approximation can be to make a function called login which takes a username and password, send them plain in a POST request and have the server send a JWT back.

- Login page has a form which takes email and password.
- POST request is made to a URL which sends back a token. The token is
  like an ID badge. It says who the person who logged in is. If the
  email and password (not encrypted) match something in the database,
  then a token is sent back with payload firstname, lastname, id.
- Other API paths which should be protected, like getting transactions
  or balances will somehow guard against not providing a token, or
  having an invalid token. Right now, just reject requests which do
  not have a token. Look up HTTP status codes to pick the right kind.
- For the client-side, do not render the nav bar unless the user is
  signed-in. Do this once you have a nav bar.

The communication and steps from the example

- A user goes to the login page.
- They complete from with username and password on their login page
  and is submitted as POST request to `/auth` endpoint. The auth endpoint corresponds to `authHandler` in the helpers file.
    - `u` is a standin for a response from a db on people.
    - If the identity submitted by the client exists in the db, then
      do what should be done when auth is successful (hand off the
      request and response to authSuccess). I think what they did here
      is a lot like `next` in express. Hand this request and response
      off to something else. Otherwise do what should happen when auth
      fails.
- On a successful authorization, a token is generated and stored in
  some database (I think leveldb), and the token is sent back as text
  in an `authorization` header. They also send the `restricted`
  webpage. They didn't follow how JWT says to do it which is to
  include `bearer` in there somewhere.

- The user can now log out while on the restricted page. This accesses
  the `/logout` endpoint, which is the `logout` function from helpers.
  The token here is the base64 encoded string straight from the
  header. the jsonwebtokens `verify` is used to verify and decode the
  token. I don't think it will decode an incorrect token. First the
  token is verified (why? why is it important to verify a logged-out
  token? So someone can't log someone else out?). 
    - The token structure is given in `generateToken`. `generateToken`
      returns a signed token from `jwt.sign`. These are encoded
      strings with a signature. The payload has { auth : GUID, agent :
      client-user-agent-from-headers }. For me, I'd be creating a
      payload with the user's id and first and last name.
- After verifying the token, they fetch the stored token in their db
  for the same identity (same GUID), set the `valid` property to false
  and put it back in their db. They store all tokens in their db that
  they've ever issued and track whether valid or not.

- The user can also access privileged content. Note, the privileged
  content is the `restricted` page, which is the thing with the
  youtube video. You can get to it straight from auth because the page
  is served up to you, however nothing in the client stores the token,
  so I can't visit it directly from the `/private` endpoint.
  <https://github.com/dwyl/learn-json-web-tokens/blob/master/README.md#q-returning-visitor-no-state-preservation-between-sessions>
  they suggest to just keep the token in local storage, like we did in
  Hoopla, even though owasp says not to.

For my application, the best and most secure thing would be to use
public-key cryptography and to create an api call to get the public
key of the server. When the user is about to visit restricted content,
then react will check to see if the user has a valid token. If no
token at all, or token not signed by server, then redirect them to the
login screen. o/w let them proceed.

I'll hold the token in localStorage, and I'll put userInfo into the
state of a top-level site component.

For now, they will just both have pre-shared bullshit key, and all
communication will be done w/o encryption of any kind.

- User goes to a login component.
- Login comp renders a form for email and pass.
- Request is made to `/login` route at backend.
- backend checks to see if email and pass match the only avail email
  and pass.
    - If both match, then signs a jwt and sends it back to the user
      using the authorization+bearer header thing.
    - Otherwise, it sends nothing back, and just a HTTP response error
      code. 403 for now, like iex when I don't provide key
- The client reads the response.
    - If receive status 200 and jwt in header, then it extracts token,
      stores it in localStorage, and changes state of login comp to
      reflect that successful auth took place.
    - If receive error code (403), then it takes some correct action.
      For now, empty the inputs and say `no user with this email and
      password` exists.

### Express middleware stack

First, it seems everything is considered middleware. Middleware is every and any function that accepts a request object, a response object, and a function which will call the next middleware to be called. In that sense, when we write something like

    app.get('/stack/test', (req, res, next) => {
        res.send("message");
    });

This is a middleware that will respond to a request to the path
`/stack/test`, and will finish sending a response. It won't descend to
any deeper middleware. That simplifies things; I've been writing
middleware the whole time.

Was confused about 'middleware stack'. It seemed to me that middleware
gets called in the order it is registered using the `app.METHOD`
functions or `app.use`. Sounds more like a queue. But there is a stack
of function calls, which is why it is called a stack. The calls
proceed from the stack bottom to the stack top and back down again as
function calls finish. 

Each call to `app.use` or `app.METHOD` places the passed-in callback on a stack of functions to call in response to a request. Earlier calls are placed first, later calls placed later. So think of them as saying:

    requestHandlerStack.push(
        'get', // corresponds to app.get, this would be diff for app.use
        '/path/to/handle', // if there is any
        (req, res, next) => { ... });

I have a feeling there is one stack, and the `next()` function finds the next appropriate handler for the request. A rough approx of the rules:

- Any app.METHOD handler whose mount path matches exactly the
  request's URL.
- Any app.use handler whose mounth path is a prefix of the request's
  URL.

```
app.use((req, res, next) => {
    console.log("first: I'm called.");
    next();
    console.log("first: I return.");
});

app.get('/stack/test', (req, res, next) => {
    console.log("second: I'm called.");
    next();
    console.log("second: I return.");
});

app.use('/stack', (req, res, next) => {
    console.log("third: I'm called, and handle any request with /stack as prefix.");
    next();
    console.log("third: I return.");
});

app.get('/stack', (req, res, next) => {
    console.log("3.5: I'm called, and handle exactly GET /stack only.");
    next();
    console.log("3.5: I return.");
});

app.use((req, res, next) => {
    console.log("fourth: I'm called all the time.");
    next();
    console.log("fourth: I return.");
});

app.get('/stack/test', (req, res, next) => {
    console.log("fifth: I'm called, and handle exactly GET /stack/test only.");
    next();
    console.log("fifth: I return.");
});

app.get('/stack/test', (req, res, next) => {
    console.log("sixth: I'm called, and handle exactly GET /stack/test only.");
    next();
    console.log("sixth: I return.");
});  
```

And corresponding output when I make request `GET /stack/test` (:
aligned for legibility):

```
first:  I'm called all the time.
second: I'm called, and handle exactly GET /stack/test only.
third:  I'm called, and handle any request with /stack as prefix.
fourth: I'm called all the time.
fifth:  I'm called, and handle exactly GET /stack/test only.
sixth:  I'm called, and handle exactly GET /stack/test only.
sixth:  I return.
fifth:  I return.
fourth: I return.
third:  I return.
second: I return.
first:  I return.
```

And corresponding output when I make request `GET /stack` (:
aligned for legibility):

```
first:  I'm called all the time.
third:  I'm called, and handle any request with /stack as prefix.
3.5:    I'm called, and handle exactly GET /stack only.
fourth: I'm called all the time.
fourth: I return.
3.5:    I return.
third:  I return.
first:  I return.
```

Since relative order of each handler is always kept, but only the
correct handlers are called, I think there's one large stack where
each entry is stored with some test to see if the request's URL
matches what that handler should handle. Express routers may bundle
everything under it up into a single middleware, which would clean up
that stack considerably.

That would be a bad model if I had one application with a ton of
different possible URLs it could service. That would mean a linear
search through this stack for appropriate handlers. I don't think the
`.use` handlers are stored separately from the `.METHOD` handlers,
because they're always called in the correct order relative to each
other. I think that would be overly complicated if they were stored in
different data structures.

### Others

- I've forgotten the basics of express.
- What does `ReactDOM` do? How does react make sure that
  `document.getElementById` returns an element? Is there some
  `DOMContentLoaded` thing going on somewhere?
- How am I going to show more than one component?
- If I'm ever having HTTP errors with IEX, see here
  <https://iexcloud.io/docs/api/#errors>
- CORS: Why are requests blocked when I specify the 'no-cors' mode?
  Shouldn't it be the opposite?


extending  ideas
================

- Do more than just display color. Color tells you how the stock is
  doing now relative to earlier in the day. That's a little shallow.
  Show a graph of the stocks. Could be from the start of the day. Look
  for a graphing library. Maybe D3?
    - <https://plot.ly/javascript/>
- Show how much the stock price has changed relative to the start of
  the day.
- Make sure to explain what the indicators are. Maybe with a little ?
  hover thing. Figure out how to handle that on a phone.
- Maybe learn how package management would work first. Do that for a
  day. You never did sit down with webpack for very long.
- See if you can get stock data from the past. This way you can make a
  time-machine line feature, let the user buy+sell stocks and see if
  they can make a little $. Like a game.
    - Skip ahead to another day
    - Make time run faster
    - Put an on-screen clock which states the current time. How
      smoothly could this animate? How much power will this sap? After
      creating a basic vers of the app, try creating a millisecond
      clock.
- If I can get timing to work, I can also put a "skip to end of day"
  button, or skip to next day, whatever. I can also use this to
  display a summary of transaction choices. Like I could gather up all
  the transactions for a particular day and company and display them
  on a graph of the prices of that stock over the day. You can see at
  a glance if you bought/sold at the best time to buy/sell. I could
  also do this without the skip time functionality, but it will be
  harder to see because I can only fetch the data as it comes in time.
  A tester will have to test for a while to see this feature.

- Start off with a desktop version, one that works on your desktop.
  Then try to make it work for mobile.

Other 
=====

- The signifiers on alphavantage are meaningless. What does `high
  usage` mean? That people use it so much I should expect it to be
  slow? That it is built to work well even though so many people use
  it?
- The terms on AV like volume, open, close aren't defined anywhere. So
  I dunno what their precise defn is.

<https://www.nerdwallet.com/blog/investing/how-to-buy-stocks/>
==============================================================

> Mutual funds and ETFs are typically best suited to investing for
> long-term goals that are at least 5 years away, like retirement, a
> far-off home purchase or college. 

This could be part of creating an account. What do you want? It could
guide which stocks are shown. Though try to fake this rather than
really do it. You don't know that much about stocks.

> Warren Buffett famously said, “Buy into a company because you want
> to own it," ...  **Start with the company’s annual report** —
> specifically management’s annual letter to shareholders. The letter
> will give you a general narrative of what’s happening with the
> business and provide context for the numbers in the report.

> most of the **information** and **analytical tools** that you need
> to evaluate the business will be **available on your broker’s
> website,** such as SEC filings, conference call transcripts,
> quarterly earnings updates and recent news. Most online brokers also
> provide tutorials on how to use their tools and even basic seminars
> on how to pick stocks.

Look at a few of these for a few companies. See if it would be
complicated to direct users toward these for some companies. If too
complicated, don't do it.

> If you place a market order trade “after hours,” when the markets
> have closed for the day, your order will be placed at the prevailing
> price when the exchanges next open for trading.

<https://www.pandastrike.com/posts/20150311-react-bad-idea/>
============================================================

Huh. Wouldn't have thought that react was bad. Seemd pretty good
actually.

<https://www.nasdaq.com/glossary> 
=================================

<https://www.nasdaq.com/glossary/v/volume> : The volume is the total
number of shares that were bought/sold (they're the same number since
shares don't come out of thin air).  So i assume that volume on a
response from AV means total amt traded w/in that time period. from
the start to the finish.

AV API Key: 46N31OU37KW1L9NG

https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=MSFT&interval=60min&apikey=46N31OU37KW1L9NG

last 3 volume (5min): 1591023 + 460171 + 312435 = 2363629 last 1
volume (15min): 2370916

They don't match, but they're close. Let's try the volumes for a whole
day compared to the whole day volume.

all from 10/2 (60min) : 3089155 + 3156536 + 2316713 + 2325353 +
2974523 + 5091201 + 7093476 = 26046957 all from 10/2 (daily) :
21221191

Once again, they're different. Though this time the volume from the
daily count is lower than the sum of vols from the hourly counts. For
5min and 15min, opposite was true. The 15min count was higher than sum
of 3 5mins.

One possibility is that these are not summaries of what happens every
5 or 15 mins but what happens at an instant of time...? Within a
minute, maybe? Because if these were summaries with every moment
accounted for, then I should be able to do things like:

- Sum up the volumes from summaries of smaller windows to get volumes
  of summaries of larger windows (not true according to data).
- See that the high price of a larger window is the largest of the
  high prices of the summaries of contained smaller windows (not true
  according to data)

<https://www.thebalance.com/investing-lesson-1-introduction-to-the-stock-market-356170>

This is closer to what I wanted

<https://nodejs.org/en/docs/guides/anatomy-of-an-http-transaction/>
===================================================================

This is overview of how the base nodejs HTTPServer works. This should
be the base underneath express.

the `app` that is built is the cb that is provided to node's
`http.createServer`.

    const express = require('express');

This should give me all the exports from `index.js` of express, which
is the single export from `./lib/express`. So that's basically the
index of the project.

Sequelize 
=========

### foreign keys

`source.hasOne(target)`
