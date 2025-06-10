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
    } else if (keyword === 'pattern' && error.instancePath.includes(property)) return true
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

// *** ActivityMediaName-ActivityDepthHeightMeasure-Maximum *** //
test('Should reject ActivityDepthHeightMeasure > 0 when ActivityMediaName is set', async (t) => {
  const valid = validate({
    ActivityMediaName: 'Surface Water',
    ActivityDepthHeightMeasure: 1,
    ActivityDepthHeightUnit: 'm'
  })
  t.is(valid, false)
  t.is(
    checkProperty(validate.errors, 'maximum', 'ActivityDepthHeightMeasure'),
    true
  )
})
test('Should accept ActivityDepthHeightMeasure < 0 when ActivityMediaName is set', async (t) => {
  const valid = validate({
    ActivityMediaName: 'Surface Water',
    ActivityDepthHeightMeasure: -1,
    ActivityDepthHeightUnit: 'm'
  })
  t.is(valid, true)
})
test('Should accept ActivityDepthHeightMeasure = 0 when ActivityMediaName is set', async (t) => {
  const valid = validate({
    ActivityMediaName: 'Surface Water',
    ActivityDepthHeightMeasure: 0,
    ActivityDepthHeightUnit: 'm'
  })
  t.is(valid, true)
})
test('Should accept when ActivityDepthHeightMeasure is not set and when ActivityMediaName is set', async (t) => {
  const valid = validate({
    ActivityMediaName: 'Surface Water'
  })
  t.is(valid, true)
})

test('Should ignore ActivityDepthHeightMeasure > 0 when ActivityMediaName is other value', async (t) => {
  const valid = validate({
    ActivityMediaName: 'Ambient Air',
    ActivityDepthHeightMeasure: 1,
    ActivityDepthHeightUnit: 'm'
  })
  t.is(valid, true)
})

test('Should ignore ActivityDepthHeightMeasure > 0 when measure is not defined', async (t) => {
  const valid = validate({
    ActivityMediaName: 'Surface Water',
    ActivityDepthHeightUnit: 'm'
  })
  t.is(valid, true)
  t.is(
    checkProperty(validate.errors, 'maximum', 'ActivityDepthHeightMeasure'),
    false
  )
})
test('Should ignore ActivityDepthHeightMeasure > 0 when measure is a string', async (t) => {
  const valid = validate({
    ActivityMediaName: 'Surface Water',
    ActivityDepthHeightMeasure: 'unknown',
    ActivityDepthHeightUnit: 'm'
  })
  t.is(valid, false)
  t.is(
    checkProperty(validate.errors, 'maximum', 'ActivityDepthHeightMeasure'),
    false
  )
})

// ActivityType-CTS-ActivityStartTimeZone
test("Should accept ActivityType without ActivityStartTimeZone for non-CTS", async (t) => {
  const valid = validate({
    ActivityType: "Field Msr/Obs",
  });
  t.true(valid);
  t.is(checkProperty(validate.errors, "required", "ActivityType"), false);
  t.is(checkProperty(validate.errors, "required", "ActivityStartTimeZone"), false);
});

test("Should accept ActivityType with ActivityStartTimeZone for non-CTS", async (t) => {
  const valid = validate({
    ActivityType: "Field Msr/Obs",
    ActivityStartTime: '13:15:00',
    ActivityStartTimeZone: '-03:00',
  });
  t.true(valid);
  t.is(checkProperty(validate.errors, "required", "ActivityType"), false);
  t.is(checkProperty(validate.errors, "required", "ActivityStartTimeZone"), false);
});

test("Should reject ActivityType without ActivityStartTimeZone for CTS", async (t) => {
  const valid = validate({
    ActivityType: "Field Msr/Obs-Continuous Time Series",
    ActivityStartDate: '2025-01-01',
    ActivityStartTime: '13:15:00'
  });
  t.false(valid);
  t.is(checkProperty(validate.errors, "required", "ActivityStartTimeZone"), true);
});

test("Should accept ActivityType with ActivityStartTimeZone for CTS", async (t) => {
  const valid = validate({
    ActivityType: "Field Msr/Obs-Continuous Time Series",
    ActivityStartTime: '13:15:00',
    ActivityStartTimeZone: '-06:00',
  });
  t.true(valid);
  t.is(checkProperty(validate.errors, "required", "ActivityType"), false);
  t.is(checkProperty(validate.errors, "required", "ActivityStartTimeZone"), false);
});

