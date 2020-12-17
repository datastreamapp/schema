#!/usr/bin/env sh

mkdir -p bin/template

rm -rf dist

mkdir -p dist/csv
mkdir -p dist/json-schema
mkdir -p dist/json-schema-legacy

cp package.json dist/