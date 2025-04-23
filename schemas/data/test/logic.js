import test from "ava";

import validate from "../frontend/index.js";

const checkProperty = (errors, keyword, property) => {
  if (errors === null) return false;
  for (const error of errors) {
    if (error.keyword === "errorMessage") {
      const nested = checkProperty(error.params.errors, keyword, property);
      if (nested) return nested;
    }
    if (error.keyword !== keyword) continue;
    if (
      ["required", "dependencies"].includes(keyword) &&
      error.params.missingProperty === property
    ) {
      return true;
    } else if (
      keyword === "additionalProperties" &&
      error.params.additionalProperty === property
    ) {
      return true;
    } else if (
      keyword === "oneOf" &&
      error.params.passingSchemas.includes(property)
    ) {
      return true;
    } else if (keyword === "anyOf") return true;
    else if (keyword === "not" && error.instancePath.includes(property)) {
      return true;
    } else if (keyword === "enum" && error.instancePath.includes(property)) {
      return true;
    } else if (keyword === "minimum" && error.instancePath.includes(property)) {
      return true;
    } else if (
      keyword === "exclusiveMinimum" &&
      error.instancePath.includes(property)
    ) {
      return true;
    } else if (keyword === "maximum" && error.instancePath.includes(property)) {
      return true;
    } else if (
      keyword === "exclusiveMaximum" &&
      error.instancePath.includes(property)
    ) {
      return true;
    } else if (
      keyword === "false schema" &&
      error.instancePath.includes(property)
    ) {
      return true;
    } else if (keyword === "pattern") return true;
  }
  return false;
};

// ActivityType-CTS-ActivityStartTime
test("Should accept ActivityType without ActivityStartTime for non-CTS", async (t) => {
  const valid = validate({
    ActivityType: "Field Msr/Obs",
  });
  t.false(valid);
  t.is(checkProperty(validate.errors, "required", "ActivityType"), false);
  t.is(checkProperty(validate.errors, "required", "ActivityStartTime"), false);
});

test("Should accept ActivityType with ActivityStartTime for non-CTS", async (t) => {
  const valid = validate({
    ActivityType: "Field Msr/Obs",
    ActivityStartTime: '13:15:00',
  });
  t.false(valid);
  t.is(checkProperty(validate.errors, "required", "ActivityType"), false);
  t.is(checkProperty(validate.errors, "required", "ActivityStartTime"), false);
});

test("Should reject ActivityType without ActivityStartTime for CTS", async (t) => {
  const valid = validate({
    ActivityType: "Field Msr/Obs-Continuous Time Series",
  });
  t.false(valid);
  t.is(checkProperty(validate.errors, "required", "ActivityStartTime"), true);
});

test("Should accept ActivityType with ActivityStartTime for CTS", async (t) => {
  const valid = validate({
    ActivityType: "Field Msr/Obs-Continuous Time Series",
    ActivityStartTime: '13:15:00',
  });
  t.false(valid);
  t.is(checkProperty(validate.errors, "required", "ActivityType"), false);
  t.is(checkProperty(validate.errors, "required", "ActivityStartTime"), false);
});