// ActivityType-CTS-ActivityStartTimeZone-UTC
test("Should accept ActivityType with UTC ActivityStartTimeZone for non-CTS", async (t) => {
  const valid = validate({
    ActivityType: "Field Msr/Obs",
    ActivityStartTime: '13:15:00',
    ActivityStartTimeZone: '+00:00',
  });
  t.true(valid);
  t.is(checkProperty(validate.errors, "required", "ActivityType"), false);
  t.is(checkProperty(validate.errors, "required", "ActivityStartTimeZone"), false);
});

test("Should accept ActivityType-CTS-ActivityStartTimeZone-UTC without ActivityStartTimeZone", async (t) => {
  const valid = validate({
    ActivityType: "Field Msr/Obs-Continuous Time Series",
    ActivityStartDate: '2025-01-01'
  });
  t.false(valid)
  t.is(checkProperty(validate.errors, "message", "qc-ActivityType-CTS-ActivityStartTimeZone-UTC"), false);
});

test("Should reject ActivityType with UTC ActivityStartTimeZone for CTS", async (t) => {
  const valid = validate({
    ActivityType: "Field Msr/Obs-Continuous Time Series",
    ActivityStartTime: '13:15:00',
    ActivityStartTimeZone: '+00:00',
  });
  t.false(valid);
  t.is(checkProperty(validate.errors, "not", "ActivityStartTimeZone"), true);
});

// *** ActivityType-ResultSampleFraction *** //
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

// *** CharacteristicName-ActivityMediaName-AmbientAir *** //
test('Should accept CharacteristicName-ActivityMediaName-AmbientAir', async (t) => {
  const valid = validate({
    CharacteristicName: 'Temperature, air',
    ActivityMediaName: 'Ambient Air'
  })
  t.is(valid, true)
})
test('Should reject CharacteristicName-ActivityMediaName-AmbientAir', async (t) => {
  const valid = validate({
    CharacteristicName: 'Temperature, air',
    ActivityMediaName: 'Stormwater'
  })
  t.is(valid, false)
  t.is(checkProperty(validate.errors, 'enum', 'ActivityMediaName'), true)
})

// *** CharacteristicName-ActivityType-Surrogate *** //
test('Should accept CharacteristicName-ActivityType-Surrogate & ResultUnit', async (t) => {
  const valid = validate({
    CharacteristicName: '2-Methylnaphthalene-D10',
    ResultValue: '10',
    ResultUnit: "%",
    ActivityType: 'Quality Control Sample-Lab Surrogate Control Standard'
  })
  t.is(valid, true)
})
test('Should reject CharacteristicName-ActivityType-Surrogate & ResultUnit', async (t) => {
  const valid = validate({
    CharacteristicName: '2-Methylnaphthalene-D10',
    ResultValue: '10',
    ResultUnit: "%",
    ActivityType: 'Field Msr/Obs-Portable Data Logger'
  })
  t.is(valid, false)
  t.is(checkProperty(validate.errors, 'enum', 'ActivityType'), true)
})

test('Should accept CharacteristicName-ActivityType-Surrogate & ResultDetectionQuantitationLimitUnit', async (t) => {
  const valid = validate({
    CharacteristicName: 'Indeno[1,2,3-cd]pyrene-d12',
    ResultDetectionQuantitationLimitMeasure: '10',
    ResultDetectionQuantitationLimitUnit: "%",
    ActivityType: 'Quality Control Sample-Lab Surrogate Control Standard Duplicate'
  })
  t.is(valid, true)
})
test('Should reject CharacteristicName-ActivityType-Surrogate & ResultDetectionQuantitationLimitUnit', async (t) => {
  const valid = validate({
    CharacteristicName: 'Indeno[1,2,3-cd]pyrene-d12',
    ResultDetectionQuantitationLimitMeasure: '10',
    ResultDetectionQuantitationLimitUnit: "%",
    ActivityType: 'Quality Control Sample-Lab Surrogate Method Blank'
  })
  t.is(valid, false)
  t.is(checkProperty(validate.errors, 'enum', 'ActivityType'), true)
})

// *** CharacteristicName-Ammonia *** //
test('Should accept CharacteristicName Ammonia, un-ionized', async (t) => {
  const valid = validate({
    CharacteristicName: 'Ammonia, un-ionized'
  })
  t.is(valid, true)
})

test('Should reject CharacteristicName-Ammonia', async (t) => {
  const valid = validate({
    CharacteristicName: 'Ammonia'
  })
  t.is(valid, false)
  t.is(checkProperty(validate.errors, 'not', 'CharacteristicName'), true)
  t.is(checkProperty(validate.errors, 'message', 'qc-CharacteristicName-Ammonia'), true)
})

