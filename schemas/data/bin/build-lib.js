import { readFile } from 'fs/promises'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

export const subsetOnly = [
  'MonitoringLocationHorizontalAccuracyUnit',
  'MonitoringLocationVerticalUnit',
  'ActivityDepthHeightUnit'
]

// DS to WQX values name mapping
export const wqx = {
  MonitoringLocationHorizontalCoordinateReferenceSystem:
    'HorizontalReferenceDatum',
  MonitoringLocationHorizontalAccuracyUnit: 'MeasurementUnit',
  MonitoringLocationVerticalUnit: 'MeasurementUnit',
  MonitoringLocationType: 'MonitoringLocationType',
  ActivityType: 'ActivityType',
  ActivityGroupType: 'ActivityGroupType',
  ActivityMediaName: 'ActivityMediaSubdivision',
  ActivityDepthHeightUnit: 'MeasurementUnit',
  SampleCollectionEquipmentName: 'SampleCollectionEquipment',
  CharacteristicName: 'Characteristic',
  MethodSpeciation: 'MethodSpeciation',
  ResultSampleFraction: 'SampleFraction',
  ResultUnit: 'MeasurementUnit',
  ResultValueType: 'ResultValueType',
  ResultDetectionCondition: 'ResultDetectionCondition',
  ResultDetectionQuantitationLimitUnit: 'MeasurementUnit',
  ResultDetectionQuantitationLimitType: 'DetectionQuantitationLimitType',
  ResultStatusID: 'ResultStatus',
  ResultAnalyticalMethodContext: 'AnalyticalMethodContext'
}