// ActivityType-ResultAnalyticalMethod
test("Should reject ActivityType = Sample-*", async (t) => {
  const valid = validate({
    ActivityType: "Sample-Other",
  });
  t.false(valid);
  t.is(checkProperty(validate.errors, "dependencies", "LaboratoryName"), true);
  t.is(
    checkProperty(validate.errors, "dependencies", "ResultAnalyticalMethodID"),
    true,
  );
  t.is(
    checkProperty(
      validate.errors,
      "dependencies",
      "ResultAnalyticalMethodContext",
    ),
    true,
  );
  t.is(
    checkProperty(
      validate.errors,
      "dependencies",
      "ResultAnalyticalMethodName",
    ),
    true,
  );
});
test("Should reject ActivityType = Quality Control Sample-*", async (t) => {
  const valid = validate({
    ActivityType: "Quality Control Sample-Other",
  });
  t.false(valid);
  t.is(checkProperty(validate.errors, "dependencies", "LaboratoryName"), true);
  t.is(
    checkProperty(validate.errors, "dependencies", "ResultAnalyticalMethodID"),
    true,
  );
  t.is(
    checkProperty(
      validate.errors,
      "dependencies",
      "ResultAnalyticalMethodContext",
    ),
    true,
  );
  t.is(
    checkProperty(
      validate.errors,
      "dependencies",
      "ResultAnalyticalMethodName",
    ),
    true,
  );
});
test("Should accept ActivityType = Sample-* w/ ResultAnalyticalMethodID & ResultAnalyticalMethodContext", async (t) => {
  const valid = validate({
    ActivityType: "Sample-Other",
    LaboratoryName: "A",
    ResultAnalyticalMethodID: "0",
    ResultAnalyticalMethodContext: "ENV",
  });
  t.false(valid);
  t.is(checkProperty(validate.errors, "dependencies", "LaboratoryName"), false);
  t.is(
    checkProperty(validate.errors, "dependencies", "ResultAnalyticalMethodID"),
    false,
  );
  t.is(
    checkProperty(
      validate.errors,
      "dependencies",
      "ResultAnalyticalMethodContext",
    ),
    false,
  );
  t.is(
    checkProperty(
      validate.errors,
      "dependencies",
      "ResultAnalyticalMethodName",
    ),
    false,
  );
});
test("Should accept ActivityType = Quality Control Sample-* w/ ResultAnalyticalMethodID & ResultAnalyticalMethodContext", async (t) => {
  const valid = validate({
    ActivityType: "Quality Control Sample-Other",
    LaboratoryName: "A",
    ResultAnalyticalMethodID: "0",
    ResultAnalyticalMethodContext: "ENV",
  });
  t.false(valid);
  t.is(checkProperty(validate.errors, "dependencies", "LaboratoryName"), false);
  t.is(
    checkProperty(validate.errors, "dependencies", "ResultAnalyticalMethodID"),
    false,
  );
  t.is(
    checkProperty(
      validate.errors,
      "dependencies",
      "ResultAnalyticalMethodContext",
    ),
    false,
  );
  t.is(
    checkProperty(
      validate.errors,
      "dependencies",
      "ResultAnalyticalMethodName",
    ),
    false,
  );
});

test("Should accept ActivityType = Sample-* w/ ResultAnalyticalMethodName", async (t) => {
  const valid = validate({
    ActivityType: "Sample-Other",
    LaboratoryName: "A",
    ResultAnalyticalMethodName: "Unspecified",
  });
  t.false(valid);
  t.is(checkProperty(validate.errors, "dependencies", "LaboratoryName"), false);
  t.is(
    checkProperty(validate.errors, "dependencies", "ResultAnalyticalMethodID"),
    false,
  );
  t.is(
    checkProperty(
      validate.errors,
      "dependencies",
      "ResultAnalyticalMethodContext",
    ),
    false,
  );
  t.is(
    checkProperty(
      validate.errors,
      "dependencies",
      "ResultAnalyticalMethodName",
    ),
    false,
  );
});
test("Should accept ActivityType = Quality Control Sample-* w/ ResultAnalyticalMethodName", async (t) => {
  const valid = validate({
    ActivityType: "Sample-Other",
    LaboratoryName: "A",
    ResultAnalyticalMethodName: "Unspecified",
  });
  t.false(valid);
  t.is(checkProperty(validate.errors, "dependencies", "LaboratoryName"), false);
  t.is(
    checkProperty(validate.errors, "dependencies", "ResultAnalyticalMethodID"),
    false,
  );
  t.is(
    checkProperty(
      validate.errors,
      "dependencies",
      "ResultAnalyticalMethodContext",
    ),
    false,
  );
  t.is(
    checkProperty(
      validate.errors,
      "dependencies",
      "ResultAnalyticalMethodName",
    ),
    false,
  );
});

