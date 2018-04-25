const util = require('util')
const path = require('path')
const fs = require('fs')

const changeCase = require('change-case')
const glob = util.promisify(require('glob'))
const $RefParser = require('json-schema-ref-parser')
const Ajv = require('ajv')
const pack = require('ajv-pack')

const ajv = new Ajv({
  v5: true,
  format: 'full',
  coerceTypes: true,
  allErrors: true,
  useDefaults: true,
  sourceCode: true    // this option is required
})
require('ajv-keywords')(ajv, ['switch'])  // TODO Note doesn't transform data

const writeFile = util.promisify(fs.writeFile)

console.log('Compile: JSON Schema & JSON Table Schema & CSV Template')

const srcGlob = __dirname + '/../src/*.json'    // Note files starting w/ `definitions.` will be skipped in code
const validateFile = __dirname + '/../dist/validate/index.js'
const csvFile = __dirname + '/../dist/csv/template.csv'
const sqlFile = __dirname + '/../dist/sql/index.sql'
const jsonSchemaDir = __dirname + '/../dist/json-schema'
const jsonTableSchemaDir = __dirname + '/../dist/json-table-schema'

const replace = (str) => {
  // fix typos in wqx allowed values
  return str
  //.replace('ug/l', 'µg/l'); // opted to keep u

}

glob(srcGlob)
  .then((files) => {
    const arr = []
    files.forEach((filePath) => {
      const parts = path.parse(filePath)
      const file = parts.base
      if (file.indexOf('definitions.') === 0) { return }    // skip definitions files

      console.log('Processing:', file)

      const jsonSchemaFile = jsonSchemaDir + '/' + file
      const jsonTableSchemaFile = jsonTableSchemaDir + '/' + file

      const deref = $RefParser.dereference(filePath)
        .then((schemaJSON) => {
          //console.log(schemaFile, schemaJSON);

          const columns = Object.keys(schemaJSON.properties)

          // ## csv
          let csv = `"` + columns.join(`","`) + `"` + '\r\n'

          // ## json-schema -> json-schema-table
          const table = {
            fields: []
          }
          for (let i = 0, l = columns.length; i < l; i++) {
            const key = columns[i]
            const field = schemaJSON.properties[key]
            const column = {
              name: key,
              title: field.title,
              description: field.description,
              type: field.type,
              constraints: {
                required: (schemaJSON.required.indexOf(key) !== -1) ? true : null
              }
            }
            if (field.hasOwnProperty('format')) {
              column.format = field.format
              if (field.format === 'date-time') {
                column.format = field.format.replace('-', '')
              }
            }

            const constraints = ['minLength', 'maxLength', 'minimum', 'maximum', 'pattern', 'enum']
            for (let j = 0, m = constraints.length; j < m; j++) {
              if (field.hasOwnProperty(constraints[j])) {
                column.constraints[constraints[j]] = field[constraints[j]]
              }
            }

            table.fields.push(column)
          }

          // ## sql
          let sql = `
CREATE SCHEMA IF NOT EXISTS datastream;
CREATE TABLE IF NOT EXISTS datastream.samples (
  project_id     UUID NOT NULL,
`
          for (let i = 0, l = columns.length; i < l; i++) {
            const key = columns[i]
            if (key.indexOf('Time') !== -1) continue   // covered by previous column (DateTime)
            sql += `  ${changeCase.snake(key.replace('Date', 'Timestamp'))}`

            const field = schemaJSON.properties[key]

            if (field.type === 'string' && field.maxLength) {
              sql += ` VARCHAR(${field.maxLength})`
            } else if (field.type === 'string' && field.format === 'date') {
              sql += ` TIMESTAMP WITH TIME ZONE`
            } else if (field.type === 'string') {
              sql += ` TEXT`
            } else if (field.type === 'number') {
              sql += ` NUMERIC`
            }

            if (field.default) {
              sql += ` DEFAULT '${field.default}'`
            } else if (schemaJSON.required.indexOf(key) !== -1) {
              sql += ` NOT NULL`
            }

            if (i !== columns.length -1) {
              sql += `,
`
            }
          }
          sql += `
);

CREATE UNIQUE INDEX IF NOT EXISTS sample_pkey ON datastream.samples (
  project_id,
  monitoring_location_latitude,
  monitoring_location_longitude,
  activity_start_timestamp,
  activity_end_timestamp,
  characteristic_name,
  result_sample_fraction,
  result_analytical_method_id
);
CREATE INDEX IF NOT EXISTS sample_project_id_idx ON datastream.samples (project_id);
CREATE INDEX IF NOT EXISTS sample_latitude_idx ON datastream.samples (monitoring_location_latitude);
CREATE INDEX IF NOT EXISTS sample_longitude_idx ON datastream.samples (monitoring_location_longitude);
`

          // compiled ajv
          const validate = ajv.compile(schemaJSON)
          const moduleCode = pack(ajv, validate)

          return Promise.all([
            writeFile(validateFile, replace(moduleCode), {encoding: 'utf8'}),
            writeFile(csvFile, csv, {encoding: 'utf8'}),
            writeFile(jsonSchemaFile, replace(JSON.stringify(schemaJSON, null, 2)), {encoding: 'utf8'}),
            writeFile(jsonTableSchemaFile, replace(JSON.stringify(table, null, 2)), {encoding: 'utf8'}),
            writeFile(sqlFile, sql, {encoding: 'utf8'})
          ])
        })
        .catch((err) => {
          console.error('Error: deref', filePath, err)
        })
      arr.push(deref)
    })
    return Promise.all(arr)
  })
  .catch((err) => {
    console.error('Error: glob', err)
  })
  .then(() => {
    console.log('Compile: Complete')
    console.log('Copy package.json')
    const npm = require(__dirname + '/../package.json')

    delete npm.scripts
    delete npm.devDependencies

    fs.writeFileSync(__dirname + '/../dist/package.json', JSON.stringify(npm, null, 2), {encoding: 'utf8'})

    console.log('Done!')
  })
