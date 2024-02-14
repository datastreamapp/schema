#!\\usr\\bin\\env sh

mkdir .\\bin\\template

npm install

mkdir -p primary
mkdir -p extract
mkdir -p frontend
mkdir -p backend
mkdir -p quality-control
mkdir -p lookup
mkdir -p locales
cp src/lookup/* lookup/

node .\\bin\\build-values.js
node .\\bin\\build-logic.js
node .\\bin\\build-lookup.js

sh .\\bin\\build

c8 ava

node .\\bin\\build-template.js
