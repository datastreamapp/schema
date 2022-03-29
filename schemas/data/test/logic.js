import test from 'ava'

import validate from '../frontend/index.js'

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

// allOf/1
test('Should accept CharacteristicName AND NOT MethodSpeciation', async (t) => {
  const valid = validate({
    CharacteristicName: 'Calcium'
  })
  t.false(valid)
  t.is(checkProperty(validate.errors, 'required', 'CharacteristicName'), false)
  t.is(checkProperty(validate.errors, 'required', 'MethodSpeciation'), false)
})
test('Should reject CharacteristicName AND NOT MethodSpeciation', async (t) => {
  const valid = validate({
    CharacteristicName: 'Nitrate'
  })
  t.false(valid)
  t.is(checkProperty(validate.errors, 'required', 'MethodSpeciation'), true)
})
test('Should accept CharacteristicName AND MethodSpeciation', async (t) => {
  const valid = validate({
    CharacteristicName: 'Nitrate',
    MethodSpeciation: 'as N'
  })
  t.false(valid)
  t.is(checkProperty(validate.errors, 'required', 'CharacteristicName'), false)
  t.is(checkProperty(validate.errors, 'required', 'MethodSpeciation'), false)
})

// CharacteristicName-ResultSampleFraction
test('Should accept CharacteristicName AND NOT ResultSampleFraction', async (t) => {
  const valid = validate({
    CharacteristicName: 'Dissolved oxygen (DO)'
  })
  t.false(valid)
  t.is(checkProperty(validate.errors, 'required', 'CharacteristicName'), false)
  t.is(
    checkProperty(validate.errors, 'required', 'ResultSampleFraction'),
    false
  )
})
test('Should rejects CharacteristicName AND NOT ResultSampleFraction', async (t) => {
  const valid = validate({
    CharacteristicName: 'Silver'
  })
  t.false(valid)
  t.is(
    checkProperty(validate.errors, 'required', 'ResultSampleFraction'),
    true
  )
})
test('Should accept CharacteristicName AND ResultSampleFraction', async (t) => {
  const valid = validate({
    CharacteristicName: 'Silver',
    ResultSampleFraction: 'Dissolved'
  })
  t.false(valid)
  t.is(checkProperty(validate.errors, 'required', 'CharacteristicName'), false)
  t.is(
    checkProperty(validate.errors, 'required', 'ResultSampleFraction'),
    false
  )
})

// CharacteristicName-Nutrient-ResultSampleFraction
test('Should reject Nutrient CharacteristicName AND ResultSampleFraction', async (t) => {
  const valid = validate({
    ActivityMediaName: 'Surface Water',
    CharacteristicName: 'Ammonia',
    ActivityType: '',
    ResultSampleFraction: 'Total'
  })
  t.false(valid)
  t.is(checkProperty(validate.errors, 'required', 'CharacteristicName'), false)
  t.is(
    checkProperty(validate.errors, 'required', 'ResultSampleFraction'),
    false
  )
  t.is(checkProperty(validate.errors, 'enum', 'ResultSampleFraction'), true)
})
test('Should accept Nutrient CharacteristicName AND filter ResultSampleFraction', async (t) => {
  const valid = validate({
    ActivityMediaName: 'Surface Water',
    CharacteristicName: 'Ammonia',
    ActivityType: '',
    ResultSampleFraction: 'Filtered'
  })
  t.false(valid)
  t.is(checkProperty(validate.errors, 'required', 'CharacteristicName'), false)
  t.is(
    checkProperty(validate.errors, 'required', 'ResultSampleFraction'),
    false
  )
  t.is(checkProperty(validate.errors, 'enum', 'ResultSampleFraction'), false)
})
test('Should accept Nutrient Sediment', async (t) => {
  const valid = validate({
    ActivityMediaName: 'Surface Water Sediment',
    CharacteristicName: 'Ammonia',
    ActivityType: '',
    ResultSampleFraction: 'Total'
  })
  t.false(valid)
  t.is(checkProperty(validate.errors, 'required', 'CharacteristicName'), false)
  t.is(
    checkProperty(validate.errors, 'required', 'ResultSampleFraction'),
    false
  )
  t.is(checkProperty(validate.errors, 'enum', 'ResultSampleFraction'), false)
})
// test('Should accept Nutrient Sediment with no sample fraction', async (t) => {
//   let valid = validate({
//     'ActivityMediaName':'Surface Water Sediment',
//     'CharacteristicName': 'Total Nitrogen, mixed forms',
//     'ActivityType': '',
//     'ResultSampleFraction': ''
//   })
//   console.log(validate.errors)
//   t.is(checkProperty(validate.errors, 'required', 'CharacteristicName'), false)
//   t.is(checkProperty(validate.errors, 'required', 'ResultSampleFraction'), false)
//   t.is(checkProperty(validate.errors, 'enum', 'ResultSampleFraction'), false)
//
// })

