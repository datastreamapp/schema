const util = require('util')
const path = require('path')
const fs = require('fs')

const version = require('../package.json').version
const $RefParser = require('json-schema-ref-parser')
const Ajv = require('ajv').default
const standaloneCode = require('ajv/dist/standalone').default

const writeFile = util.promisify(fs.writeFile)

console.log('Compile: JSON Schema & CSV Template')

const process = async (src, delKeys = ['$generated'], minify = false, ajv) => {
  console.log('process', src, delKeys, minify)
  let schema = {} // JSON.parse(fs.readFileSync(path.join(__dirname, `/../src/${src}.json`)))
  try {
    schema = await $RefParser.dereference(__dirname + `/../src/${src}.json`)  // deprecate if/when possible
    schema.description = schema.description.replace('{version}', version)
  } catch (e) {
    console.error(e, e.toJSON())
  }

  delKeys.forEach(delKey => {
    deleteKey(schema, delKey)
  })

  let json = JSON.stringify(schema, null, minify ? 0: 2)

  await writeFile(path.join(__dirname, `/../${src}/index.json`), json, { encoding: 'utf8' })

  const validate = ajv.compile(schema)
  const code = standaloneCode(ajv, validate)
  ajv.removeSchema()

  await writeFile(path.join(__dirname, `/../${src}/index.js`), code, { encoding: 'utf8' })
}

const deleteKey = (obj, delKey) => {
  if (typeof obj !== 'object') return
  for (const key in obj) {
    if (key === delKey) {
      delete obj[key]
    }
    if (Array.isArray(obj[key])) {
      for (const value of obj[key]) {
        deleteKey(value, delKey)
      }
    } else if (typeof obj[key] === 'object') {
      deleteKey(obj[key], delKey)
    }
  }
}

// const csv = async () => {
//   const object = require(path.join(__dirname, `/../src/primary.json`))
//   let csv = `"` + Object.keys(object.properties).join(`","`) + `"` + '\r\n'
//   await writeFile(path.join(__dirname, `/../dist/csv/headers.csv`), csv, {encoding: 'utf8'})
// }
//
// csv()

// Primary
const ajvPrimary = new Ajv({
  strict: false,
  coerceTypes: false, // Keep it strict
  allErrors: true,
  useDefaults: 'empty',
  code: {
    source: true
  }
})
require('ajv-formats')(ajvPrimary, ['date'])
//require('ajv-formats-draft2019')(ajvPrimary, [])
//require("ajv-errors")(ajvPrimary)
//require('ajv-keywords/dist/keywords/transform')(ajvPrimary)
process('primary', ['$generated', 'errorMessage'], false, ajvPrimary)

// Frontend
const ajvFrontend = new Ajv({
  strict: false,
  coerceTypes: true,
  allErrors: true,
  useDefaults: 'empty',
  code: {
    source: true
  }
})
require('ajv-formats')(ajvFrontend, ['date'])
//require('ajv-formats-draft2019')(ajvFrontend, [])
require('ajv-errors')(ajvFrontend)
require('ajv-keywords/dist/keywords/transform')(ajvFrontend)
process('frontend', ['$generated', 'title', 'description'], true, ajvFrontend)

// Backend
const ajvBackend = new Ajv({
  strict: false,
  coerceTypes: true,
  allErrors: true,
  useDefaults: 'empty',
  loopEnum: 1500,
  code: {
    source: true
  }
})
require('ajv-formats')(ajvBackend, ['date'])
//require('ajv-formats-draft2019')(ajvBackend, [])
require('ajv-keywords/dist/keywords/transform')(ajvBackend)
process('backend', ['$generated', 'errorMessage', 'title', 'description'], true, ajvBackend)

// Quality Control
const ajvQualityControl = new Ajv({
  strict: false,
  coerceTypes: false, // will already be coerced types
  allErrors: true,
  useDefaults: 'empty',
  code: {
    source: true
  }
})
require('ajv-formats')(ajvQualityControl, ['date'])
//require('ajv-formats-draft2019')(ajvQualityControl, [])
require('ajv-errors')(ajvQualityControl)
require('ajv-keywords/dist/keywords/transform')(ajvQualityControl)
process('quality-control', ['$generated'], true, ajvQualityControl)
