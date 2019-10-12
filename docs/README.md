<h1 align="center">
  <img src="https://raw.githubusercontent.com/gordonfn/datastream-schema/master/docs/images/datastream.svg?token=AAIL2PBZU46OCA3XH2SPQBS5VNRQW" alt="DataStream Logo" width="200">
  <br/>
  Data Model Schema
  <br/>
  <br/>
</h1>

<p align="center">JSON Schema, JSON Table Schema, and CSV Template based on US EPA WQX</p>

<p align="center">
  <!--<a href="https://github.com/gordonfn/datastream-wqx"><img src="https://img.shields.io/github/stars/gordonfn/datastream-wqx.svg?style=social&label=Stars" alt="Stars" /></a>-->
  <!--<a href="https://www.npmjs.com/package/datastream-wqx"><img src="https://img.shields.io/npm/v/datastream-wqx.svg" alt="npm version"></a>-->
  <!--<a href="https://www.npmjs.com/package/datastream-wqx"><img src="https://img.shields.io/npm/dm/datastream-wqx.svg" alt="npm downloads"></a>-->
  <!--<a href="https://www.npmjs.com/package/datastream-wqx"><img src="https://img.shields.io/npm/l/datastream-wqx.svg" alt="npm license" /></a>-->
</p>

## Additions / Differences
See [Google Sheet Changelog](https://docs.google.com/spreadsheets/d/1gau2kMxcXiBu1ZdqpT-DO4zrRLNNzo8Ez32pweOYpro#gid=37982279) for allowed value additions and subtraction.



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