// CharacteristicName-MethodSpeciation
test("Should accept CharacteristicName AND NOT MethodSpeciation", async (t) => {
  const valid = validate({
    CharacteristicName: "Calcium",
  });
  t.false(valid);
  t.is(checkProperty(validate.errors, "required", "CharacteristicName"), false);
  t.is(checkProperty(validate.errors, "required", "MethodSpeciation"), false);
});
test("Should reject CharacteristicName AND NOT MethodSpeciation", async (t) => {
  const valid = validate({
    CharacteristicName: "Nitrate",
  });
  t.false(valid);
  t.is(checkProperty(validate.errors, "required", "MethodSpeciation"), true);
});
test("Should accept CharacteristicName AND MethodSpeciation", async (t) => {
  const valid = validate({
    CharacteristicName: "Nitrate",
    MethodSpeciation: "as N",
  });
  t.false(valid);
  t.is(checkProperty(validate.errors, "required", "CharacteristicName"), false);
  t.is(checkProperty(validate.errors, "required", "MethodSpeciation"), false);
});

// CharacteristicName-Nutrient-ResultSampleFraction
test("Should reject Nutrient CharacteristicName AND ResultSampleFraction", async (t) => {
  const valid = validate({
    ActivityMediaName: "Surface Water",
    CharacteristicName: "Ammonia",
    ActivityType: "",
    ResultSampleFraction: "Total",
  });
  t.false(valid);
  t.is(checkProperty(validate.errors, "required", "CharacteristicName"), false);
  t.is(
    checkProperty(validate.errors, "required", "ResultSampleFraction"),
    false,
  );
  t.is(checkProperty(validate.errors, "enum", "ResultSampleFraction"), true);
});
test("Should accept Nutrient CharacteristicName AND filter ResultSampleFraction", async (t) => {
  const valid = validate({
    ActivityMediaName: "Surface Water",
    CharacteristicName: "Ammonia",
    ActivityType: "",
    ResultSampleFraction: "Filtered",
  });
  t.false(valid);
  t.is(checkProperty(validate.errors, "required", "CharacteristicName"), false);
  t.is(
    checkProperty(validate.errors, "required", "ResultSampleFraction"),
    false,
  );
  t.is(checkProperty(validate.errors, "enum", "ResultSampleFraction"), false);
});
test("Should accept Nutrient Sediment", async (t) => {
  const valid = validate({
    ActivityMediaName: "Surface Water Sediment",
    CharacteristicName: "Ammonia",
    ActivityType: "",
    ResultSampleFraction: "Total",
  });
  t.false(valid);
  t.is(checkProperty(validate.errors, "required", "CharacteristicName"), false);
  t.is(
    checkProperty(validate.errors, "required", "ResultSampleFraction"),
    false,
  );
  t.is(checkProperty(validate.errors, "enum", "ResultSampleFraction"), false);
});
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

// CharacteristicName-ResultSampleFraction
test("Should accept CharacteristicName AND NOT ResultSampleFraction", async (t) => {
  const valid = validate({
    CharacteristicName: "Dissolved oxygen (DO)",
  });
  t.false(valid);
  t.is(checkProperty(validate.errors, "required", "CharacteristicName"), false);
  t.is(
    checkProperty(validate.errors, "required", "ResultSampleFraction"),
    false,
  );
});
test("Should rejects CharacteristicName AND NOT ResultSampleFraction", async (t) => {
  const valid = validate({
    CharacteristicName: "Silver",
  });
  t.false(valid);
  t.is(
    checkProperty(validate.errors, "required", "ResultSampleFraction"),
    true,
  );
});
test("Should accept CharacteristicName AND ResultSampleFraction", async (t) => {
  const valid = validate({
    CharacteristicName: "Silver",
    ResultSampleFraction: "Dissolved",
  });
  t.false(valid);
  t.is(checkProperty(validate.errors, "required", "CharacteristicName"), false);
  t.is(
    checkProperty(validate.errors, "required", "ResultSampleFraction"),
    false,
  );
});

