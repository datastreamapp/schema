const fs = require('fs')
const schema = require('../dist/json-schema/index.json')
const characteristics = require('../src/values/CharacteristicName.primary.json').enum
const methodSpeciation = require('../src/logic/CharacteristicName-MethodSpeciation.json').if.properties.CharacteristicName.enum
const sampleFraction = require('../src/logic/CharacteristicName-ResultSampleFraction.json').if.properties.CharacteristicName.enum
const characteristicGroup = require('wqx/groups/Characteristic.json')

const buildUnits = () => {
  let csv = 'Unit\n'

  for(const value of schema.properties.ResultUnit.enum) {
    csv += `"${value}"\n`
  }

  fs.writeFileSync(__dirname + `/template/Units.csv`,csv, {encoding: 'utf8'})
}

const buildCharacteristics = () => {
  let csv = 'CharacteristicName,MethodSpeciation,SampleFraction,Group\n'

  for(const value of characteristics) {
    csv += `"${value}",${methodSpeciation.includes(value) ? '"Yes"' : '"No"'},${sampleFraction.includes(value) ? '"Yes"' : '"No"'},"${characteristicGroup[value] || 'Not Assigned'}"\n`
  }

  fs.writeFileSync(__dirname + `/template/Characteristics.csv`,csv, {encoding: 'utf8'})
}

const buildAllowed = () => {
  let csv = ''

  for(const key of Object.keys(schema.properties)) {
    let {type, enum: allowed, maxLength} = schema.properties[key]
    if (Array.isArray(allowed)) allowed = allowed.map(value => `"${value}"`).join(',')
    csv += `${key},${maxLength || ''},${allowed || ''}\n`
  }

  fs.writeFileSync(__dirname + `/template/AllowedValues.csv`,csv, {encoding: 'utf8'})
}


buildUnits()
buildCharacteristics()
buildAllowed()