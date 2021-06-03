const fs = require('fs')
const schema = require('../primary/index.json')
const characteristics = require('../src/values/CharacteristicName.primary.json').enum
const methodSpeciation = require('../src/logic/CharacteristicName-MethodSpeciation.json').if.properties.CharacteristicName.enum
const methodSpeciationOptional = require('../src/quality-control/partial/CharacteristicName-MethodSpeciation-Optional.json').enum
const sampleFraction = require('../src/logic/CharacteristicName-ResultSampleFraction.json').if.properties.CharacteristicName.enum
const sampleFractionOptional = require('../src/quality-control/partial/CharacteristicName-ResultSampleFraction-Optional.json').enum
const characteristicGroup = require('wqx/groups/CharacteristicName.json')

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
    let methodSpeciationRequired = methodSpeciation.includes(value) ? '"Yes"' : '"No"'
    if (methodSpeciationRequired === '"No"' && methodSpeciationOptional.includes(value)) {
      methodSpeciationRequired = '"May"'
    }

    let sampleFractionRequired = sampleFraction.includes(value) ? '"Yes"' : '"No"'
    if (sampleFractionRequired === '"No"' && sampleFractionOptional.includes(value)) {
      sampleFractionRequired = '"May"'
    }
    csv += `"${value}",${methodSpeciationRequired},${sampleFractionRequired},"${characteristicGroup[value] || 'Not Assigned'}"\n`
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