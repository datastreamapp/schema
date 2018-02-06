<h1 align="center">
  <img src="https://raw.githubusercontent.com/gordonfn/datastream-wqx/master/docs/images/logo.gif" alt="WQX Logo" width="200">
  <br>
  Water Quality Exchange (WQX): JSON Schema and JSON Table Schema
  <br>
  <br>
</h1>

<p align="center">
  <a href="https://github.com/gordonfn/datastream-wqx"><img src="https://img.shields.io/github/stars/gordonfn/datastream-wqx.svg?style=social&label=Stars" alt="Stars" /></a>
  <a href="https://www.npmjs.com/package/wqx"><img src="https://img.shields.io/npm/v/wqx.svg" alt="npm version"></a>
  <a href="https://www.npmjs.com/package/wqx"><img src="https://img.shields.io/npm/dm/wqx.svg" alt="npm downloads"></a>
  <a href="https://www.npmjs.com/package/wqx"><img src="https://img.shields.io/npm/l/wqx.svg" alt="npm license" /></a>
</p>


## Additions
### Project

### Location

## Differences

### Timezone
In this repo we use `tz` notation for identifying timezones (https://en.wikipedia.org/wiki/List_of_tz_database_time_zones). 
Abbreviations are not globally unique and we feel it is important to allow samples from all timezones.
We have proved a function that will allow you to convert america timezone abbreviations to `tz` via `makeTimezone(abbr)`.

## Install
```bash
$ npm i wqx
```

## Schemas
### JSON Schema

### JSON Table Schema

## Use
### nodeJS
```javascript
const Ajv = require('ajv');
const jsonschema = requrie('wqx/schema/datastream');


```

### Browser
```html

```

```javascript

```

## Contributing

### Update WQX Lists
Find `^\s*(.*)`, Replace `"$1",`.

## References
- http://www.exchangenetwork.net
- https://www3.epa.gov/storet/archive/web/wqx.html
- https://www.epa.gov/waterdata/water-quality-exchange-web-template-files -> WQX Web Lab Results Template
