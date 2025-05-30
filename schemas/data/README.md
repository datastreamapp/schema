<h1 align="center">
  <img src="https://raw.githubusercontent.com/gordonfn/schema/main/docs/images/datastream.svg?sanitize=true" alt="DataStream Logo" width="400">
  <br/>
  DataStream Open Data Schema for Water Quality Data
  <br/>
  <br/>
</h1>

<p align="center">Download the latest version in <a href="http://datastream.org/schema#" target="_blank">JSON Schema</a>, <a href="https://docs.google.com/spreadsheets/d/1OwGkUTyVC3tZ9N_we8uX1kpsPejZnSsgcaTjrlGBxoc" target="_blank">Google Sheets</a>, <a href="https://datastreamorg.sharepoint.com/:x:/s/Datastream/EaqcNGHom7BFlRi6bRY4VDoBy6ECq6v3bbUyeb0B3S3HGg?e=75aBTl" target="_blank">and Excel</a> template formats.</p>

<p align="center">
  <!--<a href="https://github.com/datastreamapp/schema"><img src="https://img.shields.io/github/stars/gordonfn/schema.svg?style=social&label=Stars" alt="Stars" /></a>-->
  <!--<a href="https://www.npmjs.com/package/schema"><img src="https://img.shields.io/npm/v/schema.svg" alt="npm version"></a>-->
  <!--<a href="https://www.npmjs.com/package/schema"><img src="https://img.shields.io/npm/dm/schema.svg" alt="npm downloads"></a>-->
  <!--<a href="https://www.npmjs.com/package/schema"><img src="https://img.shields.io/npm/l/schema.svg" alt="npm license" /></a>-->
</p>

## DataStream

DataStream ([DataStream.org](https://datastream.org)) is an online open-access platform for sharing water quality data. Data is uploaded, stored and shared in DataStream’s Open Data Schema -- a model based on the WQX standard for the Exchange of Water Quality Data. DataStream is free to use and allows users to query, visualize, and download data in this standardized format. To date, over 15 million water quality observations have been published across DataStream’s four regional platforms (Mackenzie DataStream, Lake Winnipeg DataStream, Atlantic DataStream, and Great Lakes DataStream) by watershed groups, Indigenous organizations, researchers and governments at all levels.

<!--<div align="center">
  <a href="http://gordonfoundation.ca"><img src="https://raw.githubusercontent.com/gordonfn/schema/master/docs/images/the-gordon-foundation.svg" alt="The Gordon Foundation Logo" width="200"></a>
</div>-->

DataStream was developed by [The Gordon Foundation](https://gordonfoundation.ca) and is carried out in collaboration with regional partners and monitoring networks. Data contributors maintain ownership of their data which are published under open data licenses.

## DataStream Open Data Schema (DS-WQX)

To ensure consistent formatting of water data and to avoid ambiguous or missing information, we developed an observation-level data schema based on the WQX standard for the Exchange of Water Quality Data.

The WQX schema was developed by the US Environmental Protection Agency (EPA) and the US Geological Society (USGS) and is an implementation of the ESAR (Environmental Sampling, Analysis and Results) data standard. It was designed to enable multiple monitoring entities to share results in a common format. In the US, the WQX schema is used on the US EPA’s Water Quality Portal to share over 340 million water quality data records data from 400 federal, state, tribal and other partners.

In 2018, The Gordon Foundation led a comprehensive review process to determine how this model could be adapted to best meet the needs of diverse water monitoring initiatives in Canada. DataStream’s science and technical advisory team, regional partners and collaborators, data contributors, government representatives as well as other members of the water community were engaged in this process.

DataStream’s open data schema (DS-WQX v1.0) was fully implemented across all regional DataStream platforms in 2019.

## Changelog

The DataStream open data schema will continue to evolve to meet user needs and therefore is subject to various updates over time (e.g. addition of new allowed values). To view the most recent version number and record of changes please see the [DataStream Upload Template](https://datastream.org/en-ca/documentation/data-upload-resources#datastream-upload-template).

## Dataset Metadata

In addition to the observation-level information in DS-WQX, DataStream uses dataset level metadata. [DataStream Metadata](https://github.com/datastreamapp/schema/tree/main/schemas/meta)

## Special Case Tests

In addition to our schema enforcing allowed values the column conditional logic; we have included additional check for common errors to the frontend flavour of our schema.

- `Dissolved oxygen (DO)` should not be in `%`
- `Dissolved oxygen saturation` should not be less than `0%`
- `Hardness` should not be less than or equal to `0`
- `pH` should be within `0` and `14`
- `Temperature` should be within `-100 degC` and `100 degC`

## Testing

We aim to have our test be as robust as possible. This is accomplished by having acceptance and rejection tests.

## Install

You can download the compiled DS-WQX schema from above.

Alternately, you can build it from the source to include in your project.

```bash
# Public
$ npm i
$ npm run build
$ cat primary/index.json

# Private
$ npm i @gordonfn/schema
```

## Use

### CSV Template

The `csv` template follows `R` import/export best practices.

### JavaScript

```javascript
import validate from "@gordonfn/schema";
const data = {}; // Single row of data
const valid = validate(data);
if (!valid) console.error(validate.errors);
```

### Schema Flavours

Supports JSON Schema Draft 2019-09 Specification in non-strict mode. Strict mode removes `if`, `then`, `additionalProperties` from the schema.

- `primary`: This includes only JSON schema specification supported parameters with strict allowed values and supplementary conditional checks
- `frontend`: Includes loose allowed values with coercion and supplementary conditional checks
- `extract`: Includes strict allowed values and supplementary conditional checks
- `backend`: Includes all possible allowed values, value coercion and no supplementary conditional checks
- `quality-control`: Includes additional conditional checks to be flagged as warnings

## Publish

```bash
# change version in package.json
npm test
cd dist
npm publish
```

## Contributing

### Commenting on the Schema

If you wish to comment on the schema please [open an issue](https://github.com/datastreamapp/schema/issues).

- For information on opening an issue review github's [creating an issue](https://help.github.com/en/github/managing-your-work-on-github/creating-an-issue) document

You can also email us at <team@datastream.org> or visit us at:

- [DataStream](https://datastream.org)
- [Atlantic DataStream](https://atlanticdatastream.ca)
- [Great Lakes DataStream](https://greatlakesdatastream.ca)
- [Lake Winnipeg DataStream](https://lakewinnipegdatastream.ca)
- [Mackenzie DataStream](https://mackenziedatastream.ca)
- [Pacific DataStream](https://pacificdatastream.ca)

### Development

```bash
brew install nvm
nvm get 12
npm i
```

### Publishing

```bash
# update version in `package.json`
npm run test
cd dist
npm publish
```

## References

- [WQX](https://github.com/datastreamapp/wqx)
- [R Import/Export](https://cran.r-project.org/doc/manuals/r-release/R-data.html)

<div align="center">
  <a href="http://gordonfoundation.ca"><img src="https://raw.githubusercontent.com/gordonfn/schema/main/docs/images/the-gordon-foundation.svg?sanitize=true" alt="The Gordon Foundation Logo" width="200"></a>
</div>