// *** CharacteristicName-Metal-ResultSampleFraction *** //
test('Should accept CharacteristicName-Metal-ResultSampleFraction', async (t) => {
  const valid = validate({
    CharacteristicName: 'Iron',
    ResultSampleFraction: 'Total'
  })
  t.is(valid, true)
})

test('Should accept CharacteristicName-Metal-ResultSampleFraction when undefined', async (t) => {
  const valid = validate({
    CharacteristicName: 'Europium',
    ResultSampleFraction: undefined
  })
  t.is(valid, true)
})

test('Should reject CharacteristicName-Metal-ResultSampleFraction', async (t) => {
  const valid = validate({
    CharacteristicName: 'Iron',
    ResultSampleFraction: 'Total Recoverable'
  })
  t.is(valid, false)
  t.is(checkProperty(validate.errors, 'not', 'ResultSampleFraction'), true)
})

// *** CharacteristicName-MethodSpeciation *** //
test('Should accept CharacteristicName-MethodSpeciation when its not expected', async (t) => {
  const valid = validate({
    CharacteristicName: 'Ammonia and ammonium',
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
  t.is(checkProperty(validate.errors, 'false schema', 'MethodSpeciation'), true)
})
test('Should accept MethodSpeciation when its expected', async (t) => {
  const valid = validate({
    CharacteristicName: 'pH'
  })
  t.is(valid, true)
})
test('Should accept MethodSpeciation when its not expected', async (t) => {
  const valid = validate({
    CharacteristicName: 'Ammonia and ammonium'
  })
  t.is(valid, true)
})

// *** CharacteristicName-pH-ActivityType-Sample *** //
test("Should accept CharacteristicName-pH,lab with ActivityType-Sample", async (t) => {
  const valid = validate({
    CharacteristicName: "pH, lab",
    ActivityType: "Sample-Routine",
    LaboratoryName: "A",
    ResultAnalyticalMethodName: "Unspecified"
  })
  t.true(valid);
  t.is(checkProperty(validate.errors, "required", "CharacteristicName"), false);
  t.is(checkProperty(validate.errors, "required", "ActivityType"), false);
  t.is(checkProperty(validate.errors, "not", "ActivityType"), false);
});

test("Should reject CharacteristicName-pH with ActivityType-Sample", async (t) => {
  const valid = validate({
    CharacteristicName: "pH",
    ActivityType: "Sample-Routine",
    LaboratoryName: "A",
    ResultAnalyticalMethodName: "Unspecified"
  })
  t.false(valid);
  t.is(checkProperty(validate.errors, "not", "ActivityType"), true);
  t.is(checkProperty(validate.errors, "message", "qc-CharacteristicName-pH-ActivityType-Sample"), true);
});

test("Should reject CharacteristicName-pH with ActivityType-Quality Control Sample", async (t) => {
  const valid = validate({
    CharacteristicName: "pH",
    ActivityType: "Quality Control Sample-Other",
    LaboratoryName: "A",
    ResultAnalyticalMethodName: "Unspecified"
  })
  t.false(valid);
  t.is(checkProperty(validate.errors, "not", "ActivityType"), true);
  t.is(checkProperty(validate.errors, "message", "qc-CharacteristicName-pH-ActivityType-Sample"), true);
});

// *** CharacteristicName-Metal-ResultAnalyticalMethodName *** //
test('Should accept CharacteristicName-ResultAnalyticalMethodName', async (t) => {
  const valid = validate({
    CharacteristicName: 'Ammonia and ammonium',
    ResultAnalyticalMethodName: 'Test Method Name'
  })
  t.is(valid, true)
})
test('Should reject CharacteristicName-ResultAnalyticalMethodName when empty', async (t) => {
  const valid = validate({
    CharacteristicName: 'Day, ice off',
    ResultAnalyticalMethodName: undefined
  })
  t.is(valid, false)
  t.is(checkProperty(validate.errors, 'required', 'ResultAnalyticalMethodName'), true)
})

// MonitoringLocationDepthHeightMeasure - TODO future?

// *** MonitoringLocationCoordinate-BoundingBox *** //
test('Should accept MonitoringLocationLatitude/Longitude when its within bounds', async (t) => {
  const valid = validate({
    MonitoringLocationLatitude: 51,
    MonitoringLocationLongitude: -114
  })
  t.is(valid, true)
})

test('Should reject MonitoringLocationLatitude when its out of bounds', async (t) => {
  const valid = validate({
    MonitoringLocationLatitude: 35,
    MonitoringLocationLongitude: -114
  })
  t.is(valid, false)
  t.is(
    checkProperty(validate.errors, 'minimum', 'MonitoringLocationLatitude'),
    true
  )
})

test('Should reject MonitoringLocationLongitude when its out of bounds', async (t) => {
  const valid = validate({
    MonitoringLocationLatitude: 51,
    MonitoringLocationLongitude: -45
  })
  t.is(valid, false)
  t.is(
    checkProperty(validate.errors, 'minimum', 'MonitoringLocationLongitude'),
    true
  )
})

// *** ResultAnalyticalMethodContext-YSI-ActivityType *** //
test('Should reject ActivityType when ResultAnalyticalMethodContext is YSI', async (t) => {
  const valid = validate({
    ResultAnalyticalMethodContext: 'YSI',
    ActivityType: 'Sample-Routine'
  })
  t.is(valid, false)
  t.is(checkProperty(validate.errors, 'enum', 'ActivityType'), true)
})
test('Should accept ActivityType when ResultAnalyticalMethodContext is YSI', async (t) => {
  const valid = validate({
    ResultAnalyticalMethodContext: 'YSI',
    ActivityType: 'Field Msr/Obs-Portable Data Logger'
  })
  t.is(valid, true)
})
test('Should ignore ActivityType when ResultAnalyticalMethodContext is not YSI', async (t) => {
  const valid = validate({
    ResultAnalyticalMethodContext: 'ANY'
  })
  t.is(valid, true)
  // t.is(
  //   checkProperty(
  //     validate.errors,
  //     'minimum',
  //     'ResultDetectionQuantitationLimitMeasure'
  //   ),
  //   false
  // )
})

// *** ResultDetectionQuantitationLimitMeasure-Minimum *** //
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

// *** ResultDetectionQuantitationLimitUnit-None *** //
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

// *** ResultDetectionQuantitationLimitUnit-NoValue *** //
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
      'false schema',
      'ResultDetectionQuantitationLimitUnit'
    ),
    true
  )
})

