import { test } from 'node:test'
import assert from 'node:assert/strict'
import validate from '../frontend/index.js'

const checkProperty = (errors, keyword, property) => {
  if (errors === null) return false
  for (const error of errors) {
    if (keyword === 'message' && error.message === property) {
      return true
    } else if (error.keyword === 'errorMessage') {
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
    } else if (keyword === 'anyOf')
      return true // anyOf branches surface as nested `required` errors inside errorMessage; query those directly via keyword="required" for property-specific assertions.
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

// *** ActivityType-CTS-ActivityStartTime *** //
test('Should accept ActivityType without ActivityStartTime for non-CTS', async (t) => {
  const valid = validate({
    ActivityType: 'Field Msr/Obs',
  })
  assert.equal(valid, false)
  assert.equal(
    checkProperty(validate.errors, 'required', 'ActivityType'),
    false
  )
  assert.equal(
    checkProperty(validate.errors, 'required', 'ActivityStartTime'),
    false
  )
})

test('Should accept ActivityType with ActivityStartTime for non-CTS', async (t) => {
  const valid = validate({
    ActivityType: 'Field Msr/Obs',
    ActivityStartTime: '13:15:00',
  })
  assert.equal(valid, false)
  assert.equal(
    checkProperty(validate.errors, 'required', 'ActivityType'),
    false
  )
  assert.equal(
    checkProperty(validate.errors, 'required', 'ActivityStartTime'),
    false
  )
})

test('Should reject ActivityType Field Msr/Obs-Continuous Time Series without ActivityStartTime for CTS', async (t) => {
  const valid = validate({
    ActivityType: 'Field Msr/Obs-Continuous Time Series',
  })
  assert.equal(valid, false)
  assert.equal(
    checkProperty(validate.errors, 'required', 'ActivityStartTime'),
    true
  )
})

test('Should accept ActivityType Field Msr/Obs-Continuous Time Series with ActivityStartTime for CTS', async (t) => {
  const valid = validate({
    ActivityType: 'Field Msr/Obs-Continuous Time Series',
    ActivityStartTime: '13:15:00',
  })
  assert.equal(valid, false)
  assert.equal(
    checkProperty(validate.errors, 'required', 'ActivityType'),
    false
  )
  assert.equal(
    checkProperty(validate.errors, 'required', 'ActivityStartTime'),
    false
  )
})

// *** ActivityType-ResultAnalyticalMethod *** //
test('Should reject ActivityType = Sample-*', async (t) => {
  const valid = validate({
    ActivityType: 'Sample-Other',
  })
  assert.equal(valid, false)
  assert.equal(
    checkProperty(validate.errors, 'dependencies', 'LaboratoryName'),
    true
  )
  assert.equal(
    checkProperty(validate.errors, 'dependencies', 'ResultAnalyticalMethodID'),
    true
  )
  assert.equal(
    checkProperty(
      validate.errors,
      'dependencies',
      'ResultAnalyticalMethodContext'
    ),
    true
  )
  assert.equal(
    checkProperty(
      validate.errors,
      'dependencies',
      'ResultAnalyticalMethodName'
    ),
    true
  )
})
test('Should reject ActivityType = Quality Control Sample-*', async (t) => {
  const valid = validate({
    ActivityType: 'Quality Control Sample-Other',
  })
  assert.equal(valid, false)
  assert.equal(
    checkProperty(validate.errors, 'dependencies', 'LaboratoryName'),
    true
  )
  assert.equal(
    checkProperty(validate.errors, 'dependencies', 'ResultAnalyticalMethodID'),
    true
  )
  assert.equal(
    checkProperty(
      validate.errors,
      'dependencies',
      'ResultAnalyticalMethodContext'
    ),
    true
  )
  assert.equal(
    checkProperty(
      validate.errors,
      'dependencies',
      'ResultAnalyticalMethodName'
    ),
    true
  )
})
test('Should accept ActivityType = Sample-* w/ ResultAnalyticalMethodID & ResultAnalyticalMethodContext', async (t) => {
  const valid = validate({
    ActivityType: 'Sample-Other',
    LaboratoryName: 'A',
    ResultAnalyticalMethodID: '0',
    ResultAnalyticalMethodContext: 'ENV',
  })
  assert.equal(valid, false)
  assert.equal(
    checkProperty(validate.errors, 'dependencies', 'LaboratoryName'),
    false
  )
  assert.equal(
    checkProperty(validate.errors, 'dependencies', 'ResultAnalyticalMethodID'),
    false
  )
  assert.equal(
    checkProperty(
      validate.errors,
      'dependencies',
      'ResultAnalyticalMethodContext'
    ),
    false
  )
  assert.equal(
    checkProperty(
      validate.errors,
      'dependencies',
      'ResultAnalyticalMethodName'
    ),
    false
  )
})
test('Should accept ActivityType = Quality Control Sample-* w/ ResultAnalyticalMethodID & ResultAnalyticalMethodContext', async (t) => {
  const valid = validate({
    ActivityType: 'Quality Control Sample-Other',
    LaboratoryName: 'A',
    ResultAnalyticalMethodID: '0',
    ResultAnalyticalMethodContext: 'ENV',
  })
  assert.equal(valid, false)
  assert.equal(
    checkProperty(validate.errors, 'dependencies', 'LaboratoryName'),
    false
  )
  assert.equal(
    checkProperty(validate.errors, 'dependencies', 'ResultAnalyticalMethodID'),
    false
  )
  assert.equal(
    checkProperty(
      validate.errors,
      'dependencies',
      'ResultAnalyticalMethodContext'
    ),
    false
  )
  assert.equal(
    checkProperty(
      validate.errors,
      'dependencies',
      'ResultAnalyticalMethodName'
    ),
    false
  )
})

test('Should accept ActivityType = Sample-* w/ ResultAnalyticalMethodName', async (t) => {
  const valid = validate({
    ActivityType: 'Sample-Other',
    LaboratoryName: 'A',
    ResultAnalyticalMethodName: 'Unspecified',
  })
  assert.equal(valid, false)
  assert.equal(
    checkProperty(validate.errors, 'dependencies', 'LaboratoryName'),
    false
  )
  assert.equal(
    checkProperty(validate.errors, 'dependencies', 'ResultAnalyticalMethodID'),
    false
  )
  assert.equal(
    checkProperty(
      validate.errors,
      'dependencies',
      'ResultAnalyticalMethodContext'
    ),
    false
  )
  assert.equal(
    checkProperty(
      validate.errors,
      'dependencies',
      'ResultAnalyticalMethodName'
    ),
    false
  )
})
test('Should accept ActivityType = Quality Control Sample-* w/ ResultAnalyticalMethodName', async (t) => {
  const valid = validate({
    ActivityType: 'Sample-Other',
    LaboratoryName: 'A',
    ResultAnalyticalMethodName: 'Unspecified',
  })
  assert.equal(valid, false)
  assert.equal(
    checkProperty(validate.errors, 'dependencies', 'LaboratoryName'),
    false
  )
  assert.equal(
    checkProperty(validate.errors, 'dependencies', 'ResultAnalyticalMethodID'),
    false
  )
  assert.equal(
    checkProperty(
      validate.errors,
      'dependencies',
      'ResultAnalyticalMethodContext'
    ),
    false
  )
  assert.equal(
    checkProperty(
      validate.errors,
      'dependencies',
      'ResultAnalyticalMethodName'
    ),
    false
  )
})

// *** CharacteristicName-MethodSpeciation *** //
test('Should accept CharacteristicName AND NOT MethodSpeciation', async (t) => {
  const valid = validate({
    CharacteristicName: 'Calcium',
  })
  assert.equal(valid, false)
  assert.equal(
    checkProperty(validate.errors, 'required', 'CharacteristicName'),
    false
  )
  assert.equal(
    checkProperty(validate.errors, 'required', 'MethodSpeciation'),
    false
  )
})
test('Should reject CharacteristicName Ammonia, un-ionized AND NOT MethodSpeciation', async (t) => {
  const valid = validate({
    CharacteristicName: 'Ammonia, un-ionized',
  })
  assert.equal(valid, false)
  assert.equal(
    checkProperty(validate.errors, 'required', 'MethodSpeciation'),
    true
  )
  assert.equal(
    checkProperty(
      validate.errors,
      'message',
      'error-CharacteristicName-MethodSpeciation'
    ),
    true
  )
})
test('Should reject CharacteristicName Nitrogen-15 AND NOT MethodSpeciation', async (t) => {
  const valid = validate({
    CharacteristicName: 'Nitrogen-15',
    LaboratoryName: 'A',
  })
  assert.equal(valid, false)
  assert.equal(
    checkProperty(validate.errors, 'required', 'MethodSpeciation'),
    true
  )
  assert.equal(
    checkProperty(
      validate.errors,
      'message',
      'error-CharacteristicName-MethodSpeciation'
    ),
    true
  )
})
test('Should accept CharacteristicName AND MethodSpeciation', async (t) => {
  const valid = validate({
    CharacteristicName: 'Nitrate',
    MethodSpeciation: 'as N',
  })
  assert.equal(valid, false)
  assert.equal(
    checkProperty(validate.errors, 'required', 'CharacteristicName'),
    false
  )
  assert.equal(
    checkProperty(validate.errors, 'required', 'MethodSpeciation'),
    false
  )
})

// *** CharacteristicName-Nutrient-ResultSampleFraction *** //
test('Should reject Nutrient CharacteristicName AND ResultSampleFraction', async (t) => {
  const valid = validate({
    ActivityMediaName: 'Surface Water',
    CharacteristicName: 'Ammonia',
    ActivityType: '',
    ResultSampleFraction: 'Total',
  })
  assert.equal(valid, false)
  assert.equal(
    checkProperty(validate.errors, 'required', 'CharacteristicName'),
    false
  )
  assert.equal(
    checkProperty(validate.errors, 'required', 'ResultSampleFraction'),
    false
  )
  assert.equal(
    checkProperty(validate.errors, 'enum', 'ResultSampleFraction'),
    true
  )
})
test('Should accept Nutrient CharacteristicName AND filter ResultSampleFraction', async (t) => {
  const valid = validate({
    ActivityMediaName: 'Surface Water',
    CharacteristicName: 'Ammonia',
    ActivityType: '',
    ResultSampleFraction: 'Filtered',
  })
  assert.equal(valid, false)
  assert.equal(
    checkProperty(validate.errors, 'required', 'CharacteristicName'),
    false
  )
  assert.equal(
    checkProperty(validate.errors, 'required', 'ResultSampleFraction'),
    false
  )
  assert.equal(
    checkProperty(validate.errors, 'enum', 'ResultSampleFraction'),
    false
  )
})
test('Should accept Nutrient Sediment', async (t) => {
  const valid = validate({
    ActivityMediaName: 'Surface Water Sediment',
    CharacteristicName: 'Ammonia',
    ActivityType: '',
    ResultSampleFraction: 'Total',
  })
  assert.equal(valid, false)
  assert.equal(
    checkProperty(validate.errors, 'required', 'CharacteristicName'),
    false
  )
  assert.equal(
    checkProperty(validate.errors, 'required', 'ResultSampleFraction'),
    false
  )
  assert.equal(
    checkProperty(validate.errors, 'enum', 'ResultSampleFraction'),
    false
  )
})
// test('Should accept Nutrient Sediment with no sample fraction', async (t) => {
//   let valid = validate({
//     'ActivityMediaName':'Surface Water Sediment',
//     'CharacteristicName': 'Total Nitrogen, mixed forms',
//     'ActivityType': '',
//     'ResultSampleFraction': ''
//   })
//   console.log(validate.errors)
//   assert.equal(checkProperty(validate.errors, 'required', 'CharacteristicName'), false)
//   assert.equal(checkProperty(validate.errors, 'required', 'ResultSampleFraction'), false)
//   assert.equal(checkProperty(validate.errors, 'enum', 'ResultSampleFraction'), false)
//
// })

// *** CharacteristicName-ResultSampleFraction *** //
test('Should accept CharacteristicName AND NOT ResultSampleFraction', async (t) => {
  const valid = validate({
    CharacteristicName: 'Dissolved oxygen (DO)',
  })
  assert.equal(valid, false)
  assert.equal(
    checkProperty(validate.errors, 'required', 'CharacteristicName'),
    false
  )
  assert.equal(
    checkProperty(validate.errors, 'required', 'ResultSampleFraction'),
    false
  )
})
test('Should rejects CharacteristicName AND NOT ResultSampleFraction', async (t) => {
  const valid = validate({
    CharacteristicName: 'Silver',
  })
  assert.equal(valid, false)
  assert.equal(
    checkProperty(validate.errors, 'required', 'ResultSampleFraction'),
    true
  )
})
test('Should accept CharacteristicName AND ResultSampleFraction', async (t) => {
  const valid = validate({
    CharacteristicName: 'Silver',
    ResultSampleFraction: 'Dissolved',
  })
  assert.equal(valid, false)
  assert.equal(
    checkProperty(validate.errors, 'required', 'CharacteristicName'),
    false
  )
  assert.equal(
    checkProperty(validate.errors, 'required', 'ResultSampleFraction'),
    false
  )
})

// *** CharacteristicName-StableIsotope-MethodSpeciation *** //
test('Should reject StableIsotope CharacteristicName, MethodSpeciation required', async (t) => {
  const valid = validate({
    CharacteristicName: 'Nitrogen-15',
  })
  assert.equal(valid, false)
  assert.equal(
    checkProperty(validate.errors, 'required', 'CharacteristicName'),
    false
  )
  assert.equal(
    checkProperty(validate.errors, 'required', 'MethodSpeciation'),
    true
  )
})
test('Should reject StableIsotope CharacteristicName', async (t) => {
  const valid = validate({
    CharacteristicName: 'Nitrogen-15',
    MethodSpeciation: 'as NH4',
  })
  assert.equal(valid, false)
  assert.equal(
    checkProperty(validate.errors, 'required', 'CharacteristicName'),
    false
  )
  assert.equal(checkProperty(validate.errors, 'enum', 'MethodSpeciation'), true)
})
test('Should accept StableIsotope CharacteristicName', async (t) => {
  const valid = validate({
    CharacteristicName: 'Nitrogen-15',
    MethodSpeciation: 'of NH4',
  })
  assert.equal(valid, false)
  assert.equal(
    checkProperty(validate.errors, 'required', 'CharacteristicName'),
    false
  )
  assert.equal(
    checkProperty(validate.errors, 'required', 'MethodSpeciation'),
    false
  )
})

// *** ResultDetectionCondition-ResultValue *** //
test('Should reject NOT ResultValue AND NOT ResultDetectionCondition', async (t) => {
  const valid = validate({})
  assert.equal(valid, false)
  assert.equal(checkProperty(validate.errors, 'required', 'ResultValue'), true)
  assert.equal(
    checkProperty(validate.errors, 'required', 'ResultDetectionCondition'),
    true
  )
})
test('Should reject ResultValue AND ResultDetectionCondition', async (t) => {
  const valid = validate({
    ResultValue: 1,
    ResultDetectionCondition: 'Not Reported',
  })
  assert.equal(valid, false)
  assert.equal(
    checkProperty(validate.errors, 'false schema', 'ResultValue'),
    true
  )
  assert.equal(
    checkProperty(validate.errors, 'false schema', 'ResultDetectionCondition'),
    true
  )
})

test('Should accept ResultValue OR ResultDetectionCondition', async (t) => {
  let valid = validate({
    ResultValue: 1,
  })
  assert.equal(valid, false)
  assert.equal(checkProperty(validate.errors, 'required', 'ResultValue'), false)
  assert.equal(
    checkProperty(validate.errors, 'required', 'ResultDetectionCondition'),
    false
  )
  assert.equal(checkProperty(validate.errors, 'enum', 'ResultValue'), false)
  assert.equal(
    checkProperty(validate.errors, 'enum', 'ResultDetectionCondition'),
    false
  )

  valid = validate({
    ResultDetectionCondition: 'Not Reported',
  })
  assert.equal(valid, false)
  assert.equal(checkProperty(validate.errors, 'required', 'ResultValue'), false)
  assert.equal(
    checkProperty(validate.errors, 'required', 'ResultDetectionCondition'),
    false
  )
  assert.equal(checkProperty(validate.errors, 'enum', 'ResultValue'), false)
  assert.equal(
    checkProperty(validate.errors, 'enum', 'ResultDetectionCondition'),
    false
  )
})

// *** ResultDetectionCondition-ResultDetectionQuantitationLimit-above-below *** //
test('Should reject ResultDetectionCondition = Present Above Quantification Limit', async (t) => {
  const valid = validate({
    ResultDetectionCondition: 'Present Above Quantification Limit',
  })
  assert.equal(valid, false)
  assert.equal(
    checkProperty(
      validate.errors,
      'dependencies',
      'ResultDetectionQuantitationLimitType'
    ),
    true
  )
  assert.equal(
    checkProperty(
      validate.errors,
      'dependencies',
      'ResultDetectionQuantitationLimitMeasure'
    ),
    true
  )
  assert.equal(
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
    ResultDetectionCondition: 'Present Below Quantification Limit',
  })
  assert.equal(valid, false)
  assert.equal(
    checkProperty(
      validate.errors,
      'dependencies',
      'ResultDetectionQuantitationLimitType'
    ),
    true
  )
  assert.equal(
    checkProperty(
      validate.errors,
      'dependencies',
      'ResultDetectionQuantitationLimitMeasure'
    ),
    true
  )
  assert.equal(
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
    ResultDetectionQuantitationLimitUnit: 'mg/L',
  })
  assert.equal(valid, false)
  assert.equal(
    checkProperty(
      validate.errors,
      'dependencies',
      'ResultDetectionQuantitationLimitType'
    ),
    false
  )
  assert.equal(
    checkProperty(
      validate.errors,
      'dependencies',
      'ResultDetectionQuantitationLimitMeasure'
    ),
    false
  )
  assert.equal(
    checkProperty(
      validate.errors,
      'dependencies',
      'ResultDetectionQuantitationLimitUnit'
    ),
    false
  )
})

