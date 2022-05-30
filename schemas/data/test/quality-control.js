import test from 'ava'

import validate from '../quality-control/index.js'

const defaultObject = {
  // "DatasetName":"Test",
  MonitoringLocationID: 'A1',
  MonitoringLocationName: 'A1 Test',
  MonitoringLocationLatitude: 51.0486,
  MonitoringLocationLongitude: -114.0708,
  MonitoringLocationHorizontalCoordinateReferenceSystem: 'AMSMA',
  MonitoringLocationType: 'ocean',
  ActivityType: 'Field Msr/Obs',
  ActivityMediaName: 'surface Water',
  ActivityDepthHeightMeasure: -34,
  ActivityDepthHeightUnit: 'm',
  SampleCollectionEquipmentName: 'bucket',
  CharacteristicName: 'aluminum',
  MethodSpeciation: 'as B',
  ResultSampleFraction: 'Dissolved',
  ResultValue: 99.99,
  ResultUnit: '#/100ml',
  ResultValueType: 'Actual',
  ResultStatusID: 'Accepted',
  ResultComment: 'None at this time',
  ResultAnalyticalMethodID: '1',
  ResultAnalyticalMethodContext: 'APHA',
  ActivityStartDate: '2018-02-23',
  ActivityStartTime: '13:15:00',
  ActivityEndDate: '2018-02-23',
  ActivityEndTime: '13:15:00',
  LaboratoryName: 'Farrell Labs',
  LaboratorySampleID: '101010011110',
  AnalysisStartDate: '2018-02-23',
  AnalysisStartTime: '13:15:00',
  AnalysisStartTimeZone: '-06:00'
}

const checkProperty = (errors, keyword, property) => {
  if (errors === null) return false
  for (const error of errors) {
    if (error.keyword === 'errorMessage') {
      const nested = checkProperty(error.params.errors, keyword, property)
      if (nested) return nested
    }
    if (error.keyword !== keyword) continue
    if (
      ['required', 'dependencies'].includes(keyword) &&
      error.params.missingProperty === property
    ) {
      return true
    } else if (
      keyword === 'additionalProperties' &&
      error.params.additionalProperty === property
    ) {
      return true
    } else if (
      keyword === 'oneOf' &&
      error.params.passingSchemas.includes(property)
    ) {
      return true
    } else if (keyword === 'anyOf') return true
    else if (keyword === 'not' && error.instancePath.includes(property)) {
      return true
    } else if (keyword === 'enum' && error.instancePath.includes(property)) {
      return true
    } else if (keyword === 'minimum' && error.instancePath.includes(property)) {
      return true
    } else if (
      keyword === 'exclusiveMinimum' &&
      error.instancePath.includes(property)
    ) {
      return true
    } else if (keyword === 'maximum' && error.instancePath.includes(property)) {
      return true
    } else if (
      keyword === 'exclusiveMaximum' &&
      error.instancePath.includes(property)
    ) {
      return true
    } else if (
      keyword === 'false schema' &&
      error.instancePath.includes(property)
    ) {
      return true
    } else if (keyword === 'pattern') return true
  }
  return false
}

test('Should accept with empty object', async (t) => {
  const obj = {}
  const valid = validate(obj)
  t.true(valid)
})

test('Should accept with undefined values', async (t) => {
  const obj = {}
  for (const key in defaultObject) {
    obj[key] = undefined
  }
  const valid = validate(obj)
  t.is(valid, true)
})

// test('Should accept with empty strings values', function(done) {
//   const obj = {}
//   for(const key in schema.properties) {
//     if (schema.properties[key].type === 'string'
//       && !(schema.properties[key].enum && schema.properties[key].enum.length)
//       && !(schema.properties[key].pattern)
//     ) obj[key] = ''
//   }
//   const valid = validate(obj)
//   console.log(valid, JSON.stringify(validate.errors, null, 2))
//   t.is(valid, true)
//
// })

