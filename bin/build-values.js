const fs = require('fs')

const columns = [
  'MeasurementUnit',
  'ActivityGroupType',
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
  'ActivityGroupType':'ActivityGroupType',
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



const additions = (column, list) => {

  // Looks for retired values and adds non-retired value
  if (column === 'CharacteristicName') {
    for (const item of list) {
      const index = item.indexOf('***retired***')
      if (index === -1) continue;
      list.push(item.substr(0, index))
    }
  }

  try {
    const additions = require(`../src/addition/${column}.json`)
    list = list.concat(additions)
  } catch(e) {
    console.log(`|-> Skip additions`)
  }

  const length = list.length
  const uniqueEnum = [...new Set(list.sort((a, b) => a.localeCompare(b, undefined, {sensitivity: 'base'})))]
  if (uniqueEnum.length < length) {
    console.log(`|-> There are ${length - uniqueEnum.length} duplicates:`)
    const duplicates = []
    for(let i = 1, l = list.length; i<l; i++) {
      if (list[i-1] === list[i]) {
        duplicates.push(list[i])
      }
    }
    console.log(`|   "${duplicates.join('", "')}"`)
  }
  return uniqueEnum
}

const subtractions = (column, list = []) => {
  let arr = []

  // Remove retired items from list
  if (column === 'CharacteristicName') {
    for(const item of list) {
      const index = item.indexOf('***retired***')
      if (index === -1) continue;
      arr.push(item.substr(0,index))
    }
  }

  try {
    arr = arr.concat(require(`../src/subtraction/${column}.json`))
  } catch(e) {
    console.log(`|-> Skip subtractions`)
  }

  arr.filter(item => item.includes('.*')).forEach(pattern => {
    pattern = new RegExp(pattern)
    console.log(`|-> Subtracting by ${pattern}`)
    arr = arr.concat(list.filter(item => item.match(pattern) !== null))
  })

  try {
    arr = arr.concat(require(`wqx/deprecated/${column}.json`))
  } catch(e) {
    console.log(`|-> Skip deprecated`)
  }

  if (arr.length) console.log(`|-> Subtracting ${arr.length} items`)
  arr.forEach(item => {
    const index = list.indexOf(item)
    if(index !== -1) {
      list.splice(index, 1)
    }
  })

  return list
}

columns.forEach(col => {
  console.log(col)
  let object = require(`wqx/values/${wqx[col]}.json`)

  object.enum = additions(col, object.enum)

  fs.writeFileSync(__dirname + `/../src/values/${col}.legacy.json`, JSON.stringify(object, null, 2), {encoding: 'utf8'})

  try {
    object.enum = require(`../src/subset/${col}.json`)
  } catch(e) {
    console.log(`|-> Skip subset`)
  }

  object.enum = subtractions(col, object.enum)

  fs.writeFileSync(__dirname + `/../src/values/${col}.primary.json`, JSON.stringify(object, null, 2), {encoding: 'utf8'})
})

// Groupings

module.exports = {additions, subtractions}