export const getList = async (type, column, list = []) => {
  try {
    const list = await readFile(
      join(__dirname, `../src/${type}/${column}.json`)
    )
      .then((res) => JSON.parse(res))
      .catch(() => [])
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

export const sort = (list) => {
  return list.sort((a, b) => {
    return a.toLowerCase().localeCompare(b.toLowerCase())
  })
}

export const retire = (column, list) => {
  if (![
    // ***retired***
    'CharacteristicName',
    // **$
    'MonitoringLocationHorizontalAccuracyUnit',
    'MonitoringLocationVerticalUnit',
    'ActivityDepthHeightUnit',
    'ResultUnit',
    'ResultDetectionQuantitationLimitUnit'
  ].includes(column)) return []
  const arr = []

  // Remove retired items from list
  const pattern = /(\*{3}retired\*{3}|\*+)$/
  for (const item of list) {
    if (pattern.test(item)) {
      arr.push(item.replace(pattern, ''))
    }
  }
  return arr
}

export const override = (column, list = []) => {
  let overrides = {}
  if (
    [
      'MonitoringLocationHorizontalAccuracyUnit',
      'MonitoringLocationVerticalUnit',
      'ActivityDepthHeightUnit',
      'ResultUnit',
      'ResultDetectionQuantitationLimitUnit'
    ].includes(column)
  ) {
    overrides = {
      '% saturatn**': '% saturatn',
      'gpm**': 'gpm',
      'std*********': 'std'
    }
  }

  if (!Object.keys(overrides).length) return list

  // Remove retired items from list
  list = list.map((item) => {
    if (overrides[item]) {
      console.log(`|-> Override '${item}' with '${overrides[item]}'`)
      item = overrides[item]
    }
    return item
  })
  return list
}

export const additions = async (column, list = []) => {
  let arr = []
  // Looks for retired values and adds non-retired value
  if (column === 'CharacteristicName') {
    let previous
    const retiredDuplicates = []
    for (let item of list) {
      const index = item.indexOf('***retired***')
      if (index !== -1) {
        item = item.substring(0, index)
        if (!previous.localeCompare(item, undefined, { sensitivity: 'base' })) {
          // 0 == same
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
      console.log(`|** Retired Duplicates: ${retiredDuplicates.length}`)
      if (retiredDuplicates.length < 25) {
        console.log(`|   "${retiredDuplicates.join('", "')}"`)
      }
    }
  } else {
    arr = list
  }

  try {
    const additions = await readFile(
      join(__dirname, `../src/addition/${column}.json`)
    )
      .then((res) => JSON.parse(res))
      .catch(() => [])
    arr = arr.concat(additions)
  } catch (e) {
    if (e.message.includes('Cannot find module')) {
      console.log('|-> Skip additions')
    } else {
      console.log('|-> Error additions', e.message)
    }
  }

  // TODO only have apply to legacy
  try {
    const deprecated = await readFile(
      join(__dirname, `../src/deprecated/${column}.json`)
    )
      .then((res) => JSON.parse(res))
      .catch(() => [])
    arr = arr.concat(deprecated)
  } catch (e) {
    if (e.message.includes('Cannot find module')) {
      console.log('|-> Skip deprecated')
    } else {
      console.log('|-> Error deprecated', e.message)
    }
  }

  // remove exact duplicates
  const exactDuplicates = []
  let uniqueEnum = [
    ...new Set(
      arr.sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' }))
    )
  ]
  if (uniqueEnum.length < arr.length) {
    for (let i = 1, l = arr.length; i < l; i++) {
      if (arr[i - 1] === arr[i]) {
        exactDuplicates.push(arr[i])
      }
    }
    if (exactDuplicates.length) {
      console.log(`|** Exact Duplicates: ${exactDuplicates.length}`)
      if (exactDuplicates.length < 25) {
        console.log(`|   "${exactDuplicates.join('", "')}"`)
      }
    }
  }

  // remove mixcase duplicates
  const mixedCaseDuplicates = []
  for (let i = 1, l = uniqueEnum.length; i < l; i++) {
    if (
      uniqueEnum[i - 1].localeCompare(uniqueEnum[i], undefined, {
        sensitivity: 'base'
      }) !== -1
    ) {
      mixedCaseDuplicates.push(uniqueEnum[i - 1])
      uniqueEnum[i - 1] = null
    }
    if (uniqueEnum[i] !== uniqueEnum[i].trim()) {
      console.log(`|** Trailing Whitespace: "${uniqueEnum[i]}"`)
      uniqueEnum[i] = uniqueEnum[i].trim()
    }
  }
  uniqueEnum = uniqueEnum.filter((v) => v !== null)

  if (mixedCaseDuplicates.length) {
    console.log(`|** Mixed Case Duplicates: ${mixedCaseDuplicates.length}`)
    if (mixedCaseDuplicates.length < 25) {
      console.log(`|   "${mixedCaseDuplicates.join('", "')}"`)
    }
  }

  return uniqueEnum
}

export const subset = async (column, list = [], log = true) => {
  const allowed = await getList('subset', column)
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
    if (log && subsetList[subsetList.length - 1] !== value) {
      console.log(
        `|** Subset value missing from allowed values: ${column} "${value}"`
      )
    }
  }

  return [...new Set(sort(subsetList))]
}

export const subtractions = async (column, list = [], retired = []) => {
  let arr = retired

  try {
    arr = arr.concat(
      await readFile(join(__dirname, `../src/subtraction/${column}.json`))
        .then((res) => JSON.parse(res))
        .catch(() => [])
    )
  } catch (e) {
    if (e.message.includes('Cannot find module')) {
      console.log('|-> Skip subtractions')
    } else {
      console.log('|-> Error subtractions', e.message)
    }
  }

  arr
    .filter((item) => item.includes('.*'))
    .forEach((pattern) => {
      pattern = new RegExp(pattern)
      console.log(`|-> Subtracting by ${pattern}`)
      arr = arr.concat(list.filter((item) => item.match(pattern) !== null))
    })

  try {
    arr = arr.concat(
      await readFile(join(__dirname, `wqx/deprecated/${column}.json`))
        .then((res) => JSON.parse(res))
        .catch(() => [])
    )
  } catch (e) {
    if (e.message.includes('Cannot find module')) {
      console.log('|-> Skip deprecated')
    } else {
      console.log('|-> Error deprecated', e.message)
    }
  }

  if (arr.length) console.log(`|-> Subtracting ${arr.length} items`)
  arr.forEach((item) => {
    const index = list.indexOf(item)
    if (index !== -1) {
      list.splice(index, 1)
    }
  })

  return list
}
