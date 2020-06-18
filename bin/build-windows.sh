#!\\usr\\bin\\env sh

mkdir .\\bin\\template

mkdir -p .\\dist\\csv
mkdir -p .\\dist\\json-schema
mkdir -p .\\dist\\json-schema-legacy

node .\\bin\\build-values.js
node .\\bin\\build-logic.js

node .\\bin\\build.js
node .\\bin\\build-template.js

mocha
