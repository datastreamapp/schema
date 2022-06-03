import { readFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

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
    'ResultAnalyticalMethodContext',
    // **$
    'MonitoringLocationHorizontalAccuracyUnit',
    'MonitoringLocationVerticalUnit',
    'ActivityDepthHeightUnit',
    'ResultUnit',
    'ResultDetectionQuantitationLimitUnit'
  ].includes(column)) return [[], list]
  const arr = []
  // Remove retired items from list
  const pattern = /\s*(\*{3,10}retired\*{3}.*|\s*\*{3}duplicate\*{3}|[*]+)$/
  list = list
    .filter(item => ![
      // retired, but not removed yet
      '1-Decanesulfonic acid, 3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10,10-heptadecafluoro-',
      '1-Octanesulfonamide, 1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,8-heptadecafluoro-',
      '1,2-Benzenedicarboxamide, N2-[1,1-dimethyl-2-(methylsulfonyl)ethyl]-3-iodo-N1-[2-methyl-4-[1,2,2,2-tetrafluoro-1-(trifluoromethyl)ethyl]phenyl]-',
      'Heptanoic acid, 2,2,3,3,4,4,5,5,6,6,7,7,7-tridecafluoro-',
      'Hexadecanoic acid, 2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10,11,11,12,12,13,13,14,14,15,15,16,16,16-hentriacontafluoro-',
      'Nonanoic acid, 2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,9-heptadecafluoro-',
      'Octadecanoic acid, 2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10,11,11,12,12,13,13,14,14,15,15,16,16,17,17,18,18,18-pentatriacontafluoro-',
      'Pentanoic acid, 2,2,3,3,4,4,5,5,5-nonafluoro-',
      // retired more than once
      'Perfluorodecanesulfonic acid ***retired***use 1-Decanesulfonic acid, 1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10,10-heneicosafluoro',
      // duplicate, but not removed yet
      'Benzenamine, 2,3-dimethyl-4-[(1,1,2,2-tetrafluoroethyl)thio]-',
      'Benzenamine, 2,5-dimethyl-4-[(1,1,2,2-tetrafluoroethyl)thio]-'
    ].includes(item))
    .map(item => {
      if (pattern.test(item)) {
        item = item.replace(pattern, '').trim()
        arr.push(item)
      }
      return item
    })

  //console.log('retire', '#/sec', arr.indexOf('#/sec'), arr)
  return [arr, list]
}

/*export const override = (column, list = []) => {
  let overrides = {}
  if (
    [
      // 'MonitoringLocationHorizontalAccuracyUnit',
      // 'MonitoringLocationVerticalUnit',
      // 'ActivityDepthHeightUnit',
      // 'ResultUnit',
      // 'ResultDetectionQuantitationLimitUnit'
    ].includes(column)
  ) {
    overrides = {
      // '% saturatn**': '% saturatn',
      // 'gpm**': 'gpm',
      // 'std*********': 'std',
      // 'kg/t CaCO3**': 'kg/t CaCO3',
      // 'mg N/l******': 'mg N/l',
      // 'mg/l CaCO3**': 'mg/l CaCO3',
      // 'tCaCO3/Kt***': 'tCaCO3/Kt'
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
}*/

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
        if (['Perfluoroheptanesulfonic Acid', 'P-Chlorophenol'].includes(item)) item = null
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
  //console.log('arr', '#/sec', arr.indexOf('#/sec'))

  try {
    const additions = await readFile(
      join(__dirname, `../src/addition/${column}.json`)
    )
      .then((res) => JSON.parse(res))
      .catch(() => [])
    arr = arr.concat(additions)
    //console.log('additions', '#/sec', additions.indexOf('#/sec'))
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
    //console.log('deprecated', '#/sec', deprecated.indexOf('#/sec'))
  } catch (e) {
    if (e.message.includes('Cannot find module')) {
      console.log('|-> Skip deprecated')
    } else {
      console.log('|-> Error deprecated', e.message)
    }
  }

  // trailing Whitespace
  arr = arr.map(item => {
    if (item !== item.trim()) {
      console.log(`|** Trailing Whitespace: "${item}"`)
      item = item.trim()
    }
    return item
  })

  let uniqueEnum = [
    ...new Set(
      arr.sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' }))
    )
  ]

  // remove exact duplicates
  const exactDuplicates = []
  if (uniqueEnum.length < arr.length) {
    for (let i = 1, l = arr.length; i < l; i++) {
      if (arr[i - 1] === arr[i]) {
        exactDuplicates.push(arr[i])
        console.log(`|** Exact Duplicates: "${arr[i]}"`)
      }
    }
    /*if (exactDuplicates.length) {
      console.log(`|** Exact Duplicates: ${exactDuplicates.length}`)
      if (exactDuplicates.length < 65) {
        console.log(`|   "${exactDuplicates.join('",\n    "')}"`)
      }
    }*/
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
      console.log(`|** Mixed Case Duplicates: - "${uniqueEnum[i - 1]}"`)
      console.log(`|** Mixed Case Duplicates: + "${uniqueEnum[i]}"`)
      uniqueEnum[i - 1] = null
    }
  }
  uniqueEnum = uniqueEnum.filter((v) => v !== null)

  /*if (mixedCaseDuplicates.length) {
    console.log(`|** Mixed Case Duplicates: ${mixedCaseDuplicates.length}`)
    if (mixedCaseDuplicates.length < 25) {
      console.log(`|   "${mixedCaseDuplicates.join('", "')}"`)
    }
  }*/

  return uniqueEnum
}

export const subset = async (column, list = [], log = true) => {
  const allowed = await getList('subset', column)
  if (!allowed.length) return list

  //console.log('subset', '#/sec', allowed.indexOf('#/sec'))

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