// CharacteristicName-StableIsotope-ResultSampleFraction
test("Should reject StableIsotope CharacteristicName, MethodSpeciation required", async (t) => {
  const valid = validate({
    CharacteristicName: "Nitrogen-15",
  });
  t.false(valid);
  t.is(checkProperty(validate.errors, "required", "CharacteristicName"), false);
  t.is(checkProperty(validate.errors, "required", "MethodSpeciation"), true);
});
test("Should reject StableIsotope CharacteristicName", async (t) => {
  const valid = validate({
    CharacteristicName: "Nitrogen-15",
    MethodSpeciation: "as NH4",
  });
  t.false(valid);
  t.is(checkProperty(validate.errors, "required", "CharacteristicName"), false);
  t.is(checkProperty(validate.errors, "enum", "MethodSpeciation"), true);
});
test("Should accept StableIsotope CharacteristicName", async (t) => {
  const valid = validate({
    CharacteristicName: "Nitrogen-15",
    MethodSpeciation: "of NH4",
  });
  t.false(valid);
  t.is(checkProperty(validate.errors, "required", "CharacteristicName"), false);
  t.is(checkProperty(validate.errors, "required", "MethodSpeciation"), false);
});

// allOf/3
test("Should reject NOT ResultValue AND NOT ResultDetectionCondition", async (t) => {
  const valid = validate({});
  t.false(valid);
  t.is(checkProperty(validate.errors, "required", "ResultValue"), true);
  t.is(
    checkProperty(validate.errors, "required", "ResultDetectionCondition"),
    true,
  );
});
test("Should reject ResultValue AND ResultDetectionCondition", async (t) => {
  const valid = validate({
    ResultValue: 1,
    ResultDetectionCondition: "Not Reported",
  });
  t.false(valid);
  t.is(checkProperty(validate.errors, "false schema", "ResultValue"), true);
  t.is(
    checkProperty(validate.errors, "false schema", "ResultDetectionCondition"),
    true,
  );
});

test("Should accept ResultValue OR ResultDetectionCondition", async (t) => {
  let valid = validate({
    ResultValue: 1,
  });
  t.false(valid);
  t.is(checkProperty(validate.errors, "required", "ResultValue"), false);
  t.is(
    checkProperty(validate.errors, "required", "ResultDetectionCondition"),
    false,
  );
  t.is(checkProperty(validate.errors, "enum", "ResultValue"), false);
  t.is(
    checkProperty(validate.errors, "enum", "ResultDetectionCondition"),
    false,
  );

  valid = validate({
    ResultDetectionCondition: "Not Reported",
  });
  t.false(valid);
  t.is(checkProperty(validate.errors, "required", "ResultValue"), false);
  t.is(
    checkProperty(validate.errors, "required", "ResultDetectionCondition"),
    false,
  );
  t.is(checkProperty(validate.errors, "enum", "ResultValue"), false);
  t.is(
    checkProperty(validate.errors, "enum", "ResultDetectionCondition"),
    false,
  );
});

// ResultDetectionCondition-ResultDetectionQuantitationLimit-above-below
test("Should reject ResultDetectionCondition = Present Above Quantification Limit", async (t) => {
  const valid = validate({
    ResultDetectionCondition: "Present Above Quantification Limit",
  });
  t.false(valid);
  t.is(
    checkProperty(
      validate.errors,
      "dependencies",
      "ResultDetectionQuantitationLimitType",
    ),
    true,
  );
  t.is(
    checkProperty(
      validate.errors,
      "dependencies",
      "ResultDetectionQuantitationLimitMeasure",
    ),
    true,
  );
  t.is(
    checkProperty(
      validate.errors,
      "dependencies",
      "ResultDetectionQuantitationLimitUnit",
    ),
    true,
  );
});

test("Should reject ResultDetectionCondition = Present Below Quantification Limit", async (t) => {
  const valid = validate({
    ResultValue: 1,
    ResultDetectionCondition: "Present Below Quantification Limit",
  });
  t.false(valid);
  t.is(
    checkProperty(
      validate.errors,
      "dependencies",
      "ResultDetectionQuantitationLimitType",
    ),
    true,
  );
  t.is(
    checkProperty(
      validate.errors,
      "dependencies",
      "ResultDetectionQuantitationLimitMeasure",
    ),
    true,
  );
  t.is(
    checkProperty(
      validate.errors,
      "dependencies",
      "ResultDetectionQuantitationLimitUnit",
    ),
    true,
  );
});

