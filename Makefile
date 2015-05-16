MOCHA_OPTS=--reporter spec

DOCS=docs
APIDOC_OPTS=-i routes/

default: deps

deps:
	npm install

run: deps
	nodejs index.js

test: deps
	node_modules/mocha/bin/mocha $(MOCHA_OPTS)

docs: doc
doc: deps
	mkdir -p $(DOCS)
	node_modules/apidoc/bin/apidoc $(APIDOC_OPTS) -o $(DOCS)

clean:
	rm -rf $(DOCS)
	rm -rf node_modules
