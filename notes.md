TODO And Sources
================

<https://www.nerdwallet.com/blog/investing/how-to-research-stocks/> Could give helpful info to show for stocks
<https://reactjs.org/docs/faq-functions.html> Talks about react and speed
<http://jankfree.org/> May help with speed
<https://marmelab.com/blog/2017/02/06/react-is-slow-react-is-fast.html> May help with speed
<https://stackoverflow.com/questions/40714583/how-to-specify-a-port-to-run-a-create-react-app-based-project> default react port is 3000

<https://reactjs.org/docs/create-a-new-react-app.html#create-react-app> How to setup the app for local development
<https://reactjs.org/tutorial/tutorial.html> app tutorial
<https://www.alphavantage.co/documentation/> alpha vantage tutorial

Planning
========

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
- A transaction is a trade of money and stocks at a particular
    time by a user. 
    - So I should store:
        - the user that made the transaction
        - which stock was purchased
        - how many of them were purchased
        - the price per stock or full price of transaction
    - From the look of the mockup, i can buy just one stock from a
      company per transaction, given the form.
- Each user can own more than one stock, but a stock cannot be owned
  by more than one user. Better to call this a *stock balance*, all
  the stocks that they own of a single company. So this needs a table, too.
    - I should store:
        - the user that owns the stock
        - the company name
        - how much stock is owned

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
        2. If the price of the stock is *less than* it was at the day's
           open, display red.
        3. If the price of the stock is *greater than* as it was at
           the day's open, display green.
        4. me: display the change in percent of the stock.
    2. Should display the net worth of all of their stocks in their
       portfolio. Q: How do I calc that?
    3. Should allow user to purchase new stocks from a single company at a time.
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

### Roadblocks

- How do I calculate the worth of a stock? The open/high/low/close
  prices don't really fit with price calculation. I think the quote
  endpoint is what I'm looking for.
    - Generally, what is the precise meanings of the words from AV
      api? What is being reported to me, and how do I use them?
- How do I use sequelize to create my db?
- How do I make sure that sequelize made the correct db? Verify its
  output? Am I doing something wrong which causes changes to not
  happen/persist on my db? Maybe it is the sync function that I'm
  looking for.
- How do I mix the db with express? Should I just clone the hoopla
  backend and scrape out the original db and drop in the db for this
  application? It would get me started, tho I'd have no idea what I
  was doing.

extneding  ideas
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

> most of the **information** and **analytical tools** that you
> need to evaluate the business will be **available on your broker’s
> website,** such as SEC filings, conference call transcripts, quarterly
> earnings updates and recent news. Most online brokers also provide
> tutorials on how to use their tools and even basic seminars on how
> to pick stocks.

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
shares don't come out of thin air).  So i assume that volume on a response from AV means total amt traded w/in that time period. from the start to the finish.

AV API Key: 46N31OU37KW1L9NG

https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=MSFT&interval=60min&apikey=46N31OU37KW1L9NG

last 3 volume (5min): 1591023 + 460171 + 312435 = 2363629
last 1 volume (15min): 2370916

They don't match, but they're close. Let's try the volumes for a whole day compared to the whole day volume.

all from 10/2 (60min) : 3089155 + 3156536 + 2316713 + 2325353 + 2974523 + 5091201 + 7093476 = 26046957
all from 10/2 (daily) : 21221191

Once again, they're different. Though this time the volume from the daily count is lower than the sum of vols from the hourly counts. For 5min and 15min, opposite was true. The 15min count was higher than sum of 3 5mins.

One possibility is that these are not summaries of what happens every 5 or 15 mins but what happens at an instant of time...? Within a minute, maybe? Because if these were summaries with every moment accounted for, then I should be able to do things like:

- Sum up the volumes from summaries of smaller windows to get volumes
  of summaries of larger windows (not true according to data).
- See that the high price of a larger window is the largest of the
  high prices of the summaries of contained smaller windows (not true
  according to data)

Sequelize
=========

### foreign keys

`source.hasOne(target)`