test('Should reject improperly formatted time', async (t) => {
  const valid = validate({
    ActivityStartDate: '2020-01-01',
    ActivityStartTime: '9:30:00'
  })
  t.is(valid, false)
  t.is(checkProperty(validate.errors, 'pattern', 'ActivityStartTime'), true)
})

// ActivityType-ResultSampleFraction
test('Should reject ResultSampleFraction when ActivityType is set to field', async (t) => {
  const valid = validate({
    ActivityType: 'Field Msr/Obs',
    ResultSampleFraction: 'Filtered'
  })
  t.is(valid, false)
  t.is(
    checkProperty(validate.errors, 'false schema', 'ResultSampleFraction'),
    true
  )
})

test('Should accept empty ResultSampleFraction when ActivityType is set to field', async (t) => {
  const valid = validate({
    ActivityType: 'Field Msr/Obs'
  })
  t.is(valid, true)
})

// CharacteristicName-MethodSpeciation
test('Should accept CharacteristicName-MethodSpeciation when its not expected', async (t) => {
  const valid = validate({
    CharacteristicName: 'Ammonia',
    MethodSpeciation: 'as N'
  })
  t.is(valid, true)
})
test('Should reject MethodSpeciation when its not expected', async (t) => {
  const valid = validate({
    CharacteristicName: 'pH',
    MethodSpeciation: 'as N'
  })
  t.is(valid, false)
  t.is(
    checkProperty(validate.errors, 'false schema', 'MethodSpeciation'),
    true
  )
})
test('Should accept MethodSpeciation when its expected', async (t) => {
  const valid = validate({
    CharacteristicName: 'pH'
  })
  t.is(valid, true)
})
test('Should accept MethodSpeciation when its not expected', async (t) => {
  const valid = validate({
    CharacteristicName: 'Ammonia'
  })
  t.is(valid, true)
})

// MonitoringLocationDepthHeightMeasure - TODO future?

// ResultDetectionQuantitationLimitMeasure-Minimum
test('Should reject ResultDetectionQuantitationLimit when measure is below 0', async (t) => {
  const valid = validate({
    ResultDetectionQuantitationLimitMeasure: -1,
    ResultDetectionQuantitationLimitUnit: 'mg/l'
  })
  t.is(valid, false)
  t.is(
    checkProperty(
      validate.errors,
      'minimum',
      'ResultDetectionQuantitationLimitMeasure'
    ),
    true
  )
})
test('Should accept ResultDetectionQuantitationLimit when measure is above 0', async (t) => {
  const valid = validate({
    ResultDetectionQuantitationLimitMeasure: 1,
    ResultDetectionQuantitationLimitUnit: 'mg/l'
  })
  t.is(valid, true)
})
test('Should ignore ResultDetectionQuantitationLimit when measure is not defined', async (t) => {
  const valid = validate({
    ResultDetectionQuantitationLimitUnit: 'mg/l'
  })
  t.is(valid, false)
  t.is(
    checkProperty(
      validate.errors,
      'minimum',
      'ResultDetectionQuantitationLimitMeasure'
    ),
    false
  )
})

// ResultDetectionQuantitationLimitUnit-None
test('Should accept when CharacteristicName is pH and ResultDetectionQuantitationLimitUnit is None', async (t) => {
  const valid = validate({
    CharacteristicName: 'pH',
    ResultDetectionQuantitationLimitMeasure: 7,
    ResultDetectionQuantitationLimitUnit: 'None'
  })
  t.is(valid, true)
})
test('Should reject when CharacteristicName is pH and ResultDetectionQuantitationLimitUnit is not None', async (t) => {
  const valid = validate({
    CharacteristicName: 'pH',
    ResultDetectionQuantitationLimitMeasure: 7,
    ResultDetectionQuantitationLimitUnit: 'mg/L'
  })
  t.is(valid, false)
  t.is(
    checkProperty(
      validate.errors,
      'enum',
      'ResultDetectionQuantitationLimitUnit'
    ),
    true
  )
  // t.is(checkProperty(validate.errors, 'false schema', 'ResultDetectionQuantitationLimitUnit'), true)
})

