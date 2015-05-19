kegd
====

Work In Progress.


Minimap
-------

#### Tests

Tests are located in `./test` and follow a pattern of folder hierarchy:

1. {test category}
    * positive.js containing basic unit tests
    * negative.js container error cases, validation checks, etc.


#### Models

Models are in the `./lib/models` directory.

Nohm is the Redis ORM the project uses.


#### Database

Runs against Redis. No auth currently.

DB connection and utility functions are imported byt the `./lib/db` module.


#### API

The API is started by `index.js` and all routes are found in the `./routes` folder.



Useful Commands
---------------

#### make run

Starts the node app.

Installs depenencies if necessary.


#### make test

Runs the mocha test suites.


#### make docs

Generates the docs. I think the generator we use will change soon, but currently uses apidocs.

Docs are placed in `./docs`. If this folder exists, the docs are served over the node app at the url `/docs`.


#### make clean

Remove the node_nodules and documentation directories.

This will also include client cleanup when client has been worked on.
