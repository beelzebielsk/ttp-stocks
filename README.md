All directions assume that you're starting in the root directory of
the repository. Any time you see a series of commands like so:

    npm install
    npx sequelize db:migrate
    npx sequelize db:seed:all
    cd ..

It is assumed that you're starting off in the repository root. So if
you see one series:

    cmd1
    cmd2
    ...

And then another:

    cmd3
    cmd4
    ...

I'm assuming `cmd1` and `cmd3` are executed in the repository root.

# Setting up this project

In each set of commands, I tell you to navigate back to the root
directory when you're finished. You don't have to navigate exactly as
I've said if you know what you're doing.

First, setup the backend: 

    npm install
    npx sequelize db:migrate
    npx sequelize db:seed:all
    cd ..

Next, setup the frontend. First step is to install frontend packages:

    cd frontend
    npm install
    cd ..

Next is to set the environment variable which holds the token for the
IEX stocks API that this project uses. You have to obtain a token for
the IEX API on your own. You can make an account with them
[here](https://iexcloud.io/cloud-login#/register/). The token has to
be a 'sandbox' token, as I'm using free sandbox data with this
application. The sandbox token will be a string of the form
    
    "Tpk_" long-hexadecimal-number

Once you obtain it, you can set it permanently by doing the following:

    cd frontend/my-app
    echo "REACT_APP_API_KEY='${your_IEX_cloud_token}'" > .env.development.local

Replace the `${your_IEX_cloud_token}` with the sandbox api token you
got earlier from the IEX cloud website.

**NOTE:** 

If you don't want to set up the `.env.development.local` file, you can just do 

    export REACT_APP_API_KEY='${your_IEX_cloud_token}'

In the terminal that you use to run the frontend. Note that this is
not permanent: you will have to re-do this every time you open up a
new terminal to run the frontend.

# Running this project

Open up two terminals, because the backend and frontend will run
simultaneously. All of the following commands assume you are starting
at the root of the repository.

In the first terminal:

    npm start

In the second terminal:

    cd frontend
    npm start
