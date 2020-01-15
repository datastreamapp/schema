<h1 align="center">
  <img src="https://raw.githubusercontent.com/gordonfn/datastream-schema/master/docs/images/datastream.svg?token=AAIL2PBZU46OCA3XH2SPQBS5VNRQW" alt="DataStream Logo" width="200">
  <br/>
  DataStream Open Data Schema for Water Quality Data
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


## DataStream 

DataStream (www.DataStream.org) is an online open-access platform for sharing water quality data. Data is uploaded, stored and shared in DataStream’s Open Data Schema – a model based on the WQX standard for the Exchange of Water Quality Data. DataStream is free to use and allows users to query, visualize, and download data in this standardized format. To date, over 3 million water quality observations have been published across DataStream’s three regional platforms (Mackenzie Basin, Lake Winnipeg Basin, and Atlantic Canada) by watershed groups, Indigenous organizations, researchers and governments at all levels. 

[INSERT PIC]

DataStream is led nationally by The Gordon Foundation and is carried out in collaboration with regional partners and monitoring networks. Data contributors maintain ownership of their data which are published under open data licenses. 

## DataStream Open Data Schema (DS-WQX)
To ensure consistent formatting of water data and to avoid ambiguous or missing information, we developed an observation-level data schema based on the WQX standard for the Exchange of Water Quality Data. 

The WQX schema was developed by the US Environmental Protection Agency (EPA) and the US Geological Society (USGS) and is an implementation of the ESAR (Environmental Sampling, Analysis and Results) data standard. It was designed to enable multiple monitoring entities to share results in a common format. 

In 2018, The Gordon Foundation led a comprehensive review process to determine how this model could be adapted to best meet the needs of diverse water monitoring initiatives in Canada. DataStream’s science and technical advisory team, regional partners and collaborators, data contributors, government representatives as well as other members of the water community were engaged in this process. 

DataStream’s open data schema (DS-WQX v1.0) was fully implemented across all regional DataStream platforms in 2019. 

## Changelog
The DataStream open data schema will continue to evolve to meet user needs and therefore is subject to various updates over time. These changes most often deal with the addition of new allowed values. To view the most recent version, record of changes and version number please see the [DataStream Upload Template](https://docs.google.com/spreadsheets/d/1gau2kMxcXiBu1ZdqpT-DO4zrRLNNzo8Ez32pweOYpro#gid=37982279).

## Dataset Metadata
In addition to the observation-level information in DS-WQX, DataStream uses the following schema for dataset metadata.

[INSERT TABLE]

## Install
You can download the compiled DS-WQX schema from [DataStream.org](www.datastream.org/cdn/json-schema.json).

Alternately, you can build it from the source to include in your project.

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

## Publish
```bash
# chagne version in package.json
npm test
cd dist
npm publish
```

## Contributing

### Commenting on the Schema

If you wish to comment on the schema please create an issue [here](https://github.com/gordonfn/datastream-schema/issues).

* For information on opening an issue review github's [creating an issue](https://help.github.com/en/github/managing-your-work-on-github/creating-an-issue) document

You can also email us at <datastream@gordonfn.org> or visit us at:

* [Mackenzie DataStream](https://mackenziedatastream.ca/#/)
* [Atlantic DataStream](https://atlanticdatastream.ca/#/)
* [Lake Winnipeg DataStream](https://lakewinnipegdatastream.ca/#/)

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
- [DataStream Schema Google SpreadSheet](https://docs.google.com/spreadsheets/d/1LPIeMOt9xeDVuoKpkmFJpXNfuzSi2_8y46wZ-YUAdao/edit?pli=1#gid=37982279)
- [WQX](https://github.com/gordonfn/wqx)
- [R Import/Export](https://cran.r-project.org/doc/manuals/r-release/R-data.html)
- [Watersheds](https://open.canada.ca/data/en/dataset/dc639a40-8893-11e0-96ca-6cf049291510) - possible list for `MonitoringLocationRegion`