test("Should accept ResultDetectionCondition", async (t) => {
  const valid = validate({
    ResultValue: 1,
    ResultDetectionCondition: "Present Below Quantification Limit",
    ResultDetectionQuantitationLimitType: "A",
    ResultDetectionQuantitationLimitMeasure: 1,
    ResultDetectionQuantitationLimitUnit: "mg/L",
  });
  t.false(valid);
  t.is(
    checkProperty(
      validate.errors,
      "dependencies",
      "ResultDetectionQuantitationLimitType",
    ),
    false,
  );
  t.is(
    checkProperty(
      validate.errors,
      "dependencies",
      "ResultDetectionQuantitationLimitMeasure",
    ),
    false,
  );
  t.is(
    checkProperty(
      validate.errors,
      "dependencies",
      "ResultDetectionQuantitationLimitUnit",
    ),
    false,
  );
});

// ResultDetectionCondition-ResultDetectionQuantitationLimit-not-detect
test("Should reject ResultDetectionCondition = Not Detected", async (t) => {
  const valid = validate({
    ResultDetectionCondition: "Not Detected",
    ResultDetectionQuantitationLimitType: "Sample Detection Limit",
    ResultDetectionQuantitationLimitMeasure: 0,
    ResultDetectionQuantitationLimitUnit: "None",
  });
  t.false(valid);
  t.is(
    checkProperty(
      validate.errors,
      "false schema",
      "ResultDetectionQuantitationLimitType",
    ),
    true,
  );
  t.is(
    checkProperty(
      validate.errors,
      "false schema",
      "ResultDetectionQuantitationLimitMeasure",
    ),
    true,
  );
  t.is(
    checkProperty(
      validate.errors,
      "false schema",
      "ResultDetectionQuantitationLimitUnit",
    ),
    true,
  );
});

test("Should accept ResultDetectionCondition = Not Detected", async (t) => {
  const valid = validate({
    ResultDetectionCondition: "Not Detected",
  });
  t.false(valid);
  t.is(
    checkProperty(
      validate.errors,
      "enum",
      "ResultDetectionQuantitationLimitType",
    ),
    false,
  );
  t.is(
    checkProperty(
      validate.errors,
      "enum",
      "ResultDetectionQuantitationLimitMeasure",
    ),
    false,
  );
  t.is(
    checkProperty(
      validate.errors,
      "enum",
      "ResultDetectionQuantitationLimitUnit",
    ),
    false,
  );
});

test("Should reject ResultDetectionCondition = Detected Not Quantified", async (t) => {
  const valid = validate({
    ResultDetectionCondition: "Detected Not Quantified",
    ResultDetectionQuantitationLimitType: "Sample Detection Limit",
    ResultDetectionQuantitationLimitMeasure: 0,
    ResultDetectionQuantitationLimitUnit: "None",
  });
  t.false(valid);
  t.is(
    checkProperty(
      validate.errors,
      "false schema",
      "ResultDetectionQuantitationLimitType",
    ),
    true,
  );
  t.is(
    checkProperty(
      validate.errors,
      "false schema",
      "ResultDetectionQuantitationLimitMeasure",
    ),
    true,
  );
  t.is(
    checkProperty(
      validate.errors,
      "false schema",
      "ResultDetectionQuantitationLimitUnit",
    ),
    true,
  );
});

test("Should accept ResultDetectionCondition = Detected Not Quantified", async (t) => {
  const valid = validate({
    ResultDetectionCondition: "Detected Not Quantified",
  });
  t.false(valid);
  t.is(
    checkProperty(
      validate.errors,
      "enum",
      "ResultDetectionQuantitationLimitType",
    ),
    false,
  );
  t.is(
    checkProperty(
      validate.errors,
      "enum",
      "ResultDetectionQuantitationLimitMeasure",
    ),
    false,
  );
  t.is(
    checkProperty(
      validate.errors,
      "enum",
      "ResultDetectionQuantitationLimitUnit",
    ),
    false,
  );
});

