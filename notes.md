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
    time by a user. So I should store:
    - the user that made the transaction
    - which stock was purchased
    - how many of them were purchased
    - the price per stock or full price of transaction
- Each user can own more than one stock, but a stock cannot be owned
  by more than one user. Better to call this a *stock balance*, all
  the stocks that they own of a single company. So this needs a table, too.

App ideas

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

