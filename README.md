# Setting up this project

Run the following commands, starting from the root of this repository:

    cd backend
    npm install
    npx sequelize db:migrate
    npx sequelize db:seed:all
    cd ../frontend/my-app
    npm install

Everything is now set up.

# Running up this project

Open up two terminals, because the backend and frontend will run
simultaneously. All of the following commands assume you are starting
at the root of the repository.

In the first terminal:

    cd backend
    npm start

In the second terminal:

    cd frontend/my-app
    npm start
