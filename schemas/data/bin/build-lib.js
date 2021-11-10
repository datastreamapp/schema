const subsetOnly = [
  'MonitoringLocationHorizontalAccuracyUnit',
  'MonitoringLocationVerticalUnit',
  'ActivityDepthHeightUnit'
]

// DS to WQX values name mapping
const wqx = {
  'MonitoringLocationHorizontalCoordinateReferenceSystem': 'HorizontalReferenceDatum',
  'MonitoringLocationHorizontalAccuracyUnit': 'MeasurementUnit',
  'MonitoringLocationVerticalUnit': 'MeasurementUnit',
  'MonitoringLocationType': 'MonitoringLocationType',
  'ActivityType': 'ActivityType',
  'ActivityGroupType': 'ActivityGroupType',
  'ActivityMediaName': 'ActivityMediaSubdivision',
  'ActivityDepthHeightUnit': 'MeasurementUnit',
  'SampleCollectionEquipmentName': 'SampleCollectionEquipment',
  'CharacteristicName': 'Characteristic',
  'MethodSpeciation': 'MethodSpeciation',
  'ResultSampleFraction': 'SampleFraction',
  'ResultUnit': 'MeasurementUnit',
  'ResultValueType': 'ResultValueType',
  'ResultDetectionCondition': 'ResultDetectionCondition',
  'ResultDetectionQuantitationLimitUnit': 'MeasurementUnit',
  'ResultDetectionQuantitationLimitType': 'DetectionQuantitationLimitType',
  'ResultStatusID': 'ResultStatus',
  'ResultAnalyticalMethodContext': 'AnalyticalMethodContext',
}

const getList = (type, column, list = []) => {
  try {
    const list = require(`../src/${type}/${column}.json`)
    return [...new Set(sort(list))]
  } catch (e) {
    if (e.message.includes('Cannot find module')) {
      console.log(`|-> Skip ${type}`)
    } else {
      console.log(`|-> Error ${type}`, e.message)
    }
    return list
  }
}

const sort = (list) => {
  return list.sort((a, b) => {
    return a.toLowerCase().localeCompare(b.toLowerCase())
  })
}

const retire = (column, list) => {
  if (column !== 'CharacteristicName') return []
  const arr = []

  // Remove retired items from list
  for (const item of list) {
    const index = item.indexOf('***retired***')
    if (index === -1) continue
    arr.push(item.substr(0, index))
  }
  return arr
}

const override = (column, list = []) => {
  let overrides = {}
  if (['MonitoringLocationHorizontalAccuracyUnit', 'MonitoringLocationVerticalUnit', 'ActivityDepthHeightUnit', 'ResultUnit', 'ResultDetectionQuantitationLimitUnit'].includes(column)) {
    overrides = {
      '% saturatn**': '% saturatn',
      'gpm**': 'gpm'
    }
  }

  if (!Object.keys(overrides).length) return list

  // Remove retired items from list
  list = list.map(item => {
    if (overrides[item]) {
      console.log(`|-> Override '${item}' with '${overrides[item]}'`)
      item = overrides[item]
    }
    return item
  })
  return list
}