// ResultDetectionQuantitationLimitUnit-NoValue
test('Should accept when ResultDetectionQuantitationLimitMeasure & ResultDetectionQuantitationLimitUnit exist', async (t) => {
  const valid = validate({
    CharacteristicName: 'Temperature, water',
    ResultDetectionQuantitationLimitMeasure: 0,
    ResultDetectionQuantitationLimitUnit: 'deg C'
  })
  t.is(valid, true)
})
test('Should reject when ResultDetectionQuantitationLimitUnit exists without ResultDetectionQuantitationLimitMeasure', async (t) => {
  const valid = validate({
    CharacteristicName: 'Temperature, water',
    ResultDetectionQuantitationLimitUnit: 'deg C'
  })
  t.is(valid, false)
  t.is(
    checkProperty(
      validate.errors,
      'required',
      'ResultDetectionQuantitationLimitMeasure'
    ),
    true
  )
  t.is(
    checkProperty(
      validate.errors,
      'false schema',
      'ResultDetectionQuantitationLimitUnit'
    ),
    true
  )
})

// ResultUnit-None
test('Should accept when CharacteristicName is pH and ResultUnit is None', async (t) => {
  const valid = validate({
    CharacteristicName: 'pH',
    ResultValue: 7,
    ResultUnit: 'None'
  })
  t.is(valid, true)
})
test('Should reject when CharacteristicName is pH and ResultUnit is not None', async (t) => {
  const valid = validate({
    CharacteristicName: 'pH',
    ResultValue: 7,
    ResultUnit: 'mg/L'
  })
  t.is(valid, false)
  t.is(checkProperty(validate.errors, 'enum', 'ResultUnit'), true)
  // t.is(checkProperty(validate.errors, 'false schema', 'ResultUnit'), true)
})

// ResultUnit-NoValue
test('Should accept when ResultValue & ResultUnit exist', async (t) => {
  const valid = validate({
    CharacteristicName: 'Temperature, water',
    ResultValue: 0,
    ResultUnit: 'deg C'
  })
  t.is(valid, true)
})
test('Should reject when ResultUnit exists without ResultValue', async (t) => {
  const valid = validate({
    CharacteristicName: 'Temperature, water',
    ResultUnit: 'deg C'
  })
  t.is(valid, false)
  t.is(checkProperty(validate.errors, 'required', 'ResultValue'), true)
  t.is(checkProperty(validate.errors, 'false schema', 'ResultUnit'), true)
})

// ResultValue-DissolvedOxygenUnit
test('Should reject Dissolved oxygen (DO) in %', async (t) => {
  const valid = validate({
    CharacteristicName: 'Dissolved oxygen (DO)',
    ResultValue: 1,
    ResultUnit: '%'
  })
  t.is(valid, false)
  t.is(checkProperty(validate.errors, 'enum', 'ResultUnit'), true)
})
test('Should accept Dissolved oxygen (DO) in mg/L', async (t) => {
  const valid = validate({
    CharacteristicName: 'Dissolved oxygen (DO)',
    ResultValue: 1,
    ResultUnit: 'mg/L'
  })
  t.is(valid, true)
})

// ResultValue-DOSatMinimum - TODO
/*test('Should reject Result when measure is below 0', async (t) => {
  const valid = validate({
    ResultValue: -1,
    ResultUnit: 'mg/l'
  })
  t.is(valid, false)
  t.is(checkProperty(validate.errors, 'minimum', 'ResultValue'), true)
})
test('Should accept Result when measure is above 0', async (t) => {
  const valid = validate({
    ResultValue: 1,
    ResultUnit: 'mg/l'
  })
  t.is(valid, true)
})*/