// *** ResultDetectionCondition-ResultDetectionQuantitationLimit-not-detect *** //
test('Should reject ResultDetectionCondition = Not Detected', async (t) => {
  const valid = validate({
    ResultDetectionCondition: 'Not Detected',
    ResultDetectionQuantitationLimitType: 'Sample Detection Limit',
    ResultDetectionQuantitationLimitMeasure: 0,
    ResultDetectionQuantitationLimitUnit: 'None',
  })
  assert.equal(valid, false)
  assert.equal(
    checkProperty(
      validate.errors,
      'false schema',
      'ResultDetectionQuantitationLimitType'
    ),
    true
  )
  assert.equal(
    checkProperty(
      validate.errors,
      'false schema',
      'ResultDetectionQuantitationLimitMeasure'
    ),
    true
  )
  assert.equal(
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
    ResultDetectionCondition: 'Not Detected',
  })
  assert.equal(valid, false)
  assert.equal(
    checkProperty(
      validate.errors,
      'enum',
      'ResultDetectionQuantitationLimitType'
    ),
    false
  )
  assert.equal(
    checkProperty(
      validate.errors,
      'enum',
      'ResultDetectionQuantitationLimitMeasure'
    ),
    false
  )
  assert.equal(
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
    ResultDetectionQuantitationLimitUnit: 'None',
  })
  assert.equal(valid, false)
  assert.equal(
    checkProperty(
      validate.errors,
      'false schema',
      'ResultDetectionQuantitationLimitType'
    ),
    true
  )
  assert.equal(
    checkProperty(
      validate.errors,
      'false schema',
      'ResultDetectionQuantitationLimitMeasure'
    ),
    true
  )
  assert.equal(
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
    ResultDetectionCondition: 'Detected Not Quantified',
  })
  assert.equal(valid, false)
  assert.equal(
    checkProperty(
      validate.errors,
      'enum',
      'ResultDetectionQuantitationLimitType'
    ),
    false
  )
  assert.equal(
    checkProperty(
      validate.errors,
      'enum',
      'ResultDetectionQuantitationLimitMeasure'
    ),
    false
  )
  assert.equal(
    checkProperty(
      validate.errors,
      'enum',
      'ResultDetectionQuantitationLimitUnit'
    ),
    false
  )
})

