#!\\usr\\bin\\env sh

mkdir .\\bin\\template

npm install

mkdir -p primary
mkdir -p frontend
mkdir -p backend
mkdir -p quality-control

node .\\bin\\build-values.js
node .\\bin\\build-logic.js

node .\\bin\\build.js
node .\\bin\\build-template.js

mocha
