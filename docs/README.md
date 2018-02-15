<h1 align="center">
  <img src="https://raw.githubusercontent.com/gordonfn/datastream-wqx/master/docs/images/datastream.png" alt="DataStream Logo" width="200">
  <br/>
  <img src="https://raw.githubusercontent.com/gordonfn/datastream-wqx/master/docs/images/water-quality-exchange.gif" alt="WQX Logo" width="200">
  <br/>
  Datastream WQX: JSON Schema and JSON Table Schema
  <br/>
  <br/>
</h1>

<p align="center">
  <a href="https://github.com/gordonfn/datastream-wqx"><img src="https://img.shields.io/github/stars/gordonfn/datastream-wqx.svg?style=social&label=Stars" alt="Stars" /></a>
  <a href="https://www.npmjs.com/package/datastream-wqx"><img src="https://img.shields.io/npm/v/datastream-wqx.svg" alt="npm version"></a>
  <a href="https://www.npmjs.com/package/datastream-wqx"><img src="https://img.shields.io/npm/dm/datastream-wqx.svg" alt="npm downloads"></a>
  <a href="https://www.npmjs.com/package/datastream-wqx"><img src="https://img.shields.io/npm/l/datastream-wqx.svg" alt="npm license" /></a>
  <a href="http://packagequality.com/#?package=datastream-wqx"><img src="http://npm.packagequality.com/shield/datastream-wqx.svg" alt="Package Quality" /></a>
</p>


## Additions
### Program

### Project

### Location

### Activity

## Differences

### Locations
In WQX the use of `State` and `County` are used. These are very `USA` specific, thus we have chosen to use `MonitoringLocationRegion` to allow for a broader meaning that can be applied internationally.

### Dates, Times, and Timezones
In WQX the use is `Date`, `Time`, and `TimeZone`. `TimeZone` is validated against timezone acronyms, these acronyms however do not scale internationally. Because of this we've joined these fields in to one, `Timestamp`, that will follow `ISO 8601` standard (ex. 2018-02-14T18:59:59-0600).

Alternatively, the use of [`tz`]https://en.wikipedia.org/wiki/List_of_tz_database_time_zones) notation was considered, and opted against due to the increased complexity involved compared to `ISO 8601`.

## Limitations
- Currently only support validation of `CA` timezones

## Install
```bash
$ npm i datastream-wqx
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

## TODO
- [ ] add file level definitions to help minimize size
- [ ] script to build json-schema
- [ ] script to build json table schema

<div align="center">
  <h3>Maintained By</h3>
  <a href="https://tesera.com"><img src="https://raw.githubusercontent.com/gordonfn/datastream-wqx/master/docs/images/tesera.png" alt="Tesera Systems Inc. Logo" width="200"></a>
</div>