// *** CSVInjection *** //
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
    LaboratorySampleID: '\ttab',
  })
  assert.equal(valid, false)
  assert.equal(checkProperty(validate.errors, 'pattern', 'DatasetName'), true)
  assert.equal(
    checkProperty(validate.errors, 'pattern', 'MonitoringLocationID'),
    true
  )
  assert.equal(
    checkProperty(validate.errors, 'pattern', 'MonitoringLocationName'),
    true
  )
  assert.equal(checkProperty(validate.errors, 'pattern', 'ResultComment'), true)
  assert.equal(
    checkProperty(validate.errors, 'pattern', 'ResultAnalyticalMethodID'),
    true
  )
  assert.equal(
    checkProperty(validate.errors, 'pattern', 'ResultAnalyticalMethodName'),
    true
  )
  assert.equal(
    checkProperty(validate.errors, 'pattern', 'LaboratoryName'),
    true
  )
  assert.equal(
    checkProperty(validate.errors, 'pattern', 'LaboratorySampleID'),
    true
  )
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
    LaboratorySampleID: '*',
  })
  assert.equal(valid, false)
  // console.log(valid, JSON.stringify(validate.errors, null, 2))
  assert.equal(checkProperty(validate.errors, 'pattern', 'DatasetName'), false)
  assert.equal(
    checkProperty(validate.errors, 'pattern', 'MonitoringLocationID'),
    false
  )
  assert.equal(
    checkProperty(validate.errors, 'pattern', 'MonitoringLocationName'),
    false
  )
  assert.equal(
    checkProperty(validate.errors, 'pattern', 'ResultComment'),
    false
  )
  assert.equal(
    checkProperty(validate.errors, 'pattern', 'ResultAnalyticalMethodID'),
    false
  )
  assert.equal(
    checkProperty(validate.errors, 'pattern', 'ResultAnalyticalMethodName'),
    false
  )
  assert.equal(
    checkProperty(validate.errors, 'pattern', 'LaboratoryName'),
    false
  )
  assert.equal(
    checkProperty(validate.errors, 'pattern', 'LaboratorySampleID'),
    false
  )
})

