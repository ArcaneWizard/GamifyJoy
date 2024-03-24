
## Repo setup:
   To setup the codebase on your local dev environment, first run ```npm install```.
   Next we must specify some environment variables. Create  a ```.env``` file in the main directory and specify the following.
   Feel free to copy paste. 

    PORT=5500
    MONGOATLAS_URL= {insert MongoDB database URL here. Can leave empty to use localhost as database}
    NODE_ENV="not production"

## Get the app up and running:
  To start the server, cd into the server folder and run ```nodemon index.js```.

  To start the client, cd into the client folder and run ```npm start``` to kick off the react app.

## Linting:
  We use ESLint as our linter to enforce consistent styling rules. See [ESLint.md](ESLint.md) for more info.