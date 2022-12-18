#!/usr/bin/env sh

mkdir ./bin/template

npm install

npm run build
npm run test
node ./bin/build-template.js