// *** ResultUnit-Salinity *** //
test('Should accept when Salinity and expected unit', async (t) => {
  const valid = validate({
    CharacteristicName: 'Salinity',
    ResultValue: 0,
    ResultUnit: 'PSU',
  })
  assert.equal(valid, false)
  assert.equal(checkProperty(validate.errors, 'enum', 'ResultUnit'), false)
})
test('Should reject when Salinity and `ppt`', async (t) => {
  const valid = validate({
    CharacteristicName: 'Salinity',
    ResultUnit: 'ppt',
  })
  assert.equal(valid, false)
  assert.equal(checkProperty(validate.errors, 'enum', 'ResultUnit'), true)
})

// *** ResultDetectionQuantitationLimitUnit-Salinity *** //
test('Should accept when Salinity and expected ResultDetectionQuantitationLimitUnit', async (t) => {
  const valid = validate({
    CharacteristicName: 'Salinity',
    ResultDetectionQuantitationLimitMeasure: 0,
    ResultDetectionQuantitationLimitUnit: 'PSU',
  })
  assert.equal(valid, false)
  assert.equal(
    checkProperty(
      validate.errors,
      'enum',
      'ResultDetectionQuantitationLimitUnit'
    ),
    false
  )
})
test('Should reject when Salinity and ResultDetectionQuantitationLimitUnit=`ppt`', async (t) => {
  const valid = validate({
    CharacteristicName: 'Salinity',
    ResultDetectionQuantitationLimitMeasure: 0,
    ResultDetectionQuantitationLimitUnit: 'ppt',
  })
  assert.equal(valid, false)
  assert.equal(
    checkProperty(
      validate.errors,
      'enum',
      'ResultDetectionQuantitationLimitUnit'
    ),
    true
  )
})