// allOf/3
test('Should reject NOT ResultValue AND NOT ResultDetectionCondition', async (t) => {
  const valid = validate({})
  t.false(valid)
  t.is(checkProperty(validate.errors, 'required', 'ResultValue'), true)
  t.is(
    checkProperty(validate.errors, 'required', 'ResultDetectionCondition'),
    true
  )
})
test('Should reject ResultValue AND ResultDetectionCondition', async (t) => {
  const valid = validate({
    ResultValue: 1,
    ResultDetectionCondition: 'Not Reported'
  })
  t.false(valid)
  t.is(checkProperty(validate.errors, 'false schema', 'ResultValue'), true)
  t.is(
    checkProperty(validate.errors, 'false schema', 'ResultDetectionCondition'),
    true
  )
})

test('Should accept ResultValue OR ResultDetectionCondition', async (t) => {
  let valid = validate({
    ResultValue: 1
  })
  t.false(valid)
  t.is(checkProperty(validate.errors, 'required', 'ResultValue'), false)
  t.is(
    checkProperty(validate.errors, 'required', 'ResultDetectionCondition'),
    false
  )
  t.is(checkProperty(validate.errors, 'enum', 'ResultValue'), false)
  t.is(
    checkProperty(validate.errors, 'enum', 'ResultDetectionCondition'),
    false
  )

  valid = validate({
    ResultDetectionCondition: 'Not Reported'
  })
  t.false(valid)
  t.is(checkProperty(validate.errors, 'required', 'ResultValue'), false)
  t.is(
    checkProperty(validate.errors, 'required', 'ResultDetectionCondition'),
    false
  )
  t.is(checkProperty(validate.errors, 'enum', 'ResultValue'), false)
  t.is(
    checkProperty(validate.errors, 'enum', 'ResultDetectionCondition'),
    false
  )
})

// allOf/4

test('Should reject ResultDetectionCondition = Present Above Quantification Limit', async (t) => {
  const valid = validate({
    ResultDetectionCondition: 'Present Above Quantification Limit'
  })
  t.false(valid)
  t.is(
    checkProperty(
      validate.errors,
      'dependencies',
      'ResultDetectionQuantitationLimitType'
    ),
    true
  )
  t.is(
    checkProperty(
      validate.errors,
      'dependencies',
      'ResultDetectionQuantitationLimitMeasure'
    ),
    true
  )
  t.is(
    checkProperty(
      validate.errors,
      'dependencies',
      'ResultDetectionQuantitationLimitUnit'
    ),
    true
  )
})

test('Should reject ResultDetectionCondition = Present Below Quantification Limit', async (t) => {
  const valid = validate({
    ResultValue: 1,
    ResultDetectionCondition: 'Present Below Quantification Limit'
  })
  t.false(valid)
  t.is(
    checkProperty(
      validate.errors,
      'dependencies',
      'ResultDetectionQuantitationLimitType'
    ),
    true
  )
  t.is(
    checkProperty(
      validate.errors,
      'dependencies',
      'ResultDetectionQuantitationLimitMeasure'
    ),
    true
  )
  t.is(
    checkProperty(
      validate.errors,
      'dependencies',
      'ResultDetectionQuantitationLimitUnit'
    ),
    true
  )
})

test('Should accept ResultDetectionCondition', async (t) => {
  const valid = validate({
    ResultValue: 1,
    ResultDetectionCondition: 'Present Below Quantification Limit',
    ResultDetectionQuantitationLimitType: 'A',
    ResultDetectionQuantitationLimitMeasure: 1,
    ResultDetectionQuantitationLimitUnit: 'mg/L'
  })
  t.false(valid)
  t.is(
    checkProperty(
      validate.errors,
      'dependencies',
      'ResultDetectionQuantitationLimitType'
    ),
    false
  )
  t.is(
    checkProperty(
      validate.errors,
      'dependencies',
      'ResultDetectionQuantitationLimitMeasure'
    ),
    false
  )
  t.is(
    checkProperty(
      validate.errors,
      'dependencies',
      'ResultDetectionQuantitationLimitUnit'
    ),
    false
  )
})

