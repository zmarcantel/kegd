MOCHA_OPTS=--reporter spec

default: deps

deps:
	npm install

run: deps
	nodejs index.js

test: deps
	node_modules/mocha/bin/mocha $(MOCHA_OPTS)
