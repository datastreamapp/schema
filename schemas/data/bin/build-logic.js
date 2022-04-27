import { readFile, writeFile } from 'fs/promises'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'
import { subset, sort } from './build-lib.js'

const __dirname = dirname(fileURLToPath(import.meta.url))

const wqxRequiredIf = async (file) => {
  console.log(file)
  const [columnFrom, columnTo] = file.split('-')

  const logicJSON = await readFile(
    join(__dirname, `/../src/logic/${file}.json`)
  )
    .then((res) => JSON.parse(res))
    .catch(() => ({}))
  const { default: required } = await import(`wqx/required/${file}.json.js`)

  const object = {
    $generated: 'build-logic.js',
    title: logicJSON.title,
    description: logicJSON.description,
    errorMessage: logicJSON.errorMessage,
    ...required
  }

  const list = [...new Set(sort(object.if.properties[columnFrom].enum))]
  object.if.properties[columnFrom].enum = await subset(columnFrom, list, false)

  await writeFile(
    join(__dirname, `/../src/logic/${file}.json`),
    JSON.stringify(object, null, 2),
    { encoding: 'utf8' }
  )

  // Special Case - MethodSpeciation/ResultSampleFraction is optional for a CharacteristicName
  const optional = await readFile(
    join(__dirname, `/../src/quality-control/partial/${file}-Optional.json`)
  )
    .then((res) => JSON.parse(res))
    .catch(() => ({}))
  object.if.properties[columnFrom].enum = object.if.properties[
    columnFrom
  ].enum.concat(optional.enum)

  const qcJSON = await readFile(
    join(__dirname, `/../src/quality-control/${file}.json`)
  )
    .then((res) => JSON.parse(res))
    .catch(() => ({}))
  const qc = {
    $generated: 'build-logic.js',
    title: qcJSON.title,
    description: qcJSON.description,
    errorMessage: qcJSON.errorMessage,
    if: {
      properties: {
        [columnFrom]: {
          not: {
            enum: object.if.properties[columnFrom].enum
          }
        }
      },
      required: [columnFrom]
    },
    then: {
      // 'oneOf': [{
      properties: {
        [columnTo]: false
      }
      //  'required': [columnTo]
      // }, {
      //   'not': {
      //     'required': [columnTo]
      //   }
      // }]
    }
  }
  await writeFile(
    join(__dirname, `/../src/quality-control/${file}.json`),
    JSON.stringify(qc, null, 2),
    { encoding: 'utf8' }
  )
}

// wqxRequiredIf('ActivityType-AnalyticalMethod','CharacteristicName',['AnalyticalMethodtype'])
// wqxRequiredIf('ActivityType-MonitoringLocation','CharacteristicName',['MonitoringLocation'])
// wqxRequiredIf('Characteristic-AnalyticalMethod','CharacteristicName',['ResultAnalyticalMethodID','ResultAnalyticalMethodContext'])
wqxRequiredIf('CharacteristicName-MethodSpeciation')
// wqxRequiredIf('CharacteristicName-ResultSampleFraction')
