<h1 align="center">
  <img src="https://raw.githubusercontent.com/gordonfn/schema/main/docs/images/datastream.svg?sanitize=true" alt="DataStream Logo" width="400">
  <br/>
  DataStream WQX Open Data Schema for Water Quality Data
  <br/>
  <br/>
</h1>

<p align="center">Download the latest version in <a href="https://s3.ca-central-1.amazonaws.com/datastream-atlantic-upload-template/schema-v2.0.json" target="_blank">JSON Schema</a>, <a href="https://docs.google.com/spreadsheets/d/1P4GcY5R2LbGGiT6aFwkQDA8dP8im0S6MyeBFvOEkjJg" target="_blank">Google SpreadSheet</a>, <a href="https://s3.ca-central-1.amazonaws.com/datastream-atlantic-upload-template/DataStream Upload Template - Public v2.0.xlsb" target="_blank">Excel</a>, and <a href="https://s3.ca-central-1.amazonaws.com/datastream-atlantic-upload-template/schema-v2.0.csv" target="_blank">CSV</a> template formats.</p>

<p align="center">
  <!--<a href="https://github.com/gordonfn/schema"><img src="https://img.shields.io/github/stars/gordonfn/schema.svg?style=social&label=Stars" alt="Stars" /></a>-->
  <!--<a href="https://www.npmjs.com/package/schema"><img src="https://img.shields.io/npm/v/schema.svg" alt="npm version"></a>-->
  <!--<a href="https://www.npmjs.com/package/schema"><img src="https://img.shields.io/npm/dm/schema.svg" alt="npm downloads"></a>-->
  <!--<a href="https://www.npmjs.com/package/schema"><img src="https://img.shields.io/npm/l/schema.svg" alt="npm license" /></a>-->
</p>

## DataStream 

DataStream ([DataStream.org](http://gordonfoundation.ca/initiatives/datastream)) is an online open-access platform for sharing water quality data. Data is uploaded, stored and shared in DataStream’s Open Data Schema -- a model based on the WQX standard for the Exchange of Water Quality Data. DataStream is free to use and allows users to query, visualize, and download data in this standardized format. To date, over 9 million water quality observations have been published across DataStream’s three regional platforms (Mackenzie DataStream,  Lake Winnipeg DataStream, and Atlantic DataStream) by watershed groups, Indigenous organizations, researchers and governments at all levels.

<!--<div align="center">
  <a href="http://gordonfoundation.ca"><img src="https://raw.githubusercontent.com/gordonfn/wqx/master/docs/images/the-gordon-foundation.svg" alt="The Gordon Foundation Logo" width="200"></a>
</div>-->

DataStream is led nationally by [The Gordon Foundation](http://gordonfoundation.ca) and is carried out in collaboration with regional partners and monitoring networks. Data contributors maintain ownership of their data which are published under open data licenses.

## DataStream Open Data Schema (DS-WQX)
To ensure consistent formatting of water data and to avoid ambiguous or missing information, we developed an observation-level data schema based on the WQX standard for the Exchange of Water Quality Data. 

The WQX schema was developed by the US Environmental Protection Agency (EPA) and the US Geological Society (USGS) and is an implementation of the ESAR (Environmental Sampling, Analysis and Results) data standard. It was designed to enable multiple monitoring entities to share results in a common format. In the US, the WQX schema is used on the US EPA’s Water Quality Portal to share over 340 million water quality data records data from 400 federal, state, tribal and other partners. 

In 2018, The Gordon Foundation led a comprehensive review process to determine how this model could be adapted to best meet the needs of diverse water monitoring initiatives in Canada. DataStream’s science and technical advisory team, regional partners and collaborators, data contributors, government representatives as well as other members of the water community were engaged in this process. 

DataStream’s open data schema (DS-WQX v1.0) was fully implemented across all regional DataStream platforms in 2019. 

## Changelog
The DataStream open data schema will continue to evolve to meet user needs and therefore is subject to various updates over time (e.g. addition of new allowed values). To view the most recent version number and record of changes please see the [DataStream Upload Template](https://docs.google.com/spreadsheets/d/1LPIeMOt9xeDVuoKpkmFJpXNfuzSi2_8y46wZ-YUAdao/edit?usp=sharing).

## Dataset Metadata
In addition to the observation-level information in DS-WQX, DataStream uses the following schema for dataset metadata.

Field                        | Mandatory      | Description
-----------------------------|----------------|-------------
Dataset Name                 | Yes            | A short self-explanatory title of the dataset
Citation                     | Yes            | How the data should be cited if it is used by others 
Data Steward Email           | Yes            | Email address publically associated with the dataset
Data Upload Organization     | Yes            | The name of the organization (or researcher) that is uploading the data to DataStream
Abstract                     | Yes            | A description of the dataset including purpose and nature of monitoring efforts
Data Collection Organization | Yes            | Name of the organization or other parties responsible for collecting the data
Data Collection Information  | No             | Information about how the data were collected such as sampling methods, equipment, calibration, QA/QC protocols
Data Processing              | No             | Description of data cleaning, processing and/or QA/QC that was done to the data
Funding Sources              | No             | Funders of the monitoring project
Other Data Sources           | No             | Cite any third party sources of data included in the dataset
ISO Category                 | Yes            | ISO 19115 Topic Category (dropdown list)
Keywords                     | No             | Keywords related to the dataset
Licensing & Attribution      | Yes            | Choose from Attribution License (ODC-By) or Public-Domain Dedication and License (PDDL) or Open Government license 
Data Disclaimer              | No             | Any additional disclaimer text regarding the data that is not covered in data license
Date Published               | Auto-generated | Date the dataset is published on DataStream 
Date Last Updated            | Auto-generated | Date of last update to the dataset on DataStream
Version Number               | Auto-generated | Version number of the dataset
DOI                          | Auto-generated | Digital Object Identifier (assigned by DataStream unless a pre-existing DOI for data is entered)
Bounding Box                 | Auto-generated | Geographic area covered by dataset 

## Special Case Tests
In addition to our schema enforcing allowed values the column conditional logic; we have included additional check for common errors.

- `Dissolved oxygen (DO)` should not be in `%`
- `Dissolved oxygen saturation` should not be less than `0%`
- `Hardness` should not be less than or equal to `0`
- `pH` should be within `0` and `14`
- `Temperature` should be within `-100 degC` and `100 degC`

## Install
You can download the compiled DS-WQX schema from above.

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
The `csv` template follows `R` import/export best practices.

### NodeJS
```javascript
const Ajv = require('ajv');
const jsonschema = require('@datastream/schema/json-schema/index.json');

const ajv = new Ajv({
 schemaId: 'auto',
 format: 'full',
 coerceTypes: true,
 allErrors: true,
 useDefaults: true
})
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
const validate = require('@datastream/schema/json-schema');
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

If you wish to comment on the schema please [open an issue](https://github.com/gordonfn/schema/issues).

* For information on opening an issue review github's [creating an issue](https://help.github.com/en/github/managing-your-work-on-github/creating-an-issue) document

You can also email us at <datastream@gordonfn.org> or visit us at:

* [Atlantic DataStream](https://atlanticdatastream.ca/)
* [Lake Winnipeg DataStream](https://lakewinnipegdatastream.ca/)
* [Mackenzie DataStream](https://mackenziedatastream.ca/)

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

<div align="center">
  <a href="http://gordonfoundation.ca"><img src="https://raw.githubusercontent.com/gordonfn/schema/main/docs/images/the-gordon-foundation.svg?sanitize=true" alt="The Gordon Foundation Logo" width="200"></a>
</div>