const additions = (column, list = []) => {
  let arr = []
  // Looks for retired values and adds non-retired value
  if (column === 'CharacteristicName') {
    let previous, retiredDuplicates = []
    for (let item of list) {
      const index = item.indexOf('***retired***')
      if (index !== -1) {
        item = item.substr(0, index)
        if (!previous.localeCompare(item, undefined, { sensitivity: 'base' })) {  // 0 == same
          retiredDuplicates.push(item)
          item = null
        }
        // remove edge case
        if (item === 'Perfluoroheptanesulfonic Acid') item = null
      }
      if (item) {
        arr.push(item)
        previous = item
      }
    }
    if (retiredDuplicates.length) {
      console.log(`|** Retired Duplicates: "${retiredDuplicates.length < 25 ? retiredDuplicates.join('", "') : retiredDuplicates.length}"`)
    }
  } else {
    arr = list
  }

  try {
    const additions = require(`../src/addition/${column}.json`)
    arr = arr.concat(additions)
  } catch (e) {
    if (e.message.includes('Cannot find module')) {
      console.log(`|-> Skip additions`)
    } else {
      console.log(`|-> Error additions`, e.message)
    }
  }

  // TODO only have apply to legacy
  try {
    const deprecated = require(`../src/deprecated/${column}.json`)
    arr = arr.concat(deprecated)
  } catch (e) {
    if (e.message.includes('Cannot find module')) {
      console.log(`|-> Skip deprecated`)
    } else {
      console.log(`|-> Error deprecated`, e.message)
    }
  }

  // remove exact duplicates
  const duplicates = []
  let uniqueEnum = [...new Set(arr.sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' })))]
  if (uniqueEnum.length < arr.length) {
    for (let i = 1, l = arr.length; i < l; i++) {
      if (arr[i - 1] === arr[i]) {
        duplicates.push(arr[i])
      }
    }
    if (duplicates.length) {
      console.log(`|** Duplicates "${duplicates.length < 25 ? duplicates.join('", "') : duplicates.length}"`)
    }
  }

  // remove mixcase duplicates
  for (let i = 1, l = uniqueEnum.length; i < l; i++) {
    if (uniqueEnum[i - 1].localeCompare(uniqueEnum[i], undefined, { sensitivity: 'base' }) !== -1) {
      duplicates.push(uniqueEnum[i - 1])
      uniqueEnum[i - 1] = null
    }
    if (uniqueEnum[i] !== uniqueEnum[i].trim()) {
      console.log(`|** Trailing Whitespace: "${uniqueEnum[i]}"`)
      uniqueEnum[i] = uniqueEnum[i].trim()
    }
  }
  uniqueEnum = uniqueEnum.filter((v) => v !== null)

  if (duplicates.length) {
    console.log(`|-> There are ${duplicates.length} duplicates:`)
    if (duplicates.length < 25) {
      console.log(`|   "${duplicates.join('", "')}"`)
    }
  }

  return uniqueEnum
}

const subset = (column, list = [], log = true) => {
  const allowed = getList('subset', column)
  if (!allowed.length) return list

  const subsetList = []
  for (const value of allowed) {
    for (let i = 0, l = list.length; i < l; i++) {
      if (list[i] === value) {
        list.splice(i, 1)
        subsetList.push(value)
        break
      }
    }
    if (log && subsetList[subsetList.length-1] !== value) {
      console.log(`|** Subset value missing from allowed values: ${column} "${value}"`)
    }
  }

  return [...new Set(sort(subsetList))]
}

const subtractions = (column, list = [], retired = []) => {
  let arr = []

  if (column === 'CharacteristicName') {
    arr = retired
  }

  try {
    arr = arr.concat(require(`../src/subtraction/${column}.json`))
  } catch (e) {
    if (e.message.includes('Cannot find module')) {
      console.log(`|-> Skip subtractions`)
    } else {
      console.log(`|-> Error subtractions`, e.message)
    }
  }

  arr.filter(item => item.includes('.*')).forEach(pattern => {
    pattern = new RegExp(pattern)
    console.log(`|-> Subtracting by ${pattern}`)
    arr = arr.concat(list.filter(item => item.match(pattern) !== null))
  })

  try {
    arr = arr.concat(require(`wqx/deprecated/${column}.json`))
  } catch (e) {
    if (e.message.includes('Cannot find module')) {
      console.log(`|-> Skip deprecated`)
    } else {
      console.log(`|-> Error deprecated`, e.message)
    }
  }

  if (arr.length) console.log(`|-> Subtracting ${arr.length} items`)
  arr.forEach(item => {
    const index = list.indexOf(item)
    if (index !== -1) {
      list.splice(index, 1)
    }
  })

  return list
}

module.exports = { getList, sort, retire, override, additions, subset, subtractions, subsetOnly, wqx }