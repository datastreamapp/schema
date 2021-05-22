const fs = require('fs')
const { subset } = require('./build-lib')

const wqxRequiredIf = async (file) => {
  console.log(file)
  const object = require(`wqx/required/${file}.json`)

  const [columnFrom, columnTo] = file.split('-')
  const list = [...new Set(object.if.properties[columnFrom].enum.sort())]
  object.if.properties[columnFrom].enum = subset(columnFrom, list)

  object.$generated = 'build-logic.js'
  object.errorMessage =`${columnTo} required for selected CharacteristicName`

  fs.writeFileSync(__dirname + `/../src/logic/${file}.json`, JSON.stringify(object, null, 2), { encoding: 'utf8' })

  const qc = {
    '$generated':'build-logic.js',
    'errorMessage': `${columnTo} should be empty for selected CharacteristicName`,
    'if': {
      'properties': {
        'CharacteristicName': {
          'not': {
            'enum': object.if.properties[columnFrom].enum
          }
        }
      },
      'required': [
        'CharacteristicName'
      ]
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


