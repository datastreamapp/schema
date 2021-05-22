const fs = require('fs')
const { subset } = require('./build-lib')

const wqxRequiredIf = async (file) => {
  console.log(file)
  const [columnFrom, columnTo] = file.split('-')

  const logicJSON = require(__dirname + `/../src/logic/${file}.json`)

  const object = {
    $generated: 'build-logic.js',
    title: logicJSON.title,
    description: logicJSON.description,
    errorMessage: logicJSON.errorMessage,
    ...require(`wqx/required/${file}.json`)
  }

  const list = [...new Set(object.if.properties[columnFrom].enum.sort())]
  object.if.properties[columnFrom].enum = subset(columnFrom, list)

  fs.writeFileSync(__dirname + `/../src/logic/${file}.json`, JSON.stringify(object, null, 2), { encoding: 'utf8' })


  const qcJSON = require(__dirname + `/../src/quality-control/${file}.json`)
  const qc = {
    '$generated': 'build-logic.js',
    title: qcJSON.title,
    description: qcJSON.description,
    errorMessage: qcJSON.errorMessage,
    'if': {
      'properties': {
        [columnFrom]: {
          'not': {
            'enum': object.if.properties[columnFrom].enum
          }
        }
      },
      'required': [columnFrom]
    },
    'then': {
      'properties': {
        [columnTo]: {
          'enum': [null, '']
        }
      },
      'required': [columnTo]
    }
  }
  fs.writeFileSync(__dirname + `/../src/quality-control/${file}.json`, JSON.stringify(qc, null, 2), { encoding: 'utf8' })
}

//wqxRequiredIf('ActivityType-AnalyticalMethod','CharacteristicName',['AnalyticalMethodtype'])
//wqxRequiredIf('ActivityType-MonitoringLocation','CharacteristicName',['MonitoringLocation'])
//wqxRequiredIf('Characteristic-AnalyticalMethod','CharacteristicName',['ResultAnalyticalMethodID','ResultAnalyticalMethodContext'])
wqxRequiredIf('CharacteristicName-MethodSpeciation')
wqxRequiredIf('CharacteristicName-ResultSampleFraction')