// *** MonitoringLocationType-Well-WellUseType *** //
test('Should reject Well MonitoringLocationType without WellUseType', async (t) => {
  const valid = validate({
    ActivityMediaName: 'Groundwater',
    MonitoringLocationType: 'Well',
  })
  assert.equal(valid, false)
  assert.equal(checkProperty(validate.errors, 'required', 'WellUseType'), true)
})

test('Should reject Piezometer MonitoringLocationType without WellUseType', async (t) => {
  const valid = validate({
    ActivityMediaName: 'Groundwater',
    MonitoringLocationType: 'Piezometer',
  })
  assert.equal(valid, false)
  assert.equal(checkProperty(validate.errors, 'required', 'WellUseType'), true)
})

test('Should reject Dug Well MonitoringLocationType without WellUseType', async (t) => {
  const valid = validate({
    ActivityMediaName: 'Groundwater',
    MonitoringLocationType: 'Dug Well',
  })
  assert.equal(valid, false)
  assert.equal(checkProperty(validate.errors, 'required', 'WellUseType'), true)
})

test('Should accept Well MonitoringLocationType with WellUseType', async (t) => {
  const valid = validate({
    ActivityMediaName: 'Groundwater',
    MonitoringLocationType: 'Well',
    WellUseType: 'Monitoring - Ambient',
  })
  assert.equal(valid, false)
  assert.equal(checkProperty(validate.errors, 'required', 'WellUseType'), false)
})

test('Should accept non-well MonitoringLocationType without WellUseType', async (t) => {
  const valid = validate({
    ActivityMediaName: 'Surface Water',
    MonitoringLocationType: 'River/Stream',
  })
  assert.equal(valid, false)
  assert.equal(checkProperty(validate.errors, 'required', 'WellUseType'), false)
})

// *** MonitoringLocationType-Well-SampleCondition *** //
test('Should reject Well without SampleCondition for non-CTS', async (t) => {
  const valid = validate({
    ActivityMediaName: 'Groundwater',
    MonitoringLocationType: 'Well',
    ActivityType: 'Field Msr/Obs',
  })
  assert.equal(valid, false)
  assert.equal(
    checkProperty(validate.errors, 'required', 'SampleCondition'),
    true
  )
})

test('Should accept Well without SampleCondition for CTS', async (t) => {
  const valid = validate({
    ActivityMediaName: 'Groundwater',
    MonitoringLocationType: 'Well',
    ActivityType: 'Field Msr/Obs-Continuous Time Series',
    ActivityStartTime: '13:15:00',
  })
  assert.equal(valid, false)
  assert.equal(
    checkProperty(validate.errors, 'required', 'SampleCondition'),
    false
  )
})

test('Should accept Well with SampleCondition for non-CTS', async (t) => {
  const valid = validate({
    ActivityMediaName: 'Groundwater',
    MonitoringLocationType: 'Well',
    ActivityType: 'Field Msr/Obs',
    SampleCondition: 'Static',
  })
  assert.equal(valid, false)
  assert.equal(
    checkProperty(validate.errors, 'required', 'SampleCondition'),
    false
  )
})

// *** ActivityDepthHeightMeasure-ActivityDepthAltitudeReferencePoint *** //
test('Should reject ActivityDepthHeightMeasure without ActivityDepthAltitudeReferencePoint', async (t) => {
  const valid = validate({
    ActivityMediaName: 'Groundwater',
    ActivityDepthHeightMeasure: -5,
    ActivityDepthHeightUnit: 'm',
  })
  assert.equal(valid, false)
  assert.equal(
    checkProperty(
      validate.errors,
      'required',
      'ActivityDepthAltitudeReferencePoint'
    ),
    true
  )
})

