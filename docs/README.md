<h1 align="center">
  <img src="https://raw.githubusercontent.com/gordonfn/datastream-schema/master/docs/images/datastream.svg?token=AAIL2PBZU46OCA3XH2SPQBS5VNRQW" alt="DataStream Logo" width="200">
  <br/>
  Data Model Schema for Water Quality Monitoring
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

In addition to DataStream's goals of increasing access to water quality data across Canada, we are also working to create standardization amongst the diverse landscape of water quality data schemas currently being used. 

**We hope to do this by:**
* Creating a standard based on previously designed and used standards (in our case the WQX model from the USEPA)
* Sharing this standard in a machine readable format so that it can easily be replicated
* Allowing the standard to be open access so that others may help us build a tool that is useful for everyone

## Background (Lindsay and/or Carolyn can you fill this section in)

DataStream was first piloted in the Mackenzie Basin through a unique collaboration between The Gordon Foundation and the Government of the Northwest Territories, Mackenzie DataStream’s Founding Partner. Part of the collaboration of this process was the creation of a data model that would both meet the needs of those in the GNWT and 

**Stuff that could be worth adding:**
* where did the schema come from?
* why wqx?
* The model change and why?
* who we worked with to develop it

### Timeline (Lindsay and/or Carolyn can you fill this section in)
* a yearly breakdown of how long it's taken us to get to where we are today

### Tips for Commenting on the Standard


## Additions / Differences
The DataStream open data standard is an evolving and changing model and therefore is subject to various additions/differences over time. These changes most often deal with the addition or subtraction of allowed values. To see the most recent version number as well as any changes made since the last please see the [Google Sheet Changelog](https://docs.google.com/spreadsheets/d/1gau2kMxcXiBu1ZdqpT-DO4zrRLNNzo8Ez32pweOYpro#gid=37982279).

## Install
You can download the compiled schema from [DataStream.org](www.datastream.org/cdn/json-schema.json).

Alternatively, you can build it from the source to include in your project.

```bash
# Public
$ npm i
$ npm run build

# Private
$ npm i @datastream/schema
```

## Use
### CSV Template
The `csv` template follows `R` import/export best practices and can be found `@datastream/schema/csv/template.csv`.

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
