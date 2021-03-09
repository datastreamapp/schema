#!/usr/bin/env sh

mkdir -p bin/template

rm -rf dist

mkdir -p dist/csv
mkdir -p dist/json-schema
mkdir -p dist/json-schema/frontend
mkdir -p dist/json-schema/backend
mkdir -p dist/json-schema/quality-control

cp package.json dist/