test('Should accept ActivityDepthHeightMeasure with ActivityDepthAltitudeReferencePoint', async (t) => {
  const valid = validate({
    ActivityMediaName: 'Groundwater',
    ActivityDepthHeightMeasure: -5,
    ActivityDepthHeightUnit: 'm',
    ActivityDepthAltitudeReferencePoint: 'Ground surface',
  })
  assert.equal(valid, false)
  assert.equal(
    checkProperty(
      validate.errors,
      'required',
      'ActivityDepthAltitudeReferencePoint'
    ),
    false
  )
})

test('Should accept ActivityDepthHeightMeasure without ActivityDepthAltitudeReferencePoint for non-GW media', async (t) => {
  const valid = validate({
    ActivityMediaName: 'Surface Water',
    ActivityDepthHeightMeasure: -5,
    ActivityDepthHeightUnit: 'm',
  })
  assert.equal(valid, false)
  assert.equal(
    checkProperty(
      validate.errors,
      'required',
      'ActivityDepthAltitudeReferencePoint'
    ),
    false
  )
})

// *** CharacteristicName-WaterLevel-ActivityDepthAltitudeReferencePoint *** //
test('Should reject Water level CharacteristicName without ActivityDepthAltitudeReferencePoint', async (t) => {
  const valid = validate({
    ActivityMediaName: 'Groundwater',
    CharacteristicName: 'Water level in well, depth from a reference point',
    ResultValue: -10,
    ResultUnit: 'm',
  })
  assert.equal(valid, false)
  assert.equal(
    checkProperty(
      validate.errors,
      'required',
      'ActivityDepthAltitudeReferencePoint'
    ),
    true
  )
})

test('Should accept Water level CharacteristicName with ActivityDepthAltitudeReferencePoint', async (t) => {
  const valid = validate({
    ActivityMediaName: 'Groundwater',
    CharacteristicName: 'Water level in well, depth from a reference point',
    ResultValue: -10,
    ResultUnit: 'm',
    ActivityDepthAltitudeReferencePoint: 'Top of well casing',
  })
  assert.equal(valid, false)
  assert.equal(
    checkProperty(
      validate.errors,
      'required',
      'ActivityDepthAltitudeReferencePoint'
    ),
    false
  )
})

// *** CharacteristicName-Depth-ActivityDepthHeightMeasure *** //
test('Should reject ActivityDepthHeightMeasure when CharacteristicName measures depth', async (t) => {
  const valid = validate({
    ActivityMediaName: 'Surface Water',
    CharacteristicName: 'Depth of water column',
    ActivityDepthHeightMeasure: 5,
    ActivityDepthHeightUnit: 'm',
    ResultValue: 5,
    ResultUnit: 'm',
  })
  assert.equal(valid, false)
  assert.equal(
    checkProperty(
      validate.errors,
      'message',
      'error-CharacteristicName-Depth-ActivityDepthHeightMeasure'
    ),
    true
  )
})

test('Should reject ActivityDepthHeightUnit when CharacteristicName measures depth', async (t) => {
  const valid = validate({
    ActivityMediaName: 'Surface Water',
    CharacteristicName: 'Water level',
    ActivityDepthHeightUnit: 'm',
    ResultValue: 1.2,
    ResultUnit: 'm',
  })
  assert.equal(valid, false)
  assert.equal(
    checkProperty(
      validate.errors,
      'message',
      'error-CharacteristicName-Depth-ActivityDepthHeightMeasure'
    ),
    true
  )
})

test('Should accept depth CharacteristicName without ActivityDepthHeight fields', async (t) => {
  const valid = validate({
    ActivityMediaName: 'Surface Water',
    CharacteristicName: 'Depth of water column',
    ResultValue: 5,
    ResultUnit: 'm',
  })
  assert.equal(
    checkProperty(
      validate.errors,
      'message',
      'error-CharacteristicName-Depth-ActivityDepthHeightMeasure'
    ),
    false
  )
})

test('Should accept ActivityDepthHeightMeasure for a non-depth CharacteristicName', async (t) => {
  const valid = validate({
    ActivityMediaName: 'Surface Water',
    CharacteristicName: 'Temperature, water',
    ActivityDepthHeightMeasure: 5,
    ActivityDepthHeightUnit: 'm',
    ResultValue: 12.3,
    ResultUnit: 'deg C',
  })
  assert.equal(
    checkProperty(
      validate.errors,
      'message',
      'error-CharacteristicName-Depth-ActivityDepthHeightMeasure'
    ),
    false
  )
})

// *** ActivityMediaName-ActivityDepthHeightMeasure-Maximum *** //
test("Should reject ActivityDepthHeightMeasure > 0 for ActivityMediaName 'Surface Water'", async (t) => {
  const valid = validate({
    ActivityMediaName: 'Surface Water',
    CharacteristicName: 'Temperature, water',
    ActivityDepthHeightMeasure: 5,
    ActivityDepthHeightUnit: 'm',
    ResultValue: 12.3,
    ResultUnit: 'deg C',
  })
  assert.equal(valid, false)
  assert.equal(
    checkProperty(
      validate.errors,
      'message',
      'error-ActivityMediaName-ActivityDepthHeightMeasure-Maximum'
    ),
    true
  )
})

test("Should accept ActivityDepthHeightMeasure <= 0 for ActivityMediaName 'Surface Water'", async (t) => {
  const valid = validate({
    ActivityMediaName: 'Surface Water',
    CharacteristicName: 'Temperature, water',
    ActivityDepthHeightMeasure: -5,
    ActivityDepthHeightUnit: 'm',
    ResultValue: 12.3,
    ResultUnit: 'deg C',
  })
  assert.equal(
    checkProperty(
      validate.errors,
      'message',
      'error-ActivityMediaName-ActivityDepthHeightMeasure-Maximum'
    ),
    false
  )
})

