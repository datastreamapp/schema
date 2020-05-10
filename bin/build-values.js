const fs = require('fs')

const columns = [
  'MeasurementUnit',
  'MonitoringLocationHorizontalCoordinateReferenceSystem',
  'MonitoringLocationType',
  'ActivityType',
  'ActivityMediaName',
  'ActivityMediaSubdivisionName',
  'SampleCollectionEquipmentName',
  'ResultDetectionCondition',
  'CharacteristicName',
  'MethodSpeciation',
  'ResultSampleFraction',
  'ResultStatusID',
  'ResultValueType',
  'ResultAnalyticalMethodContext',
  'ResultDetectionQuantitationLimitType',
]

// DS to WQX values name mapping
const wqx = {
  'MeasurementUnit':'MeasurementUnit',
  'MonitoringLocationHorizontalCoordinateReferenceSystem':'HorizontalReferenceDatum',
  'MonitoringLocationType':'MonitoringLocationType',
  'ActivityType':'ActivityType',
  'ActivityMediaName':'ActivityMedia',
  'ActivityMediaSubdivisionName':'ActivityMediaSubdivision',
  'SampleCollectionEquipmentName':'SampleCollectionEquipment',
  'ResultDetectionCondition':'ResultDetectionCondition',
  'CharacteristicName':'Characteristic',
  'MethodSpeciation':'MethodSpeciation',
  'ResultSampleFraction':'SampleFraction',
  'ResultStatusID':'ResultStatus',
  'ResultValueType':'ResultValueType',
  'ResultAnalyticalMethodContext':'AnalyticalMethodContext',
  'ResultDetectionQuantitationLimitType':'DetectionQuantitationLimitType',
}

columns.forEach(col => {
  console.log(col)
  let object = require(`wqx/values/${wqx[col]}.json`)

  try {
    const additions = require(`../src/addition/${col}.json`)
    object.enum = object.enum.concat(additions)
  } catch(e) {
    console.log(`|-> Skip additions`)
  }

  object.enum.sort()
  const length = object.enum.length
  const uniqueEnum = [...new Set(object.enum)]
  if (uniqueEnum.length < length) {
    console.log(`|-> There are ${length - uniqueEnum.length} duplicates:`)
    const duplicates = []
    for(let i = 1, l = object.enum.length; i<l; i++) {
      if (object.enum[i-1] === object.enum[i]) {
        duplicates.push(object.enum[i])
      }
    }
    console.log(`|   "${duplicates.join('", "')}"`)
  }
  object.enum = uniqueEnum

  fs.writeFileSync(__dirname + `/../src/values/${col}.legacy.json`, JSON.stringify(object, null, 2), {encoding: 'utf8'})

  try {
    object.enum = require(`./src/override/${col}`)
  } catch(e) {
    console.log(`|-> Skip override`)
  }

  let subtractions = []
  try {
    subtractions = subtractions.concat(require(`../src/subtraction/${col}.json`))
  } catch(e) {
    console.log(`|-> Skip subtractions`)
  }

  subtractions.filter(item => item.includes('.*')).forEach(pattern => {
    pattern = new RegExp(pattern)
    console.log(`|-> Subtracting by ${pattern}`)
    subtractions = subtractions.concat(object.enum.filter(item => item.match(pattern) !== null))
  })

  try {
    subtractions = subtractions.concat(require(`wqx/deprecated/${wqx[col]}.json`))
  } catch(e) {
    console.log(`|-> Skip deprecated`)
  }

  if (subtractions.length) console.log(`|-> Subtracting ${subtractions.length} items`)
  subtractions.forEach(item => {
    const index = object.enum.indexOf(item)
    if(index !== -1) {
      object.enum = object.enum.splice(index, 1)
    }
  })

  fs.writeFileSync(__dirname + `/../src/values/${col}.primary.json`, JSON.stringify(object, null, 2), {encoding: 'utf8'})
})