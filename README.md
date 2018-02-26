<h1 align="center">
  <img src="https://raw.githubusercontent.com/gordonfn/datastream-wqx/master/docs/images/datastream.png" alt="DataStream Logo" width="200">
  <br/>
  <img src="https://raw.githubusercontent.com/gordonfn/datastream-wqx/master/docs/images/water-quality-exchange.gif" alt="WQX Logo" width="200">
  <br/>
  DataStream WQX<br />JSON Schema and JSON Table Schema
  <br/>
  <br/>
</h1>

<p align="center">
  <a href="https://github.com/gordonfn/datastream-wqx"><img src="https://img.shields.io/github/stars/gordonfn/datastream-wqx.svg?style=social&label=Stars" alt="Stars" /></a>
  <a href="https://www.npmjs.com/package/datastream-wqx"><img src="https://img.shields.io/npm/v/datastream-wqx.svg" alt="npm version"></a>
  <a href="https://www.npmjs.com/package/datastream-wqx"><img src="https://img.shields.io/npm/dm/datastream-wqx.svg" alt="npm downloads"></a>
  <a href="https://www.npmjs.com/package/datastream-wqx"><img src="https://img.shields.io/npm/l/datastream-wqx.svg" alt="npm license" /></a>
</p>

## CSV Template
We're build out `csv` template to follow `R` import/export best practices.

TODO script to build and link

## Additions
### Program
A higher level than Project that can contain multiple Projects.

- `ProgramName`
- `ProgramDescription`
- `ProgramType`

### Project
- `ProjectStatus`
- `ProjectMethod`

### Location
- `MonitoringLocationRegion` - Equivalent to using `Monitoring Location Country Code` from the WQX.
- `MonitoringLocationWaterbody`

### Activity
- `ActivityStartTimestamp` - A consolidation of `ActivityStartDate`, `ActivityStartTime`, and `ActivityStartTimeZone`
- `ActivityEndTimestamp` - A consolidation of `ActivityEndDate`, `ActivityEndTime`, and `ActivityEndTimeZone`
- `ResultAnalyticalMethodName`
- `AnalysisStartTimestamp` - A consolidation of `AnalysisStartDate`, `AnalysisStartTime`, and `AnalysisStartTimeZone`

## Differences
- `MonitoringLocationHorizontalCollectionMethod` - Defaults to `Unknown`
- `MonitoringLocationHorizontalCoordinateReferenceSystem` - defaults to `UNKWN`
- `ActivityDepthHeightMeasure` - Added maximum restriction due to only recording water samples.

### Naming
We opted for `CamelCase` for header names to reduce `csv` parsing issues and improving `R` imports.

### Locations
In WQX the use of `State` and `County` are used. These are very `USA` specific, thus we have chosen to use `MonitoringLocationRegion` to allow for a broader meaning that can be applied internationally.

### Dates, Times, and Timezones
In WQX the use is `Date`, `Time`, and `TimeZone`. `TimeZone` is validated against timezone acronyms, these acronyms however do not scale internationally. Because of this we've joined these fields in to one, `Timestamp`, that will follow `ISO 8601` standard (ex. 2018-02-14T18:59:59-0600).

Alternatively, the use of [`tz`](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones) notation was considered, and opted against due to the increased complexity involved compared to `ISO 8601`.

## Install
```bash
$ npm i datastream-wqx
```

## Use
### nodeJS
```javascript
const Ajv = require('ajv');
const jsonschema = requrie('datastream-wqx/json-schema');
```

### Browser
```html

```

```javascript

```

## Contributing

### Publishing
```bash
# update version in `package.json`
npm run build
cd dist
npm publish
```

### Contributors
- [willfarrell](https://github.com/willfarrell)

## References
- [WQX](hhttps://github.com/gordonfn/wqx)
- [R Import/Export](https://cran.r-project.org/doc/manuals/r-release/R-data.html)

## TODO
- [ ] add file level definitions to help minimize size
- [ ] script to build json table schema

<div align="center">
  <h3>Maintained By</h3>
  <a href="https://tesera.com"><img src="https://raw.githubusercontent.com/gordonfn/datastream-wqx/master/docs/images/tesera.png" alt="Tesera Systems Inc. Logo" width="200"></a>
</div>
