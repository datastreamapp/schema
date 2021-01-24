const util = require('util')
const path = require('path')
const fs = require('fs')

const version = require('../package.json').version
const $RefParser = require('json-schema-ref-parser')
const Ajv = require('ajv').default
const standaloneCode = require("ajv/dist/standalone").default

const writeFile = util.promisify(fs.writeFile)

console.log('Compile: JSON Schema & CSV Template')

const process = async (src, dist, minify = false, ajv) => {
  let schema = {} // JSON.parse(fs.readFileSync(path.join(__dirname, `/../src/${src}.json`)))
  try {
    schema = await $RefParser.dereference(__dirname + `/../src/${src}.json`)  // deprecate if/when possible
    schema.description = schema.description.replace('{version}', version)
  } catch(e) {
    console.error(e, e.toJSON())
  }

  let json
  if (minify) {
    //delete schema.title
    //delete schema.description
    for (let key in schema.properties) {
      delete schema.properties[key].title
      delete schema.properties[key].description

      const keys = Object.keys(schema.properties[key])
      if(keys.includes('enum') && keys.includes('maxLength')) {
        delete schema.properties[key].maxLength
      }
    }
    json = JSON.stringify(schema)
  } else {
    json = JSON.stringify(schema, null, 2)
  }

  await writeFile(path.join(__dirname, `/../dist/${dist}/index.json`), json, {encoding: 'utf8'})

  const validate = ajv.compile(schema)
  const code = standaloneCode(ajv, validate)
  ajv.removeSchema()

  await writeFile(path.join(__dirname, `/../dist/${dist}/index.js`), code, {encoding: 'utf8'})
}

const csv = async () => {
  const object = require(path.join(__dirname, `/../src/primary.json`))
  let csv = `"` + Object.keys(object.properties).join(`","`) + `"` + '\r\n'
  await writeFile(path.join(__dirname, `/../dist/csv/headers.csv`), csv, {encoding: 'utf8'})
}

csv()

// Primary
const ajvPrimary = new Ajv({
  strict: false,
  coerceTypes: true,
  allErrors: true,
  useDefaults: "empty",
  loopEnum: 1500,
  code: {
    source: true
  }
})
require('ajv-formats')(ajvPrimary, ['date'])
//require('ajv-formats-draft2019')(ajvPrimary, [])

process('primary', 'json-schema', true, ajvPrimary)

// Frontend
const ajvFrontend = new Ajv({
  strict: false,
  coerceTypes: true,
  allErrors: true,
  useDefaults: "empty",
  loopEnum: 1500,
  code: {
    source: true
  }
})
require('ajv-formats')(ajvFrontend, ['date'])
//require('ajv-formats-draft2019')(ajvFrontend, [])
require('ajv-keywords/dist/keywords/transform')(ajvFrontend)
process('frontend', 'json-schema/frontend', true, ajvFrontend)

// Backend
const ajvBackend = new Ajv({
  strict: false,
  coerceTypes: true,
  allErrors: true,
  useDefaults: "empty",
  loopEnum: 1500,
  code: {
    source: true
  }
})
require('ajv-formats')(ajvBackend, ['date'])
//require('ajv-formats-draft2019')(ajvBackend, [])
require('ajv-keywords/dist/keywords/transform')(ajvBackend)
process('backend', 'json-schema/backend', true, ajvBackend)
