import { test } from "node:test";
import assert from "node:assert/strict";
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
  assert.equal(valid, true)
})

test('Should accept with undefined values', async (t) => {
  const obj = {}
  for (const key in defaultObject) {
    obj[key] = undefined
  }
  const valid = validate(obj)
  assert.equal(valid, true)
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
//   assert.equal(valid, true)
//
// })

test('Should reject improperly formatted time', async (t) => {
  const valid = validate({
    ActivityStartDate: '2020-01-01',
    ActivityStartTime: '9:30:00'
  })
  assert.equal(valid, false)
  assert.equal(checkProperty(validate.errors, 'pattern', 'ActivityStartTime'), true)
})

// *** ActivityMediaName-ActivityDepthHeightMeasure-Maximum *** //
test('Should reject ActivityDepthHeightMeasure > 0 when ActivityMediaName is set', async (t) => {
  const valid = validate({
    ActivityMediaName: 'Surface Water',
    ActivityDepthHeightMeasure: 1,
    ActivityDepthHeightUnit: 'm'
  })
  assert.equal(valid, false)
  assert.equal(
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
  assert.equal(valid, true)
})
test('Should accept ActivityDepthHeightMeasure = 0 when ActivityMediaName is set', async (t) => {
  const valid = validate({
    ActivityMediaName: 'Surface Water',
    ActivityDepthHeightMeasure: 0,
    ActivityDepthHeightUnit: 'm'
  })
  assert.equal(valid, true)
})
test('Should accept when ActivityDepthHeightMeasure is not set and when ActivityMediaName is set', async (t) => {
  const valid = validate({
    ActivityMediaName: 'Surface Water'
  })
  assert.equal(valid, true)
})
test('Should reject ActivityDepthHeightMeasure > 0 when ActivityMediaName is Groundwater', async (t) => {
  const valid = validate({
    ActivityMediaName: 'Groundwater',
    ActivityDepthHeightMeasure: 1,
    ActivityDepthHeightUnit: 'm'
  })
  assert.equal(valid, false)
  assert.equal(
    checkProperty(validate.errors, 'maximum', 'ActivityDepthHeightMeasure'),
    true
  )
})
test('Should accept ActivityDepthHeightMeasure < 0 when ActivityMediaName is Groundwater', async (t) => {
  const valid = validate({
    ActivityMediaName: 'Groundwater',
    ActivityDepthHeightMeasure: -1,
    ActivityDepthHeightUnit: 'm'
  })
  assert.equal(valid, true)
})

test('Should ignore ActivityDepthHeightMeasure > 0 when ActivityMediaName is other value', async (t) => {
  const valid = validate({
    ActivityMediaName: 'Ambient Air',
    ActivityDepthHeightMeasure: 1,
    ActivityDepthHeightUnit: 'm'
  })
  assert.equal(valid, true)
})

test('Should ignore ActivityDepthHeightMeasure > 0 when measure is not defined', async (t) => {
  const valid = validate({
    ActivityMediaName: 'Surface Water',
    ActivityDepthHeightUnit: 'm'
  })
  assert.equal(valid, true)
  assert.equal(
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
  assert.equal(valid, false)
  assert.equal(
    checkProperty(validate.errors, 'maximum', 'ActivityDepthHeightMeasure'),
    false
  )
})

// ActivityType-CTS-ActivityStartTimeZone
test("Should accept ActivityType without ActivityStartTimeZone for non-CTS", async (t) => {
  const valid = validate({
    ActivityType: "Field Msr/Obs",
  });
  assert.equal(valid, true);
  assert.equal(checkProperty(validate.errors, "required", "ActivityType"), false);
  assert.equal(checkProperty(validate.errors, "required", "ActivityStartTimeZone"), false);
});

test("Should accept ActivityType with ActivityStartTimeZone for non-CTS", async (t) => {
  const valid = validate({
    ActivityType: "Field Msr/Obs",
    ActivityStartTime: '13:15:00',
    ActivityStartTimeZone: '-03:00',
  });
  assert.equal(valid, true);
  assert.equal(checkProperty(validate.errors, "required", "ActivityType"), false);
  assert.equal(checkProperty(validate.errors, "required", "ActivityStartTimeZone"), false);
});

test("Should reject ActivityType without ActivityStartTimeZone for CTS", async (t) => {
  const valid = validate({
    ActivityType: "Field Msr/Obs-Continuous Time Series",
    ActivityStartDate: '2025-01-01',
    ActivityStartTime: '13:15:00'
  });
  assert.equal(valid, false);
  assert.equal(checkProperty(validate.errors, "required", "ActivityStartTimeZone"), true);
});

test("Should accept ActivityType with ActivityStartTimeZone for CTS", async (t) => {
  const valid = validate({
    ActivityType: "Field Msr/Obs-Continuous Time Series",
    ActivityStartTime: '13:15:00',
    ActivityStartTimeZone: '-06:00',
  });
  assert.equal(valid, true);
  assert.equal(checkProperty(validate.errors, "required", "ActivityType"), false);
  assert.equal(checkProperty(validate.errors, "required", "ActivityStartTimeZone"), false);
});

// ActivityType-CTS-ActivityStartTimeZone-UTC
test("Should accept ActivityType with UTC ActivityStartTimeZone for non-CTS", async (t) => {
  const valid = validate({
    ActivityType: "Field Msr/Obs",
    ActivityStartTime: '13:15:00',
    ActivityStartTimeZone: '+00:00',
  });
  assert.equal(valid, true);
  assert.equal(checkProperty(validate.errors, "required", "ActivityType"), false);
  assert.equal(checkProperty(validate.errors, "required", "ActivityStartTimeZone"), false);
});

test("Should accept ActivityType-CTS-ActivityStartTimeZone-UTC without ActivityStartTimeZone", async (t) => {
  const valid = validate({
    ActivityType: "Field Msr/Obs-Continuous Time Series",
    ActivityStartDate: '2025-01-01'
  });
  assert.equal(valid, false)
  assert.equal(checkProperty(validate.errors, "message", "qc-ActivityType-CTS-ActivityStartTimeZone-UTC"), false);
});

test("Should reject ActivityType with UTC ActivityStartTimeZone for CTS", async (t) => {
  const valid = validate({
    ActivityType: "Field Msr/Obs-Continuous Time Series",
    ActivityStartTime: '13:15:00',
    ActivityStartTimeZone: '+00:00',
  });
  assert.equal(valid, false);
  assert.equal(checkProperty(validate.errors, "not", "ActivityStartTimeZone"), true);
});

// *** ActivityType-ResultSampleFraction *** //
test('Should reject ResultSampleFraction when ActivityType is set to field', async (t) => {
  const valid = validate({
    ActivityType: 'Field Msr/Obs',
    CharacteristicName: 'Temperature, water',
    ResultSampleFraction: 'Filtered'
  })
  assert.equal(valid, false)
  assert.equal(
    checkProperty(validate.errors, 'false schema', 'ResultSampleFraction'),
    true
  )
})

test('Should accept ResultSampleFraction when ActivityType is set to field and CharacteristicName is in required list', async (t) => {
  const valid = validate({
    ActivityType: 'Field Msr/Obs',
    CharacteristicName: 'Ammonia, un-ionized',
    ResultSampleFraction: 'Filtered'
  })
  assert.equal(valid, true)
})

test('Should accept empty ResultSampleFraction when ActivityType is set to field', async (t) => {
  const valid = validate({
    ActivityType: 'Field Msr/Obs',
    CharacteristicName: 'Temperature, water'
  })
  assert.equal(valid, true)
})

// *** CharacteristicName-ActivityMediaName-AmbientAir *** //
test('Should accept CharacteristicName-ActivityMediaName-AmbientAir', async (t) => {
  const valid = validate({
    CharacteristicName: 'Temperature, air',
    ActivityMediaName: 'Ambient Air'
  })
  assert.equal(valid, true)
})
test('Should reject CharacteristicName-ActivityMediaName-AmbientAir', async (t) => {
  const valid = validate({
    CharacteristicName: 'Temperature, air',
    ActivityMediaName: 'Stormwater'
  })
  assert.equal(valid, false)
  assert.equal(checkProperty(validate.errors, 'enum', 'ActivityMediaName'), true)
})

// *** CharacteristicName-ActivityType-Surrogate *** //
test('Should accept CharacteristicName-ActivityType-Surrogate & ResultUnit', async (t) => {
  const valid = validate({
    CharacteristicName: '2-Methylnaphthalene-D10',
    ResultValue: '10',
    ResultUnit: "%",
    ActivityType: 'Quality Control Sample-Lab Surrogate Control Standard'
  })
  assert.equal(valid, true)
})
test('Should reject CharacteristicName-ActivityType-Surrogate & ResultUnit', async (t) => {
  const valid = validate({
    CharacteristicName: '2-Methylnaphthalene-D10',
    ResultValue: '10',
    ResultUnit: "%",
    ActivityType: 'Field Msr/Obs-Portable Data Logger'
  })
  assert.equal(valid, false)
  assert.equal(checkProperty(validate.errors, 'enum', 'ActivityType'), true)
})

test('Should accept CharacteristicName-ActivityType-Surrogate & ResultDetectionQuantitationLimitUnit', async (t) => {
  const valid = validate({
    CharacteristicName: 'Indeno[1,2,3-cd]pyrene-d12',
    ResultDetectionQuantitationLimitMeasure: '10',
    ResultDetectionQuantitationLimitUnit: "%",
    ActivityType: 'Quality Control Sample-Lab Surrogate Control Standard Duplicate'
  })
  assert.equal(valid, true)
})
test('Should reject CharacteristicName-ActivityType-Surrogate & ResultDetectionQuantitationLimitUnit', async (t) => {
  const valid = validate({
    CharacteristicName: 'Indeno[1,2,3-cd]pyrene-d12',
    ResultDetectionQuantitationLimitMeasure: '10',
    ResultDetectionQuantitationLimitUnit: "%",
    ActivityType: 'Quality Control Sample-Lab Surrogate Method Blank'
  })
  assert.equal(valid, false)
  assert.equal(checkProperty(validate.errors, 'enum', 'ActivityType'), true)
})

// *** CharacteristicName-Ammonia *** //
test('Should accept CharacteristicName Ammonia, un-ionized', async (t) => {
  const valid = validate({
    CharacteristicName: 'Ammonia, un-ionized'
  })
  assert.equal(valid, true)
})

test('Should reject CharacteristicName-Ammonia', async (t) => {
  const valid = validate({
    CharacteristicName: 'Ammonia'
  })
  assert.equal(valid, false)
  assert.equal(checkProperty(validate.errors, 'not', 'CharacteristicName'), true)
  assert.equal(checkProperty(validate.errors, 'message', 'qc-CharacteristicName-Ammonia'), true)
})

// *** CharacteristicName-Metal-ResultSampleFraction *** //
test('Should accept CharacteristicName-Metal-ResultSampleFraction', async (t) => {
  const valid = validate({
    CharacteristicName: 'Iron',
    ResultSampleFraction: 'Total'
  })
  assert.equal(valid, true)
})

test('Should accept CharacteristicName-Metal-ResultSampleFraction when undefined', async (t) => {
  const valid = validate({
    CharacteristicName: 'Europium',
    ResultSampleFraction: undefined
  })
  assert.equal(valid, true)
})

test('Should reject CharacteristicName-Metal-ResultSampleFraction', async (t) => {
  const valid = validate({
    CharacteristicName: 'Iron',
    ResultSampleFraction: 'Total Recoverable'
  })
  assert.equal(valid, false)
  assert.equal(checkProperty(validate.errors, 'not', 'ResultSampleFraction'), true)
})

// *** CharacteristicName-MethodSpeciation *** //
test('Should accept CharacteristicName-MethodSpeciation when its not expected', async (t) => {
  const valid = validate({
    CharacteristicName: 'Ammonia and ammonium',
    MethodSpeciation: 'as N'
  })
  assert.equal(valid, true)
})
test('Should reject MethodSpeciation when its not expected', async (t) => {
  const valid = validate({
    CharacteristicName: 'pH',
    MethodSpeciation: 'as N'
  })
  assert.equal(valid, false)
  assert.equal(checkProperty(validate.errors, 'false schema', 'MethodSpeciation'), true)
})
test('Should accept MethodSpeciation when its expected', async (t) => {
  const valid = validate({
    CharacteristicName: 'pH'
  })
  assert.equal(valid, true)
})
test('Should accept MethodSpeciation when its not expected', async (t) => {
  const valid = validate({
    CharacteristicName: 'Ammonia and ammonium'
  })
  assert.equal(valid, true)
})

// *** CharacteristicName-pH-ActivityType-Sample *** //
test("Should accept CharacteristicName-pH,lab with ActivityType-Sample", async (t) => {
  const valid = validate({
    CharacteristicName: "pH, lab",
    ActivityType: "Sample-Routine",
    LaboratoryName: "A",
    ResultAnalyticalMethodName: "Unspecified"
  })
  assert.equal(valid, true);
  assert.equal(checkProperty(validate.errors, "required", "CharacteristicName"), false);
  assert.equal(checkProperty(validate.errors, "required", "ActivityType"), false);
  assert.equal(checkProperty(validate.errors, "not", "ActivityType"), false);
});

test("Should reject CharacteristicName-pH with ActivityType-Sample", async (t) => {
  const valid = validate({
    CharacteristicName: "pH",
    ActivityType: "Sample-Routine",
    LaboratoryName: "A",
    ResultAnalyticalMethodName: "Unspecified"
  })
  assert.equal(valid, false);
  assert.equal(checkProperty(validate.errors, "not", "ActivityType"), true);
  assert.equal(checkProperty(validate.errors, "message", "qc-CharacteristicName-pH-ActivityType-Sample"), true);
});

test("Should reject CharacteristicName-pH with ActivityType-Quality Control Sample", async (t) => {
  const valid = validate({
    CharacteristicName: "pH",
    ActivityType: "Quality Control Sample-Other",
    LaboratoryName: "A",
    ResultAnalyticalMethodName: "Unspecified"
  })
  assert.equal(valid, false);
  assert.equal(checkProperty(validate.errors, "not", "ActivityType"), true);
  assert.equal(checkProperty(validate.errors, "message", "qc-CharacteristicName-pH-ActivityType-Sample"), true);
});

// *** CharacteristicName-Metal-ResultAnalyticalMethodName *** //
test('Should accept CharacteristicName-ResultAnalyticalMethodName', async (t) => {
  const valid = validate({
    CharacteristicName: 'Ammonia and ammonium',
    ResultAnalyticalMethodName: 'Test Method Name'
  })
  assert.equal(valid, true)
})
test('Should reject CharacteristicName-ResultAnalyticalMethodName when empty', async (t) => {
  const valid = validate({
    CharacteristicName: 'Day, ice off',
    ResultAnalyticalMethodName: undefined
  })
  assert.equal(valid, false)
  assert.equal(checkProperty(validate.errors, 'required', 'ResultAnalyticalMethodName'), true)
})

// MonitoringLocationDepthHeightMeasure - TODO future?

// *** MonitoringLocationCoordinate-BoundingBox *** //
test('Should accept MonitoringLocationLatitude/Longitude when its within bounds', async (t) => {
  const valid = validate({
    MonitoringLocationLatitude: 51,
    MonitoringLocationLongitude: -114
  })
  assert.equal(valid, true)
})

test('Should reject MonitoringLocationLatitude when its out of bounds', async (t) => {
  const valid = validate({
    MonitoringLocationLatitude: 35,
    MonitoringLocationLongitude: -114
  })
  assert.equal(valid, false)
  assert.equal(
    checkProperty(validate.errors, 'minimum', 'MonitoringLocationLatitude'),
    true
  )
})

test('Should reject MonitoringLocationLongitude when its out of bounds', async (t) => {
  const valid = validate({
    MonitoringLocationLatitude: 51,
    MonitoringLocationLongitude: -45
  })
  assert.equal(valid, false)
  assert.equal(
    checkProperty(validate.errors, 'minimum', 'MonitoringLocationLongitude'),
    true
  )
})

// *** ResultAnalyticalMethodContext-ActivityType *** //
test('Should reject ActivityType when ResultAnalyticalMethodContext is YSI', async (t) => {
  const valid = validate({
    ResultAnalyticalMethodContext: 'YSI',
    ActivityType: 'Sample-Routine'
  })
  assert.equal(valid, false)
  assert.equal(checkProperty(validate.errors, 'enum', 'ActivityType'), true)
})
test('Should reject ActivityType when ResultAnalyticalMethodContext is Oakton', async (t) => {
  const valid = validate({
    ResultAnalyticalMethodContext: 'Oakton',
    ActivityType: 'Sample-Routine'
  })
  assert.equal(valid, false)
  assert.equal(checkProperty(validate.errors, 'enum', 'ActivityType'), true)
})
test('Should accept ActivityType when ResultAnalyticalMethodContext is YSI', async (t) => {
  const valid = validate({
    ResultAnalyticalMethodContext: 'YSI',
    ActivityType: 'Field Msr/Obs-Portable Data Logger'
  })
  assert.equal(valid, true)
})
test('Should accept ActivityType when ResultAnalyticalMethodContext is Oakton', async (t) => {
  const valid = validate({
    ResultAnalyticalMethodContext: 'Oakton',
    ActivityType: 'Field Msr/Obs-Portable Data Logger'
  })
  assert.equal(valid, true)
})
test('Should ignore ActivityType when ResultAnalyticalMethodContext is not YSI', async (t) => {
  const valid = validate({
    ResultAnalyticalMethodContext: 'ANY'
  })
  assert.equal(valid, true)
  // assert.equal(
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
  assert.equal(valid, false)
  assert.equal(
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
  assert.equal(valid, true)
})
test('Should ignore ResultDetectionQuantitationLimit when measure is not defined', async (t) => {
  const valid = validate({
    ResultDetectionQuantitationLimitUnit: 'mg/l'
  })
  assert.equal(valid, false)
  assert.equal(
    checkProperty(
      validate.errors,
      'minimum',
      'ResultDetectionQuantitationLimitMeasure'
    ),
    false
  )
})

// *** CharacteristicName-pH-ResultDetectionQuantitationLimitUnit-None *** //
test('Should accept when CharacteristicName is pH and ResultDetectionQuantitationLimitUnit is None', async (t) => {
  const valid = validate({
    CharacteristicName: 'pH',
    ResultDetectionQuantitationLimitMeasure: 7,
    ResultDetectionQuantitationLimitUnit: 'None'
  })
  assert.equal(valid, true)
})
test('Should reject when CharacteristicName is pH and ResultDetectionQuantitationLimitUnit is not None', async (t) => {
  const valid = validate({
    CharacteristicName: 'pH',
    ResultDetectionQuantitationLimitMeasure: 7,
    ResultDetectionQuantitationLimitUnit: 'mg/L'
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
  // assert.equal(checkProperty(validate.errors, 'false schema', 'ResultDetectionQuantitationLimitUnit'), true)
})

// *** CharacteristicName-Ratio-ResultDetectionQuantitationLimitUnit-None *** //
test('Should accept when CharacteristicName is a ratio and ResultDetectionQuantitationLimitUnit is None', async (t) => {
  const valid = validate({
    CharacteristicName: 'Sodium adsorption ratio [(Na)/(sq root of 1/2 Ca + Mg)]',
    ResultDetectionQuantitationLimitMeasure: 7,
    ResultDetectionQuantitationLimitUnit: 'None'
  })
  assert.equal(valid, true)
})
test('Should reject when CharacteristicName is a ratio and ResultDetectionQuantitationLimitUnit is not None', async (t) => {
  const valid = validate({
    CharacteristicName: 'Sodium adsorption ratio [(Na)/(sq root of 1/2 Ca + Mg)]',
    ResultDetectionQuantitationLimitMeasure: 7,
    ResultDetectionQuantitationLimitUnit: 'mg/L'
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
  // assert.equal(checkProperty(validate.errors, 'false schema', 'ResultDetectionQuantitationLimitUnit'), true)
})

// *** ResultDetectionQuantitationLimitUnit-NoValue *** //
test('Should accept when ResultDetectionQuantitationLimitMeasure & ResultDetectionQuantitationLimitUnit exist', async (t) => {
  const valid = validate({
    CharacteristicName: 'Temperature, water',
    ResultDetectionQuantitationLimitMeasure: 0,
    ResultDetectionQuantitationLimitUnit: 'deg C'
  })
  assert.equal(valid, true)
})
test('Should reject when ResultDetectionQuantitationLimitUnit exists without ResultDetectionQuantitationLimitMeasure', async (t) => {
  const valid = validate({
    CharacteristicName: 'Temperature, water',
    ResultDetectionQuantitationLimitUnit: 'deg C'
  })
  assert.equal(valid, false)
  assert.equal(
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
  assert.equal(valid, true)
})

test('Should reject ResultSampleFraction-ActivityMediaName-Sediment', async (t) => {
  const valid = validate({
    ActivityMediaName: 'Stormwater',
    ResultSampleFraction: 'Extractable, other'
  })
  assert.equal(valid, false)
  assert.equal(checkProperty(validate.errors, 'enum', 'ActivityMediaName'), true)
})

// *** ResultSampleFraction-FreeAvailable *** //
test('Should accept ResultSampleFraction Free Available with Chlorine', async (t) => {
  const valid = validate({
    CharacteristicName: 'Chlorine',
    ResultSampleFraction: 'Free Available'
  })
  assert.equal(valid, true)
})
test('Should accept ResultSampleFraction Free Available with Cyanide', async (t) => {
  const valid = validate({
    CharacteristicName: 'Cyanide',
    ResultSampleFraction: 'Free Available'
  })
  assert.equal(valid, true)
})
test('Should reject ResultSampleFraction Free Available with unrelated CharacteristicName', async (t) => {
  const valid = validate({
    CharacteristicName: 'Iron',
    ResultSampleFraction: 'Free Available'
  })
  assert.equal(valid, false)
  assert.equal(checkProperty(validate.errors, 'enum', 'CharacteristicName'), true)
})
test('Should accept when ResultSampleFraction is not Free Available', async (t) => {
  const valid = validate({
    CharacteristicName: 'Iron',
    ResultSampleFraction: 'Total'
  })
  assert.equal(valid, true)
})

// *** ResultUnit-Elevation *** //
/*test('Should reject Water level in m', async (t) => {
  const valid = validate({
    CharacteristicName: 'Water level',
    ResultValue: 1800,
    ResultUnit: 'm'
  })
  assert.equal(valid, false)
  assert.equal(checkProperty(validate.errors, 'enum', 'ResultUnit'), true)
})
test('Should accept Water level in MASL', async (t) => {
  const valid = validate({
    CharacteristicName: 'Water level',
    ResultValue: 1800,
    ResultUnit: 'MASL'
  })
  assert.equal(valid, true)
})*/

// *** ResultUnit-Percent *** //
test('Should reject Taxonomic Richness... in None', async (t) => {
  const valid = validate({
    CharacteristicName:
      'Taxonomic Richness, Ephemeroptera, Plecoptera, Tricoptera',
    ResultValue: 100,
    ResultUnit: 'None'
  })
  assert.equal(valid, false)
  assert.equal(checkProperty(validate.errors, 'enum', 'ResultUnit'), true)
})
test('Should acceptTaxonomic Richness... in %', async (t) => {
  const valid = validate({
    CharacteristicName:
      'Taxonomic Richness, Ephemeroptera, Plecoptera, Tricoptera',
    ResultValue: 100,
    ResultUnit: '%'
  })
  assert.equal(valid, true)
})

// *** CharacteristicName-pH-ResultUnit-None *** //
test('Should accept when CharacteristicName is pH and ResultUnit is None', async (t) => {
  const valid = validate({
    CharacteristicName: 'pH',
    ResultValue: 7,
    ResultUnit: 'None'
  })
  assert.equal(valid, true)
})
test('Should reject when CharacteristicName is pH and ResultUnit is not None', async (t) => {
  const valid = validate({
    CharacteristicName: 'pH',
    ResultValue: 7,
    ResultUnit: 'mg/L'
  })
  assert.equal(valid, false)
  assert.equal(checkProperty(validate.errors, 'enum', 'ResultUnit'), true)
  // assert.equal(checkProperty(validate.errors, 'false schema', 'ResultUnit'), true)
})

// *** CharacteristicName-Ratio-ResultUnit-None *** //
test('Should accept when CharacteristicName is a ratio and ResultUnit is None', async (t) => {
  const valid = validate({
    CharacteristicName: 'Anion/cation ratio',
    ResultValue: 7,
    ResultUnit: 'None'
  })
  assert.equal(valid, true)
})
test('Should reject when CharacteristicName is a ratio and ResultUnit is not None', async (t) => {
  const valid = validate({
    CharacteristicName: 'Anion/cation ratio',
    ResultValue: 7,
    ResultUnit: 'mg/L'
  })
  assert.equal(valid, false)
  assert.equal(checkProperty(validate.errors, 'enum', 'ResultUnit'), true)
  // assert.equal(checkProperty(validate.errors, 'false schema', 'ResultUnit'), true)
})

// *** ResultUnit-NoValue *** //
test('Should accept when ResultValue & ResultUnit exist', async (t) => {
  const valid = validate({
    CharacteristicName: 'Temperature, water',
    ResultValue: 0,
    ResultUnit: 'deg C'
  })
  assert.equal(valid, true)
})

test('Should reject when ResultUnit exists without ResultValue', async (t) => {
  const valid = validate({
    CharacteristicName: 'Temperature, water',
    ResultUnit: 'deg C'
  })
  assert.equal(valid, false)
  assert.equal(checkProperty(validate.errors, 'false schema', 'ResultUnit'), true)
})

// *** ResultValue-DepthMaximum *** //
/*test('Should reject Depth at 1 m', async (t) => {
  const valid = validate({
    CharacteristicName: 'Depth',
    ResultValue: 1,
    ResultUnit: 'm'
  })
  assert.equal(valid, false)
  assert.equal(checkProperty(validate.errors, 'maximum', 'ResultValue'), true)
})
test('Should accept Depth at -1 ft', async (t) => {
  const valid = validate({
    CharacteristicName: 'Depth',
    ResultValue: -1,
    ResultUnit: 'ft'
  })
  assert.equal(valid, true)
})*/

// *** ResultUnit-Turbidity *** //
test('Should accept Turbidity ResultUnit with Turbidity CharacteristicName', async (t) => {
  const valid = validate({
    CharacteristicName: 'Turbidity',
    ResultValue: 10,
    ResultUnit: 'NTU'
  })
  assert.equal(valid, true)
})
test('Should reject Turbidity ResultUnit with non-Turbidity CharacteristicName', async (t) => {
  const valid = validate({
    CharacteristicName: 'Iron',
    ResultValue: 10,
    ResultUnit: 'NTU'
  })
  assert.equal(valid, false)
  assert.equal(checkProperty(validate.errors, 'enum', 'CharacteristicName'), true)
})
test('Should accept non-Turbidity ResultUnit with non-Turbidity CharacteristicName', async (t) => {
  const valid = validate({
    CharacteristicName: 'Iron',
    ResultValue: 10,
    ResultUnit: 'mg/L'
  })
  assert.equal(valid, true)
})

// *** ResultDetectionQuantitationLimitUnit-Turbidity *** //
test('Should accept Turbidity ResultDetectionQuantitationLimitUnit with Turbidity CharacteristicName', async (t) => {
  const valid = validate({
    CharacteristicName: 'Turbidity',
    ResultDetectionQuantitationLimitMeasure: 10,
    ResultDetectionQuantitationLimitUnit: 'NTU'
  })
  assert.equal(valid, true)
})
test('Should reject Turbidity ResultDetectionQuantitationLimitUnit with non-Turbidity CharacteristicName', async (t) => {
  const valid = validate({
    CharacteristicName: 'Iron',
    ResultDetectionQuantitationLimitMeasure: 10,
    ResultDetectionQuantitationLimitUnit: 'NTU'
  })
  assert.equal(valid, false)
  assert.equal(checkProperty(validate.errors, 'enum', 'CharacteristicName'), true)
})
test('Should accept non-Turbidity ResultDetectionQuantitationLimitUnit with non-Turbidity CharacteristicName', async (t) => {
  const valid = validate({
    CharacteristicName: 'Iron',
    ResultDetectionQuantitationLimitMeasure: 10,
    ResultDetectionQuantitationLimitUnit: 'mg/L'
  })
  assert.equal(valid, true)
})

// *** ResultValue-DissolvedOxygenUnit *** //
test('Should reject Dissolved oxygen (DO) in %', async (t) => {
  const valid = validate({
    CharacteristicName: 'Dissolved oxygen (DO)',
    ResultValue: 1,
    ResultUnit: '%'
  })
  assert.equal(valid, false)
  assert.equal(checkProperty(validate.errors, 'enum', 'ResultUnit'), true)
})
test('Should accept Dissolved oxygen (DO) in mg/L', async (t) => {
  const valid = validate({
    CharacteristicName: 'Dissolved oxygen (DO)',
    ResultValue: 1,
    ResultUnit: 'mg/L'
  })
  assert.equal(valid, true)
})

// *** ResultValue-DOSatMinimum *** //
test('Should reject Dissolved oxygen saturation when measure is below 0', async (t) => {
  const valid = validate({
    CharacteristicName: 'Dissolved oxygen saturation',
    ResultValue: -1,
    ResultUnit: 'mg/l'
  })
  assert.equal(valid, false)
  assert.equal(checkProperty(validate.errors, 'minimum', 'ResultValue'), true)
})
test('Should accept Dissolved oxygen saturation when measure is above 0', async (t) => {
  const valid = validate({
    CharacteristicName: 'Dissolved oxygen saturation',
    ResultValue: 1,
    ResultUnit: 'mg/l'
  })
  assert.equal(valid, true)
})

// *** ResultValue-Minimum *** //
test('Should reject Result when measure is below 0', async (t) => {
  const valid = validate({
    ResultValue: -1,
    ResultUnit: 'mg/l'
  })
  assert.equal(valid, false)
  assert.equal(checkProperty(validate.errors, 'minimum', 'ResultValue'), true)
})
test('Should accept Result when measure is above 0', async (t) => {
  const valid = validate({
    ResultValue: 1,
    ResultUnit: 'mg/l'
  })
  assert.equal(valid, true)
})
test('Should ignore Result when measure is not defined', async (t) => {
  const valid = validate({
    ResultUnit: '#/100ml'
  })
  assert.equal(valid, false)
  assert.equal(checkProperty(validate.errors, 'minimum', 'ResultValue'), false)
})
test('Should ignore Result when measure is a string', async (t) => {
  const valid = validate({
    ResultValue: 'unknown',
    ResultUnit: '#/100ml'
  })
  assert.equal(valid, false)
  assert.equal(checkProperty(validate.errors, 'minimum', 'ResultValue'), false)
})

// *** ResultValue-pH-Range *** //
test('Should reject pH below range', async (t) => {
  const valid = validate({
    CharacteristicName: 'pH',
    ResultValue: -1,
    ResultUnit: 'None'
  })
  assert.equal(valid, false)
  assert.equal(checkProperty(validate.errors, 'minimum', 'ResultValue'), true)
})
test('Should reject pH above range', async (t) => {
  const valid = validate({
    CharacteristicName: 'pH',
    ResultValue: 15,
    ResultUnit: 'None'
  })
  assert.equal(valid, false)
  assert.equal(checkProperty(validate.errors, 'maximum', 'ResultValue'), true)
})
test('Should accept pH within range', async (t) => {
  const valid = validate({
    CharacteristicName: 'pH',
    ResultValue: 7,
    ResultUnit: 'None'
  })
  assert.equal(valid, true)
})
test('Should ignore pH range check when measure is not defined', async (t) => {
  const valid = validate({
    CharacteristicName: 'pH',
    ResultUnit: 'None'
  })
  assert.equal(valid, false) // due to another QC
  assert.equal(checkProperty(validate.errors, 'minimum', 'ResultValue'), false)
  assert.equal(checkProperty(validate.errors, 'maximum', 'ResultValue'), false)
})

test('Should ignore pH range check when measure is a string', async (t) => {
  const valid = validate({
    CharacteristicName: 'pH',
    ResultValue: 'Unknown',
    ResultUnit: 'None'
  })
  assert.equal(valid, false)
  assert.equal(checkProperty(validate.errors, 'minimum', 'ResultValue'), false)
  assert.equal(checkProperty(validate.errors, 'maximum', 'ResultValue'), false)
})

// *** ResultValue-Temperature-Range *** //
test('Should reject Temperature below range', async (t) => {
  const valid = validate({
    CharacteristicName: 'Temperature, water',
    ResultValue: -101,
    ResultUnit: 'deg C'
  })
  assert.equal(valid, false)
  assert.equal(checkProperty(validate.errors, 'minimum', 'ResultValue'), true)
})
test('Should reject Temperature above range', async (t) => {
  const valid = validate({
    CharacteristicName: 'Temperature, water',
    ResultValue: 101,
    ResultUnit: 'deg C'
  })
  assert.equal(valid, false)
  assert.equal(checkProperty(validate.errors, 'maximum', 'ResultValue'), true)
})
test('Should accept Temperature within range', async (t) => {
  const valid = validate({
    CharacteristicName: 'Temperature, water',
    ResultValue: 0,
    ResultUnit: 'deg C'
  })
  assert.equal(valid, true)
})
test('Should ignore Temperature range check when measure is not defined', async (t) => {
  const valid = validate({
    CharacteristicName: 'Temperature, water',
    ResultUnit: 'deg C'
  })
  assert.equal(valid, false) // due to another QC
  assert.equal(checkProperty(validate.errors, 'minimum', 'ResultValue'), false)
  assert.equal(checkProperty(validate.errors, 'maximum', 'ResultValue'), false)
})
test('Should ignore Temperature range check when measure is a string', async (t) => {
  const valid = validate({
    CharacteristicName: 'Temperature, water',
    ResultValue: 'Unknown',
    ResultUnit: 'deg C'
  })
  assert.equal(valid, false)
  assert.equal(checkProperty(validate.errors, 'minimum', 'ResultValue'), false)
  assert.equal(checkProperty(validate.errors, 'maximum', 'ResultValue'), false)
})

// *** ResultValue-DOY-Range *** //
test('Should reject DOY below range (1-366)', async (t) => {
  const valid = validate({
    ResultUnit: 'DOY',
    ResultValue: 0
  })
  assert.equal(valid, false)
  assert.equal(checkProperty(validate.errors, 'minimum', 'ResultValue'), true)
})
test('Should reject DOY above range (1-366)', async (t) => {
  const valid = validate({
    ResultUnit: 'DOY',
    ResultValue: 367
  })
  assert.equal(valid, false)
  assert.equal(checkProperty(validate.errors, 'maximum', 'ResultValue'), true)
})
test('Should accept DOY within range (1-366)', async (t) => {
  const valid = validate({
    ResultUnit: 'DOY',
    ResultValue: 300
  })
  assert.equal(valid, true)
})
test('Should ignore DOY range check when measure is not defined', async (t) => {
  const valid = validate({
    ResultUnit: 'DOY'
  })
  assert.equal(valid, false) // due to another QC
  assert.equal(checkProperty(validate.errors, 'minimum', 'ResultValue'), false)
  assert.equal(checkProperty(validate.errors, 'maximum', 'ResultValue'), false)
})
test('Should ignore DOY range check when measure is a string', async (t) => {
  const valid = validate({
    ResultValue: 'Unknown',
    ResultUnit: 'DOY'
  })
  assert.equal(valid, false)
  assert.equal(checkProperty(validate.errors, 'minimum', 'ResultValue'), false)
  assert.equal(checkProperty(validate.errors, 'maximum', 'ResultValue'), false)
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
  assert.equal(valid, false)
  assert.equal(checkProperty(validate.errors, 'pattern', 'DatasetName'), true)
  assert.equal(checkProperty(validate.errors, 'pattern', 'MonitoringLocationID'), true)
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
  assert.equal(checkProperty(validate.errors, 'pattern', 'LaboratoryName'), true)
  assert.equal(checkProperty(validate.errors, 'pattern', 'LaboratorySampleID'), true)
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
  assert.equal(valid, true)
})