// ResultValue-Minimum
test('Should reject Result when measure is below 0', async (t) => {
  const valid = validate({
    ResultValue: -1,
    ResultUnit: 'mg/l'
  })
  t.is(valid, false)
  t.is(checkProperty(validate.errors, 'minimum', 'ResultValue'), true)
})
test('Should accept Result when measure is above 0', async (t) => {
  const valid = validate({
    ResultValue: 1,
    ResultUnit: 'mg/l'
  })
  t.is(valid, true)
})
test('Should ignore Result when measure is not defined', async (t) => {
  const valid = validate({
    ResultUnit: '#/100ml'
  })
  t.is(valid, false)
  t.is(checkProperty(validate.errors, 'minimum', 'ResultValue'), false)
})

// ResultValue-pHRange
test('Should reject pH below range', async (t) => {
  const valid = validate({
    CharacteristicName: 'pH',
    ResultValue: -1,
    ResultUnit: 'None'
  })
  t.is(valid, false)
  t.is(checkProperty(validate.errors, 'minimum', 'ResultValue'), true)
})
test('Should reject pH above range', async (t) => {
  const valid = validate({
    CharacteristicName: 'pH',
    ResultValue: 15,
    ResultUnit: 'None'
  })
  t.is(valid, false)
  t.is(checkProperty(validate.errors, 'maximum', 'ResultValue'), true)
})
test('Should accept pH within range', async (t) => {
  const valid = validate({
    CharacteristicName: 'pH',
    ResultValue: 7,
    ResultUnit: 'None'
  })
  t.is(valid, true)
})

// ResultValue-TemperatureRange
test('Should reject Temperature below range', async (t) => {
  const valid = validate({
    CharacteristicName: 'Temperature, water',
    ResultValue: -101,
    ResultUnit: 'deg C'
  })
  t.is(valid, false)
  t.is(checkProperty(validate.errors, 'minimum', 'ResultValue'), true)
})
test('Should reject Temperature above range', async (t) => {
  const valid = validate({
    CharacteristicName: 'Temperature, water',
    ResultValue: 101,
    ResultUnit: 'deg C'
  })
  t.is(valid, false)
  t.is(checkProperty(validate.errors, 'maximum', 'ResultValue'), true)
})
test('Should accept Temperature within range', async (t) => {
  const valid = validate({
    CharacteristicName: 'Temperature, water',
    ResultValue: 0,
    ResultUnit: 'deg C'
  })
  t.is(valid, true)
})

// WhiteSpace
test('Should reject columns with extra whitespace', async (t) => {
  const valid = validate({
    DatasetName: '  sum',
    MonitoringLocationID: 'sum  ',
    MonitoringLocationName: '  sum',
    ResultComment: 'sum  ',
    ResultAnalyticalMethodID: '  sum  ',
    ResultAnalyticalMethodName: 'sum  ',
    LaboratoryName: '  sum',
    LaboratorySampleID: '  sum  '
  })
  t.is(valid, false)
  t.is(checkProperty(validate.errors, 'pattern', 'DatasetName'), true)
  t.is(checkProperty(validate.errors, 'pattern', 'MonitoringLocationID'), true)
  t.is(
    checkProperty(validate.errors, 'pattern', 'MonitoringLocationName'),
    true
  )
  t.is(checkProperty(validate.errors, 'pattern', 'ResultComment'), true)
  t.is(
    checkProperty(validate.errors, 'pattern', 'ResultAnalyticalMethodID'),
    true
  )
  t.is(
    checkProperty(validate.errors, 'pattern', 'ResultAnalyticalMethodName'),
    true
  )
  t.is(checkProperty(validate.errors, 'pattern', 'LaboratoryName'), true)
  t.is(checkProperty(validate.errors, 'pattern', 'LaboratorySampleID'), true)
})
test('Should accept columns without extra whitespace', async (t) => {
  const valid = validate({
    DatasetName: 'sum',
    MonitoringLocationID: 'sum',
    MonitoringLocationName: 'sum',
    ResultComment: 'sum',
    ResultAnalyticalMethodID: 'sum',
    ResultAnalyticalMethodName: 'sum',
    LaboratoryName: 'sum',
    LaboratorySampleID: 'sum'
  })
  t.is(valid, true)
})