// CSV Injection
test("Should reject columns with potential csv injection", async (t) => {
  const valid = validate({
    DatasetName: "=equals",
    MonitoringLocationID: "+positive",
    MonitoringLocationName: "-negative",
    ResultComment: "@at  ",
    ResultAnalyticalMethodID: `
carriage return`,
    ResultAnalyticalMethodName: "\ncarriage return",
    LaboratoryName: "\rcarriage return",
    LaboratorySampleID: "\ttab",
  });
  t.false(valid);
  t.is(checkProperty(validate.errors, "pattern", "DatasetName"), true);
  t.is(checkProperty(validate.errors, "pattern", "MonitoringLocationID"), true);
  t.is(
    checkProperty(validate.errors, "pattern", "MonitoringLocationName"),
    true,
  );
  t.is(checkProperty(validate.errors, "pattern", "ResultComment"), true);
  t.is(
    checkProperty(validate.errors, "pattern", "ResultAnalyticalMethodID"),
    true,
  );
  t.is(
    checkProperty(validate.errors, "pattern", "ResultAnalyticalMethodName"),
    true,
  );
  t.is(checkProperty(validate.errors, "pattern", "LaboratoryName"), true);
  t.is(checkProperty(validate.errors, "pattern", "LaboratorySampleID"), true);
});

test("Should accept columns without potential csv injection", async (t) => {
  const valid = validate({
    DatasetName: "~",
    MonitoringLocationID: "1",
    MonitoringLocationName: "&",
    ResultComment: "$",
    ResultAnalyticalMethodID: "#",
    ResultAnalyticalMethodName: "|",
    LaboratoryName: "_",
    LaboratorySampleID: "*",
  });
  t.false(valid);
  // console.log(valid, JSON.stringify(validate.errors, null, 2))
  t.is(checkProperty(validate.errors, "pattern", "DatasetName"), false);
  t.is(
    checkProperty(validate.errors, "pattern", "MonitoringLocationID"),
    false,
  );
  t.is(
    checkProperty(validate.errors, "pattern", "MonitoringLocationName"),
    false,
  );
  t.is(checkProperty(validate.errors, "pattern", "ResultComment"), false);
  t.is(
    checkProperty(validate.errors, "pattern", "ResultAnalyticalMethodID"),
    false,
  );
  t.is(
    checkProperty(validate.errors, "pattern", "ResultAnalyticalMethodName"),
    false,
  );
  t.is(checkProperty(validate.errors, "pattern", "LaboratoryName"), false);
  t.is(checkProperty(validate.errors, "pattern", "LaboratorySampleID"), false);
});

// *** ResultUnit-Salinity *** //
test("Should accept when Salinity and expected unit", async (t) => {
  const valid = validate({
    CharacteristicName: "Salinity",
    ResultValue: 0,
    ResultUnit: "PSU",
  });
  t.is(valid, false);
  t.is(checkProperty(validate.errors, "enum", "ResultUnit"), false);
});
test("Should reject when Salinity and `ppt`", async (t) => {
  const valid = validate({
    CharacteristicName: "Salinity",
    ResultUnit: "ppt",
  });
  t.is(valid, false);
  t.is(checkProperty(validate.errors, "enum", "ResultUnit"), true);
});

// *** ResultDetectionQuantitationLimitUnit-Salinity *** //
test("Should accept when Salinity and expected ResultDetectionQuantitationLimitUnit", async (t) => {
  const valid = validate({
    CharacteristicName: "Salinity",
    ResultDetectionQuantitationLimitMeasure: 0,
    ResultDetectionQuantitationLimitUnit: "PSU",
  });
  t.is(valid, false);
  t.is(
    checkProperty(
      validate.errors,
      "enum",
      "ResultDetectionQuantitationLimitUnit",
    ),
    false,
  );
});
test("Should reject when Salinity and ResultDetectionQuantitationLimitUnit=`ppt`", async (t) => {
  const valid = validate({
    CharacteristicName: "Salinity",
    ResultDetectionQuantitationLimitMeasure: 0,
    ResultDetectionQuantitationLimitUnit: "ppt",
  });
  t.is(valid, false);
  t.is(
    checkProperty(
      validate.errors,
      "enum",
      "ResultDetectionQuantitationLimitUnit",
    ),
    true,
  );
});

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
  t.is(valid, false)
  t.is(
    checkProperty(
      validate.errors,
      'enum',
      'ResultDetectionQuantitationLimitUnit'
    ),
    true
  )
})*/