// *** ResultSampleFraction-ActivityMediaName-Sediment *** //
test('Should accept ResultSampleFraction-ActivityMediaName-Sediment', async (t) => {
  const valid = validate({
    ActivityMediaName: 'Subsurface Soil/Sediment',
    ResultSampleFraction: 'Extractable, other'
  })
  t.is(valid, true)
})

test('Should reject ResultSampleFraction-ActivityMediaName-Sediment', async (t) => {
  const valid = validate({
    ActivityMediaName: 'Stormwater',
    ResultSampleFraction: 'Extractable, other'
  })
  t.is(valid, false)
  t.is(checkProperty(validate.errors, 'enum', 'ActivityMediaName'), true)
})

// *** ResultUnit-Elevation *** //
/*test('Should reject Water level in m', async (t) => {
  const valid = validate({
    CharacteristicName: 'Water level',
    ResultValue: 1800,
    ResultUnit: 'm'
  })
  t.is(valid, false)
  t.is(checkProperty(validate.errors, 'enum', 'ResultUnit'), true)
})
test('Should accept Water level in MASL', async (t) => {
  const valid = validate({
    CharacteristicName: 'Water level',
    ResultValue: 1800,
    ResultUnit: 'MASL'
  })
  t.is(valid, true)
})*/

// *** ResultUnit-Percent *** //
test('Should reject Taxonomic Richness... in None', async (t) => {
  const valid = validate({
    CharacteristicName:
      'Taxonomic Richness, Ephemeroptera, Plecoptera, Tricoptera',
    ResultValue: 100,
    ResultUnit: 'None'
  })
  t.is(valid, false)
  t.is(checkProperty(validate.errors, 'enum', 'ResultUnit'), true)
})
test('Should acceptTaxonomic Richness... in %', async (t) => {
  const valid = validate({
    CharacteristicName:
      'Taxonomic Richness, Ephemeroptera, Plecoptera, Tricoptera',
    ResultValue: 100,
    ResultUnit: '%'
  })
  t.is(valid, true)
})

// *** ResultUnit-None *** //
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

// *** ResultUnit-NoValue *** //
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
  t.is(checkProperty(validate.errors, 'false schema', 'ResultUnit'), true)
})

// *** ResultValue-DepthMaximum *** //
/*test('Should reject Depth at 1 m', async (t) => {
  const valid = validate({
    CharacteristicName: 'Depth',
    ResultValue: 1,
    ResultUnit: 'm'
  })
  t.is(valid, false)
  t.is(checkProperty(validate.errors, 'maximum', 'ResultValue'), true)
})
test('Should accept Depth at -1 ft', async (t) => {
  const valid = validate({
    CharacteristicName: 'Depth',
    ResultValue: -1,
    ResultUnit: 'ft'
  })
  t.is(valid, true)
})*/