// allOf/4
test('Should reject ResultDetectionCondition = Not Detected', async (t) => {
  const valid = validate({
    ResultDetectionCondition: 'Not Detected',
    ResultDetectionQuantitationLimitType: 'Sample Detection Limit',
    ResultDetectionQuantitationLimitMeasure: 0,
    ResultDetectionQuantitationLimitUnit: 'None'
  })
  t.false(valid)
  t.is(
    checkProperty(
      validate.errors,
      'false schema',
      'ResultDetectionQuantitationLimitType'
    ),
    true
  )
  t.is(
    checkProperty(
      validate.errors,
      'false schema',
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

test('Should accept ResultDetectionCondition = Not Detected', async (t) => {
  const valid = validate({
    ResultDetectionCondition: 'Not Detected'
  })
  t.false(valid)
  t.is(
    checkProperty(
      validate.errors,
      'enum',
      'ResultDetectionQuantitationLimitType'
    ),
    false
  )
  t.is(
    checkProperty(
      validate.errors,
      'enum',
      'ResultDetectionQuantitationLimitMeasure'
    ),
    false
  )
  t.is(
    checkProperty(
      validate.errors,
      'enum',
      'ResultDetectionQuantitationLimitUnit'
    ),
    false
  )
})

test('Should reject ResultDetectionCondition = Detected Not Quantified', async (t) => {
  const valid = validate({
    ResultDetectionCondition: 'Detected Not Quantified',
    ResultDetectionQuantitationLimitType: 'Sample Detection Limit',
    ResultDetectionQuantitationLimitMeasure: 0,
    ResultDetectionQuantitationLimitUnit: 'None'
  })
  t.false(valid)
  t.is(
    checkProperty(
      validate.errors,
      'false schema',
      'ResultDetectionQuantitationLimitType'
    ),
    true
  )
  t.is(
    checkProperty(
      validate.errors,
      'false schema',
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

test('Should accept ResultDetectionCondition = Detected Not Quantified', async (t) => {
  const valid = validate({
    ResultDetectionCondition: 'Detected Not Quantified'
  })
  t.false(valid)
  t.is(
    checkProperty(
      validate.errors,
      'enum',
      'ResultDetectionQuantitationLimitType'
    ),
    false
  )
  t.is(
    checkProperty(
      validate.errors,
      'enum',
      'ResultDetectionQuantitationLimitMeasure'
    ),
    false
  )
  t.is(
    checkProperty(
      validate.errors,
      'enum',
      'ResultDetectionQuantitationLimitUnit'
    ),
    false
  )
})

// allOf/5
test('Should reject ActivityType = Sample for ResultAnalyticalMethodID', async (t) => {
  const valid = validate({
    ActivityType: 'Sample-Other'
  })
  t.false(valid)
  t.is(
    checkProperty(validate.errors, 'dependencies', 'ResultAnalyticalMethodID'),
    true
  )
  t.is(
    checkProperty(
      validate.errors,
      'dependencies',
      'ResultAnalyticalMethodContext'
    ),
    true
  )
})
test('Should accept ActivityType = Sample for ResultAnalyticalMethodID', async (t) => {
  const valid = validate({
    ActivityType: 'Sample-Other',
    ResultAnalyticalMethodID: '0',
    ResultAnalyticalMethodContext: 'ENV'
  })
  t.false(valid)
  t.is(
    checkProperty(validate.errors, 'dependencies', 'ResultAnalyticalMethodID'),
    false
  )
  t.is(
    checkProperty(
      validate.errors,
      'dependencies',
      'ResultAnalyticalMethodContext'
    ),
    false
  )
})

test('Should reject ActivityType = Sample for ResultAnalyticalMethodName', async (t) => {
  const valid = validate({
    ActivityType: 'Sample-Other'
  })
  t.false(valid)
  t.is(
    checkProperty(
      validate.errors,
      'dependencies',
      'ResultAnalyticalMethodName'
    ),
    true
  )
})

test('Should accept ActivityType = Sample for ResultAnalyticalMethodName', async (t) => {
  const valid = validate({
    ActivityType: 'Sample-Other',
    ResultAnalyticalMethodName: 'Unspecified'
  })
  t.false(valid)
  t.is(
    checkProperty(
      validate.errors,
      'dependencies',
      'ResultAnalyticalMethodName'
    ),
    false
  )
})

// CSV Injection
test('Should reject columns with potential csv injection', async (t) => {
  const valid = validate({
    DatasetName: '=equals',
    MonitoringLocationID: '+positive',
    MonitoringLocationName: '-negative',
    ResultComment: '@at  ',
    ResultAnalyticalMethodID: `
carriage return`,
    ResultAnalyticalMethodName: '\ncarriage return',
    LaboratoryName: '\rcarriage return',
    LaboratorySampleID: '\ttab'
  })
  t.false(valid)
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

test('Should accept columns without potential csv injection', async (t) => {
  const valid = validate({
    DatasetName: '~',
    MonitoringLocationID: '1',
    MonitoringLocationName: '&',
    ResultComment: '$',
    ResultAnalyticalMethodID: '#',
    ResultAnalyticalMethodName: '|',
    LaboratoryName: '_',
    LaboratorySampleID: '*'
  })
  t.false(valid)
  // console.log(valid, JSON.stringify(validate.errors, null, 2))
  t.is(checkProperty(validate.errors, 'pattern', 'DatasetName'), false)
  t.is(
    checkProperty(validate.errors, 'pattern', 'MonitoringLocationID'),
    false
  )
  t.is(
    checkProperty(validate.errors, 'pattern', 'MonitoringLocationName'),
    false
  )
  t.is(checkProperty(validate.errors, 'pattern', 'ResultComment'), false)
  t.is(
    checkProperty(validate.errors, 'pattern', 'ResultAnalyticalMethodID'),
    false
  )
  t.is(
    checkProperty(validate.errors, 'pattern', 'ResultAnalyticalMethodName'),
    false
  )
  t.is(checkProperty(validate.errors, 'pattern', 'LaboratoryName'), false)
  t.is(checkProperty(validate.errors, 'pattern', 'LaboratorySampleID'), false)
})
