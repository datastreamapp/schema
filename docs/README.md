<h1 align="center">
  <img src="https://raw.githubusercontent.com/gordonfn/datastream-wqx/master/docs/images/datastream.svg?token=ABC9POoWo80cE0P25opVHbdsuQnW30g6ks5as_29wA%3D%3D" alt="DataStream Logo" width="200">
  <br/>
  <img src="https://raw.githubusercontent.com/gordonfn/datastream-wqx/master/docs/images/water-quality-exchange.gif?token=ABC9PNs8vDDUB-LYzDfSdeJ4lvH4JccXks5as_4dwA%3D%3D" alt="WQX Logo" width="200">
  <br/>
  DataStream Schema
  <br/>
  <br/>
</h1>

<p align="center">JSON Schema, JSON Table Schema, and CSV Template based on EPA WQX</p>

<p align="center">
  <!--<a href="https://github.com/gordonfn/datastream-wqx"><img src="https://img.shields.io/github/stars/gordonfn/datastream-wqx.svg?style=social&label=Stars" alt="Stars" /></a>-->
  <!--<a href="https://www.npmjs.com/package/datastream-wqx"><img src="https://img.shields.io/npm/v/datastream-wqx.svg" alt="npm version"></a>-->
  <!--<a href="https://www.npmjs.com/package/datastream-wqx"><img src="https://img.shields.io/npm/dm/datastream-wqx.svg" alt="npm downloads"></a>-->
  <!--<a href="https://www.npmjs.com/package/datastream-wqx"><img src="https://img.shields.io/npm/l/datastream-wqx.svg" alt="npm license" /></a>-->
</p>

## Additions / Differences
See [Google Sheet Changelog](https://docs.google.com/spreadsheets/d/1gau2kMxcXiBu1ZdqpT-DO4zrRLNNzo8Ez32pweOYpro#gid=37982279) for allowed value additions and subtraction.

### Project
- `DatasetName` - Equivalent to `ProjectName` with maxLength set to 255.

### Activity
- `ActivityDepthHeightMeasure` - Added maximum restriction due to only recording water samples.
- `ResultAnalyticalMethodName` - Added for readability
- `ResultAnalyticalMethodID` - Removed allowed values
- `LabratorySampleID` - Added to improve Metadata
- `ActivityStartTimeZone` / `ActivityEndTimeZone` / `AnalysisStartTimeZone` - Changed format to follow ISO 8601 ex `-0600`

### Naming
We opted for `PascalCase` for header names to reduce `csv` parsing issues and improving `R` imports.

### Locations
In WQX the use of `State` and `County` are used. These are very `USA` specific, thus we have chosen to use `MonitoringLocationRegion` to allow for a broader meaning that can be applied internationally.

### Dates, Times, and Timezones
In WQX the use is `Date`, `Time`, and `TimeZone`. `TimeZone` is validated against timezone acronyms, these acronyms, however, do not scale internationally. Because of this, we've joined these fields internally into one, `Timestamp`, that will follow [`ISO 8601`](https://en.wikipedia.org/wiki/ISO_8601) standard (ex. 2018-02-14T18:59:59-0600).

Alternatively, the use of [`IANA Time Zone Database`](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones) notation was considered, and opted against due to the increased complexity involved compared to `ISO 8601`.

Both of these solutions also decrease errors with the uncertainty that can come up with daylight savings time.

In the case where a latitude and longitude is present, we infer the timezone from the date at the location.

## Install
You can download the compiled schema from [DataStream.org](www.datastream.org/cdn/json-schema.json).
```bash
# Public
$ npm i
$ npm run build

# Private
$ npm i @datastream/schema
```



## Use
### CSV Template
We're build out `csv` template to follow `R` import/export best practices. It can be found `@datastream/schema/csv/template.csv`.

### NodeJS
```javascript
const Ajv = require('ajv');
const jsonschema = require('@datastream/schema/json-schema');

const ajv = new Ajv({
    v5: true,
    format:'full',
    coerceTypes: true,
    allErrors: true,
    useDefaults: true
});
require('ajv-keywords')(ajv, ['transform']); // Optional: `transform` removes strictness surrounding value character case.
const validate = ajv.compile(jsonschema);

let data = {}; // must not be const to allow coerce of types

// like data will be coming from csv and will have blanks in the form of empty string
Object.keys(data).forEach((key) => (data[key] == null || data[key] === '') && delete data[key]);

const valid = validate(data);
```

### Browser - WIP
```html
<script src=""></script>
```
```js
const validate = require('@datastream/schema/validate');
let data = {}; // must not be const to allow coerce of types
const valid = validate(data);
```

## Contributing

### Development
```bash
brew install jq nvm
nvm get 10
npm i
```

### Publishing
```bash
# update version in `package.json`
npm run test
cd dist
npm publish
```

### Contributors
- [willfarrell](https://github.com/willfarrell)

## References
- [WQX](https://github.com/gordonfn/wqx)
- [R Import/Export](https://cran.r-project.org/doc/manuals/r-release/R-data.html)
- [Watersheds](https://open.canada.ca/data/en/dataset/dc639a40-8893-11e0-96ca-6cf049291510) - possible list for `MonitoringLocationRegion`
