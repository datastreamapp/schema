<h1 align="center">
  <img src="https://raw.githubusercontent.com/gordonfn/datastream-wqx/master/docs/images/datastream.png?token=ABC9POoWo80cE0P25opVHbdsuQnW30g6ks5as_29wA%3D%3D" alt="DataStream Logo" width="200">
  <br/>
  <img src="https://raw.githubusercontent.com/gordonfn/datastream-wqx/master/docs/images/water-quality-exchange.gif?token=ABC9PNs8vDDUB-LYzDfSdeJ4lvH4JccXks5as_4dwA%3D%3D" alt="WQX Logo" width="200">
  <br/>
  DataStream WQX<br />JSON Schema, JSON Table Schema, and CSV Template
  <br/>
  <br/>
</h1>

<p align="center">
  <a href="https://github.com/gordonfn/datastream-wqx"><img src="https://img.shields.io/github/stars/gordonfn/datastream-wqx.svg?style=social&label=Stars" alt="Stars" /></a>
  <a href="https://www.npmjs.com/package/datastream-wqx"><img src="https://img.shields.io/npm/v/datastream-wqx.svg" alt="npm version"></a>
  <a href="https://www.npmjs.com/package/datastream-wqx"><img src="https://img.shields.io/npm/dm/datastream-wqx.svg" alt="npm downloads"></a>
  <a href="https://www.npmjs.com/package/datastream-wqx"><img src="https://img.shields.io/npm/l/datastream-wqx.svg" alt="npm license" /></a>
</p>

## Additions / Differences

### Project
- `DatasetName` - Equivalent to `ProjectName` with maxLength set to 255.

### Location
- `MonitoringLocationRegion` - Equivalent to using `Monitoring Location County Code` from the WQX. Can be a Canadian Watershed, but left flexible to any type of region.
- `MonitoringLocationType` - Added `Wetland` & `Lake/Pond` to the allowed values. Removed `Lake`.
- `MonitoringLocationWaterbody` - Meta data

### Activity
- `ActivityType` - Added `Quality Control` to the allowed values.
- `ActivityMediaName` - Added `Surface Water`

- `ActivityDepthHeightMeasure` - Added maximum restriction due to only recording water samples.
- `ResultAnalyticalMethodName` - Added for readability
- `ResultAnalyticalMethodID` - Removed allowed values
- `ResultAnalyticalMethodContext` - Added `VMV` to allowed values.
- `ResultUnit` / `ResultDetectionQuantitationLimitUnit` - Added "REL","CTU","HZN".
- `CharacteristicName` - Added `Silver Dioxide`, `Apparent Colour`, `Total Hardness`
- `LabratorySampleID` - Meta data

- `ActivityStartTimeZone` / `ActivityEndTimeZone` / `AnalysisStartTimeZone` - Changed format to follow ISO 8601 ex `-0600`


### Naming
We opted for `PascalCase` for header names to reduce `csv` parsing issues and improving `R` imports.

### Locations
In WQX the use of `State` and `County` are used. These are very `USA` specific, thus we have chosen to use `MonitoringLocationRegion` to allow for a broader meaning that can be applied internationally.

### Dates, Times, and Timezones
In WQX the use is `Date`, `Time`, and `TimeZone`. `TimeZone` is validated against timezone acronyms, these acronyms, however, do not scale internationally. Because of this, we've joined these fields into one, `Timestamp`, that will follow [`ISO 8601`](https://en.wikipedia.org/wiki/ISO_8601) standard (ex. 2018-02-14T18:59:59-0600).

Alternatively, the use of [`IANA Time Zone Database`](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones) notation was considered, and opted against due to the increased complexity involved compared to `ISO 8601`.

Both of these solutions also decrease errors with the uncertainty that can come up with daylight savings time.

In the case where a latitude and longitude is present, we infer the timezone from the date at the location. Code snippet can be made available upon request.

## Install
```bash
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

const validate = ajv.compile(jsonschema);

let data = {}; // must not be const to allow coerce of types

// like data will be coming from csv and will have blanks in the form of empty string
Object.keys(data).forEach((key) => (data[key] == null || data[key] === '') && delete data[key]);

const valid = validate(data);
```

### Browser
```html
<script src=""></script>
```
```js
TODO
const validate = require('@datastream/schema/validate');
let data = {}; // must not be const to allow coerce of types
const valid = validate(data);
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
- [WQX](https://github.com/gordonfn/wqx)
- [R Import/Export](https://cran.r-project.org/doc/manuals/r-release/R-data.html)
- [Watersheds](https://open.canada.ca/data/en/dataset/dc639a40-8893-11e0-96ca-6cf049291510) - possible list for `MonitoringLocationRegion`

<div align="center">
  <h3>Maintained By</h3>
  <a href="https://tesera.com"><img src="https://raw.githubusercontent.com/gordonfn/datastream-wqx/master/docs/images/tesera.png?token=ABC9PPDeMtIvm_7YPZRL69QPAAYSfMW5ks5as_3WwA%3D%3D" alt="Tesera Systems Inc. Logo" width="200"></a>
</div>