test("Should accept ActivityMediaName 'Surface Water' without ActivityDepthHeightMeasure", async (t) => {
  const valid = validate({
    ActivityMediaName: 'Surface Water',
    CharacteristicName: 'Temperature, water',
    ResultValue: 12.3,
    ResultUnit: 'deg C',
  })
  assert.equal(
    checkProperty(
      validate.errors,
      'message',
      'error-ActivityMediaName-ActivityDepthHeightMeasure-Maximum'
    ),
    false
  )
})

test('Should not apply the ActivityDepthHeightMeasure maximum to Groundwater (covered by QC warning)', async (t) => {
  const valid = validate({
    ActivityMediaName: 'Groundwater',
    CharacteristicName: 'Temperature, water',
    ActivityDepthHeightMeasure: 5,
    ActivityDepthHeightUnit: 'm',
    ResultValue: 12.3,
    ResultUnit: 'deg C',
  })
  assert.equal(
    checkProperty(
      validate.errors,
      'message',
      'error-ActivityMediaName-ActivityDepthHeightMeasure-Maximum'
    ),
    false
  )
})

// *** ActivityMediaName-Groundwater-DepthMeasure *** //
test('Should reject Groundwater ActivityMediaName without any depth measure', async (t) => {
  const valid = validate({
    ActivityMediaName: 'Groundwater',
    MonitoringLocationType: 'Well',
    WellUseType: 'Domestic',
  })
  assert.equal(valid, false)
  assert.equal(
    checkProperty(validate.errors, 'required', 'BoreholeDepthMeasure'),
    true
  )
  assert.equal(
    checkProperty(validate.errors, 'required', 'WellDepthMeasure'),
    true
  )
  assert.equal(
    checkProperty(validate.errors, 'required', 'WellOpenIntervalTopMeasure'),
    true
  )
  assert.equal(
    checkProperty(validate.errors, 'required', 'WellOpenIntervalBottomMeasure'),
    true
  )
  assert.equal(
    checkProperty(validate.errors, 'required', 'ActivityDepthHeightMeasure'),
    true
  )
})

test('Should accept Groundwater ActivityMediaName with WellDepthMeasure', async (t) => {
  const valid = validate({
    ActivityMediaName: 'Groundwater',
    MonitoringLocationType: 'Well',
    WellUseType: 'Domestic',
    WellDepthMeasure: -10,
    WellDepthUnit: 'm',
  })
  assert.equal(valid, false)
  assert.equal(
    checkProperty(validate.errors, 'required', 'WellDepthMeasure'),
    false
  )
  assert.equal(
    checkProperty(validate.errors, 'required', 'BoreholeDepthMeasure'),
    false
  )
})

test('Should accept Groundwater ActivityMediaName with ActivityDepthHeightMeasure', async (t) => {
  const valid = validate({
    ActivityMediaName: 'Groundwater',
    MonitoringLocationType: 'Well',
    WellUseType: 'Domestic',
    ActivityDepthHeightMeasure: -5,
    ActivityDepthHeightUnit: 'm',
    ActivityDepthAltitudeReferencePoint: 'Ground surface',
  })
  assert.equal(valid, false)
  assert.equal(
    checkProperty(validate.errors, 'required', 'ActivityDepthHeightMeasure'),
    false
  )
  assert.equal(
    checkProperty(validate.errors, 'required', 'BoreholeDepthMeasure'),
    false
  )
})

test('Should accept non-GW ActivityMediaName without any depth measure', async (t) => {
  const valid = validate({
    ActivityMediaName: 'Surface Water',
    MonitoringLocationType: 'River/Stream',
  })
  assert.equal(valid, false)
  assert.equal(
    checkProperty(validate.errors, 'required', 'BoreholeDepthMeasure'),
    false
  )
  assert.equal(
    checkProperty(validate.errors, 'required', 'WellDepthMeasure'),
    false
  )
  assert.equal(
    checkProperty(validate.errors, 'required', 'ActivityDepthHeightMeasure'),
    false
  )
})

// *** GroundwaterFields-ActivityMediaName-Groundwater *** //
test('Should reject Surface Water with WellID (GW-only field)', async (t) => {
  const valid = validate({
    ActivityMediaName: 'Surface Water',
    MonitoringLocationType: 'River/Stream',
    WellID: 'well-123',
    WellIDContext: 'AB',
  })
  assert.equal(valid, false)
  assert.equal(
    checkProperty(
      validate.errors,
      'message',
      'error-GroundwaterFields-ActivityMediaName-Groundwater'
    ),
    true
  )
  assert.equal(
    checkProperty(validate.errors, 'enum', 'ActivityMediaName'),
    true
  )
  assert.equal(
    checkProperty(validate.errors, 'required', 'ActivityMediaName'),
    false
  )
})

test('Should reject Surface Water with AquiferCode (GW-only field)', async (t) => {
  const valid = validate({
    ActivityMediaName: 'Surface Water',
    MonitoringLocationType: 'River/Stream',
    AquiferCode: 'AQ-01',
  })
  assert.equal(valid, false)
  assert.equal(
    checkProperty(
      validate.errors,
      'message',
      'error-GroundwaterFields-ActivityMediaName-Groundwater'
    ),
    true
  )
  assert.equal(
    checkProperty(validate.errors, 'enum', 'ActivityMediaName'),
    true
  )
  assert.equal(
    checkProperty(validate.errors, 'required', 'ActivityMediaName'),
    false
  )
})

