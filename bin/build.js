const util = require('util')
const path = require('path')
const fs = require('fs')

const version = require('package.json').version
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

const writeFile = util.promisify(fs.writeFile)

console.log('Compile: JSON Schema & CSV Template')

const process = async (src, dist, minify = false) => {
  let schema = {}
  try {
    schema = await $RefParser.dereference(__dirname + `/../src/${src}.json`)
    schema.description = schema.description.replace('{version}', version)
  } catch(e) {
    console.error(e, e.toJSON())
  }

  let json
  if (minify) {
    delete schema.title
    delete schema.description
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

  const validate = ajv.compile(schema)
  const code = pack(ajv, validate)

  await Promise.all([
    writeFile(__dirname + `/../dist/${dist}/index.js`, code, {encoding: 'utf8'}),
    writeFile(__dirname + `/../dist/${dist}/index.json`, json, {encoding: 'utf8'})
  ])
}

const csv = async () => {
  const object = require(__dirname + `/../src/primary.json`)
  let csv = `"` + Object.keys(object.properties).join(`","`) + `"` + '\r\n'
  await writeFile(__dirname + `/../dist/csv/headers.csv`, csv, {encoding: 'utf8'})
}

csv()
process('primary', 'json-schema', true)
process('legacy', 'json-schema-legacy', true)


//csv

/*
glob(srcGlob)
  .then((files) => {
    const arr = []
    files.forEach((filePath) => {
      const parts = path.parse(filePath)
      const file = parts.base
      if (file.indexOf('definitions.') === 0) { return }    // skip definitions files

      console.log('Processing:', file)

      const jsonSchemaFileJSON = jsonSchemaDir + '/' + file

      const deref = $RefParser.dereference(filePath)
        .then((schemaJSON) => {
          //console.log(schemaFile, schemaJSON);

          // ## csv
          let csv = `"` + Object.keys(schemaJSON.properties).join(`","`) + `"` + '\r\n'

          // ## json-schema
          delete schemaJSON.title
          delete schemaJSON.description
          for (let key in schemaJSON.properties) {
            delete schemaJSON.properties[key].title
            delete schemaJSON.properties[key].description

            if(schemaJSON.properties[key].enum && schemaJSON.properties[key].maxLength) {
              delete schemaJSON.properties[key].maxLength
            }
          }

          // compiled ajv
          const validate = ajv.compile(schemaJSON)
          const moduleCode = pack(ajv, validate)

          return Promise.all([
            writeFile(validateFile, replace(moduleCode), {encoding: 'utf8'}),
            writeFile(csvFile, csv, {encoding: 'utf8'}),
            writeFile(jsonSchemaFileJSON, replace(JSON.stringify(schemaJSON, null, 2)), {encoding: 'utf8'})
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
*/