// *** ResultValue-DissolvedOxygenUnit *** //
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

// *** ResultValue-DOSatMinimum *** //
test('Should reject Dissolved oxygen saturation when measure is below 0', async (t) => {
  const valid = validate({
    CharacteristicName: 'Dissolved oxygen saturation',
    ResultValue: -1,
    ResultUnit: 'mg/l'
  })
  t.is(valid, false)
  t.is(checkProperty(validate.errors, 'minimum', 'ResultValue'), true)
})
test('Should accept Dissolved oxygen saturation when measure is above 0', async (t) => {
  const valid = validate({
    CharacteristicName: 'Dissolved oxygen saturation',
    ResultValue: 1,
    ResultUnit: 'mg/l'
  })
  t.is(valid, true)
})

// *** ResultValue-Minimum *** //
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
test('Should ignore Result when measure is a string', async (t) => {
  const valid = validate({
    ResultValue: 'unknown',
    ResultUnit: '#/100ml'
  })
  t.is(valid, false)
  t.is(checkProperty(validate.errors, 'minimum', 'ResultValue'), false)
})

// *** ResultValue-pH-Range *** //
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
test('Should ignore pH range check when measure is not defined', async (t) => {
  const valid = validate({
    CharacteristicName: 'pH',
    ResultUnit: 'None'
  })
  t.is(valid, false) // due to another QC
  t.is(checkProperty(validate.errors, 'minimum', 'ResultValue'), false)
  t.is(checkProperty(validate.errors, 'maximum', 'ResultValue'), false)
})

test('Should ignore pH range check when measure is a string', async (t) => {
  const valid = validate({
    CharacteristicName: 'pH',
    ResultValue: 'Unknown',
    ResultUnit: 'None'
  })
  t.is(valid, false)
  t.is(checkProperty(validate.errors, 'minimum', 'ResultValue'), false)
  t.is(checkProperty(validate.errors, 'maximum', 'ResultValue'), false)
})

// *** ResultValue-Temperature-Range *** //
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
test('Should ignore Temperature range check when measure is not defined', async (t) => {
  const valid = validate({
    CharacteristicName: 'Temperature, water',
    ResultUnit: 'deg C'
  })
  t.is(valid, false) // due to another QC
  t.is(checkProperty(validate.errors, 'minimum', 'ResultValue'), false)
  t.is(checkProperty(validate.errors, 'maximum', 'ResultValue'), false)
})
test('Should ignore Temperature range check when measure is a string', async (t) => {
  const valid = validate({
    CharacteristicName: 'Temperature, water',
    ResultValue: 'Unknown',
    ResultUnit: 'deg C'
  })
  t.is(valid, false)
  t.is(checkProperty(validate.errors, 'minimum', 'ResultValue'), false)
  t.is(checkProperty(validate.errors, 'maximum', 'ResultValue'), false)
})

// *** ResultValue-DOY-Range *** //
test('Should reject DOY below range (1-366)', async (t) => {
  const valid = validate({
    ResultUnit: 'DOY',
    ResultValue: 0
  })
  t.is(valid, false)
  t.is(checkProperty(validate.errors, 'minimum', 'ResultValue'), true)
})
test('Should reject DOY above range (1-366)', async (t) => {
  const valid = validate({
    ResultUnit: 'DOY',
    ResultValue: 367
  })
  t.is(valid, false)
  t.is(checkProperty(validate.errors, 'maximum', 'ResultValue'), true)
})
test('Should accept DOY within range (1-366)', async (t) => {
  const valid = validate({
    ResultUnit: 'DOY',
    ResultValue: 300
  })
  t.is(valid, true)
})
test('Should ignore DOY range check when measure is not defined', async (t) => {
  const valid = validate({
    ResultUnit: 'DOY'
  })
  t.is(valid, false) // due to another QC
  t.is(checkProperty(validate.errors, 'minimum', 'ResultValue'), false)
  t.is(checkProperty(validate.errors, 'maximum', 'ResultValue'), false)
})
test('Should ignore DOY range check when measure is a string', async (t) => {
  const valid = validate({
    ResultValue: 'Unknown',
    ResultUnit: 'DOY'
  })
  t.is(valid, false)
  t.is(checkProperty(validate.errors, 'minimum', 'ResultValue'), false)
  t.is(checkProperty(validate.errors, 'maximum', 'ResultValue'), false)
})

// *** WhiteSpace *** //
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
    LaboratorySampleID: 'A'
  })
  t.is(valid, true)
})