test('Should reject Surface Water with WellDepthMeasure (GW-only field)', async (t) => {
  const valid = validate({
    ActivityMediaName: 'Surface Water',
    MonitoringLocationType: 'River/Stream',
    WellDepthMeasure: -10,
    WellDepthUnit: 'm',
  })
  assert.equal(valid, false)
  assert.equal(
    checkProperty(
      validate.errors,
      'message',
      'error-GroundwaterFields-ActivityMediaName-Groundwater'
    ),
    true
  )
  assert.equal(
    checkProperty(validate.errors, 'enum', 'ActivityMediaName'),
    true
  )
  assert.equal(
    checkProperty(validate.errors, 'required', 'ActivityMediaName'),
    false
  )
})

test('Should reject GW field without ActivityMediaName at all', async (t) => {
  const valid = validate({
    MonitoringLocationType: 'Well',
    WellID: 'well-123',
    WellIDContext: 'AB',
  })
  assert.equal(valid, false)
  assert.equal(
    checkProperty(
      validate.errors,
      'message',
      'error-GroundwaterFields-ActivityMediaName-Groundwater'
    ),
    true
  )
  assert.equal(
    checkProperty(validate.errors, 'required', 'ActivityMediaName'),
    true
  )
  assert.equal(
    checkProperty(validate.errors, 'enum', 'ActivityMediaName'),
    false
  )
})

test('Should accept Groundwater with WellID and WellUseType (GW fields allowed)', async (t) => {
  const valid = validate({
    ActivityMediaName: 'Groundwater',
    MonitoringLocationType: 'Well',
    WellID: 'well-123',
    WellIDContext: 'AB',
    WellUseType: 'Domestic',
    WellDepthMeasure: -10,
    WellDepthUnit: 'm',
    SampleCondition: 'Static, before pumping or purging',
  })
  assert.equal(valid, false)
  assert.equal(
    checkProperty(
      validate.errors,
      'message',
      'error-GroundwaterFields-ActivityMediaName-Groundwater'
    ),
    false
  )
  assert.equal(
    checkProperty(validate.errors, 'enum', 'ActivityMediaName'),
    false
  )
  assert.equal(
    checkProperty(validate.errors, 'required', 'ActivityMediaName'),
    false
  )
})

test('Should accept Porewater with WellID and WellUseType (GW fields allowed)', async (t) => {
  const valid = validate({
    ActivityMediaName: 'Porewater',
    MonitoringLocationType: 'Well',
    WellID: 'well-123',
    WellIDContext: 'AB',
    WellUseType: 'Domestic',
    WellDepthMeasure: -10,
    WellDepthUnit: 'm',
    SampleCondition: 'Static, before pumping or purging',
  })
  assert.equal(valid, false)
  assert.equal(
    checkProperty(
      validate.errors,
      'message',
      'error-GroundwaterFields-ActivityMediaName-Groundwater'
    ),
    false
  )
  assert.equal(
    checkProperty(validate.errors, 'enum', 'ActivityMediaName'),
    false
  )
  assert.equal(
    checkProperty(validate.errors, 'required', 'ActivityMediaName'),
    false
  )
})

test('Should reject Surface Water with MonitoringLocationVerticalAccuracyMeasure (GW-only field)', async (t) => {
  const valid = validate({
    ActivityMediaName: 'Surface Water',
    MonitoringLocationType: 'River/Stream',
    MonitoringLocationVerticalAccuracyMeasure: 0.5,
    MonitoringLocationVerticalAccuracyUnit: 'm',
  })
  assert.equal(valid, false)
  assert.equal(
    checkProperty(
      validate.errors,
      'message',
      'error-GroundwaterFields-ActivityMediaName-Groundwater'
    ),
    true
  )
  assert.equal(
    checkProperty(validate.errors, 'enum', 'ActivityMediaName'),
    true
  )
  assert.equal(
    checkProperty(validate.errors, 'required', 'ActivityMediaName'),
    false
  )
})

test('Should reject Surface Water with SampleCollectionMethodID (GW-only field)', async (t) => {
  const valid = validate({
    ActivityMediaName: 'Surface Water',
    MonitoringLocationType: 'River/Stream',
    SampleCollectionMethodID: 'method-1',
    SampleCollectionMethodContext: 'USEPA',
    SampleCollectionMethodName: 'Test method',
  })
  assert.equal(valid, false)
  assert.equal(
    checkProperty(
      validate.errors,
      'message',
      'error-GroundwaterFields-ActivityMediaName-Groundwater'
    ),
    true
  )
  assert.equal(
    checkProperty(validate.errors, 'enum', 'ActivityMediaName'),
    true
  )
  assert.equal(
    checkProperty(validate.errors, 'required', 'ActivityMediaName'),
    false
  )
})

// *** one off *** //
/*test('one off', async (t) => {
  const valid = validate({
    DatasetName:
      'ACAP Humber Arm Freshwater Quality Monitoring: Newfoundland and Labrador',
    MonitoringLocationID: 'FWM-049',
    MonitoringLocationName: 'Seal Brook',
    MonitoringLocationLatitude: 47.70158,
    MonitoringLocationLongitude: -57.628167,
    MonitoringLocationHorizontalCoordinateReferenceSystem: 'WGS84',
    MonitoringLocationType: 'River/Stream',
    ActivityType: 'Field Msr/Obs-Portable Data Logger',
    ActivityMediaName: 'Surface Water',
    ActivityStartDate: '2021-05-26',
    ActivityStartTime: '14:01:00',
    SampleCollectionEquipmentName: 'Probe/Sensor',
    CharacteristicName: 'Salinity',
    ResultValue: 0.01,
    ResultUnit: 'ppt',
    ResultValueType: 'Actual'
  })
  console.log(validate.errors)
  console.log(validate.errors[0].params)
  assert.equal(valid, false)
  assert.equal(
    checkProperty(
      validate.errors,
      'enum',
      'ResultDetectionQuantitationLimitUnit'
    ),
    true
  )
})*/
