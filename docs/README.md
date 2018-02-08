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
  <a href="http://packagequality.com/#?package=wqx"><img src="http://npm.packagequality.com/shield/wqx.svg" alt="Package Quality" /></a>
</p>


## Additions
### Project

### Location

## Differences

### Timezone
In this repo we use `tz` notation for identifying timezones (https://en.wikipedia.org/wiki/List_of_tz_database_time_zones). 
Abbreviations are not globally unique and we feel it is important to allow samples from all timezones.
We have proved a function that will allow you to convert america timezone abbreviations to `tz` via `makeTimezone(abbr)`.

## Limitations
- Currently only support validation of `CA` timezones

## Install
```bash
$ npm i wqx datastream-wqx
```

## Schemas
### JSON Schema

### JSON Table Schema

## Use
### nodeJS
```javascript
const Ajv = require('ajv');
const jsonschema = requrie('wqx/json-schema/datastream');


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
- [About](https://www3.epa.gov/storet/archive/web/wqx.html)
- [Web Template Files](https://www.epa.gov/waterdata/water-quality-exchange-web-template-files)
- [Schema (XML)](http://www.exchangenetwork.net/data-exchange/wqx/)
- [Schema Allowed Values (XML)](http://www.epa.gov/storet/wqx/wqx_getdomainvalueswebservice.html)
