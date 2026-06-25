import { test } from "node:test";
import assert from "node:assert/strict";
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
      keyword === "unevaluatedProperties" &&
      error.params.unevaluatedProperty === property
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

test("Should not set any defaults", async (t) => {
  const data = {};
  const valid = validate(data);
  assert.equal(valid, false);
  assert.deepEqual(data, {});
});

test("Should require properties", async (t) => {
  const valid = validate({});
  assert.equal(valid, false);

  // #/allOf/0
  assert.equal(checkProperty(validate.errors, "required", "DatasetName"), true);
  assert.equal(
    checkProperty(validate.errors, "required", "MonitoringLocationID"),
    true,
  );
  assert.equal(
    checkProperty(validate.errors, "required", "MonitoringLocationName"),
    true,
  );
  assert.equal(
    checkProperty(validate.errors, "required", "MonitoringLocationType"),
    true,
  );
  assert.equal(
    checkProperty(validate.errors, "required", "MonitoringLocationLatitude"),
    true,
  );
  assert.equal(
    checkProperty(validate.errors, "required", "MonitoringLocationLongitude"),
    true,
  );
  assert.equal(
    checkProperty(
      validate.errors,
      "required",
      "MonitoringLocationHorizontalCoordinateReferenceSystem",
    ),
    true,
  );
  assert.equal(checkProperty(validate.errors, "required", "ActivityType"), true);
  assert.equal(checkProperty(validate.errors, "required", "ActivityMediaName"), true);
  assert.equal(checkProperty(validate.errors, "required", "ActivityStartDate"), true);
  assert.equal(checkProperty(validate.errors, "required", "CharacteristicName"), true);
  assert.equal(checkProperty(validate.errors, "required", "ResultValueType"), true);
});

test("Should not require properties", async (t) => {
  const valid = validate({
    DatasetName: "Test",
    MonitoringLocationID: "A1",
    MonitoringLocationName: "A1 Test",
    MonitoringLocationLatitude: "51.0486",
    MonitoringLocationLongitude: "-114.0708",
    MonitoringLocationHorizontalCoordinateReferenceSystem: "WGS84",
    MonitoringLocationType: "Ocean",
    ActivityType: "Field Msr/Obs",
    ActivityMediaName: "Surface Water",
    ActivityDepthHeightMeasure: "-34",
    ActivityDepthHeightUnit: "m",
    SampleCollectionEquipmentName: "Bucket",
    CharacteristicName: "Sulfur",
    MethodSpeciation: "as B",
    ResultSampleFraction: "Dissolved",
    ResultValue: "99.99",
    ResultUnit: "ug/l",
    ResultValueType: "Actual",
    ResultStatusID: "Accepted",
    ResultComment: "None at this time",
    ResultAnalyticalMethodID: "1",
    ResultAnalyticalMethodContext: "APHA",
    ActivityStartDate: "2018-02-23",
    ActivityStartTime: "13:15:00",
    ActivityEndDate: "2018-02-23",
    ActivityEndTime: "13:15:00",
    LaboratoryName: "Farrell Labs",
    LaboratorySampleID: "101010011110",
    AnalysisStartDate: "2018-02-23",
    AnalysisStartTime: "13:15:00",
    AnalysisStartTimeZone: "-06:00",
  });
  assert.equal(valid, true);
});

test("Should reject additional headers", async (t) => {
  const valid = validate({
    MonitoringLocationWaterBody: "Lake",
  });
  assert.equal(valid, false);
  assert.equal(
    checkProperty(
      validate.errors,
      "unevaluatedProperties",
      "MonitoringLocationWaterBody",
    ),
    true,
  );
});

test("Should treat EventID as an optional, unconditional field", async (t) => {
  validate({ EventID: "Spring 2018 survey" });
  // Recognized column — not rejected as an unknown/additional header.
  assert.equal(
    checkProperty(validate.errors, "unevaluatedProperties", "EventID"),
    false,
  );
  // Imposes no requirement of its own — never reported as required or as a dependency.
  assert.equal(checkProperty(validate.errors, "required", "EventID"), false);
  assert.equal(checkProperty(validate.errors, "dependencies", "EventID"), false);
});

test("Should reject ActivityDepthHeightMeasure AND NOT ActivityDepthHeightUnit", async (t) => {
  const valid = validate({
    ActivityDepthHeightMeasure: true,
  });
  assert.equal(valid, false);
  assert.equal(
    checkProperty(validate.errors, "dependencies", "ActivityDepthHeightUnit"),
    true,
  );
});
test("Should accept ActivityDepthHeightMeasure AND ActivityDepthHeightUnit", async (t) => {
  const valid = validate({
    ActivityDepthHeightMeasure: true,
    ActivityDepthHeightUnit: true,
  });
  assert.equal(valid, false);
  assert.equal(
    checkProperty(validate.errors, "dependencies", "ActivityDepthHeightUnit"),
    false,
  );
});

test("Should reject ResultValue AND NOT ResultUnit", async (t) => {
  const valid = validate({
    ResultValue: true,
  });
  assert.equal(valid, false);
  assert.equal(checkProperty(validate.errors, "dependencies", "ResultUnit"), true);
});
test("Should reject ResultValue AND ResultUnit", async (t) => {
  const valid = validate({
    ResultValue: true,
    ResultUnit: true,
  });
  assert.equal(valid, false);
  assert.equal(checkProperty(validate.errors, "dependencies", "ResultUnit"), false);
});

test("Should reject ResultDetectionQuantitationLimitMeasure AND NOT ResultDetectionQuantitationLimit{Unit,Type}", async (t) => {
  const valid = validate({
    ResultDetectionQuantitationLimitMeasure: true,
  });
  assert.equal(valid, false);
  assert.equal(
    checkProperty(
      validate.errors,
      "dependencies",
      "ResultDetectionQuantitationLimitUnit",
    ),
    true,
  );
  assert.equal(
    checkProperty(
      validate.errors,
      "dependencies",
      "ResultDetectionQuantitationLimitType",
    ),
    true,
  );
});
test("Should accept ResultDetectionQuantitationLimitMeasure AND ResultDetectionQuantitationLimit{Unit,Type}", async (t) => {
  const valid = validate({
    ResultDetectionQuantitationLimitMeasure: true,
    ResultDetectionQuantitationLimitUnit: true,
    ResultDetectionQuantitationLimitType: true,
  });
  assert.equal(valid, false);
  assert.equal(
    checkProperty(
      validate.errors,
      "dependencies",
      "ResultDetectionQuantitationLimitUnit",
    ),
    false,
  );
  assert.equal(
    checkProperty(
      validate.errors,
      "dependencies",
      "ResultDetectionQuantitationLimitType",
    ),
    false,
  );
});

test("Should accept AnalysisStartTime AND NOT AnalysisStartTimeZone (no longer an error; warning only)", async (t) => {
  const valid = validate({
    AnalysisStartTime: true,
  });
  assert.equal(
    checkProperty(validate.errors, "dependencies", "AnalysisStartTimeZone"),
    false,
  );
});

test("Should reject AnalysisStartTimeZone AND NOT AnalysisStartTime", async (t) => {
  const valid = validate({
    AnalysisStartTimeZone: true,
  });
  assert.equal(valid, false);
  assert.equal(
    checkProperty(validate.errors, "dependencies", "AnalysisStartTime"),
    true,
  );
});

test("Should accept AnalysisStartTime AND AnalysisStartTimeZone", async (t) => {
  const valid = validate({
    AnalysisStartTime: true,
    AnalysisStartTimeZone: true,
  });
  assert.equal(valid, false);
  assert.equal(
    checkProperty(validate.errors, "dependencies", "AnalysisStartTimeZone"),
    false,
  );
});

// Groundwater-related dependency tests

test("Should reject MonitoringLocationVerticalMeasure AND NOT MonitoringLocationVerticalUnit", async (t) => {
  const valid = validate({
    MonitoringLocationVerticalMeasure: true,
  });
  assert.equal(valid, false);
  assert.equal(
    checkProperty(
      validate.errors,
      "dependencies",
      "MonitoringLocationVerticalUnit",
    ),
    true,
  );
});
test("Should accept MonitoringLocationVerticalMeasure AND MonitoringLocationVerticalUnit", async (t) => {
  const valid = validate({
    MonitoringLocationVerticalMeasure: true,
    MonitoringLocationVerticalUnit: true,
  });
  assert.equal(valid, false);
  assert.equal(
    checkProperty(
      validate.errors,
      "dependencies",
      "MonitoringLocationVerticalUnit",
    ),
    false,
  );
});

test("Should reject MonitoringLocationVerticalMeasure AND NOT MonitoringLocationVerticalCollectionMethod", async (t) => {
  const valid = validate({
    MonitoringLocationVerticalMeasure: true,
  });
  assert.equal(valid, false);
  assert.equal(
    checkProperty(
      validate.errors,
      "dependencies",
      "MonitoringLocationVerticalCollectionMethod",
    ),
    true,
  );
});
test("Should accept MonitoringLocationVerticalMeasure AND MonitoringLocationVerticalCollectionMethod", async (t) => {
  const valid = validate({
    MonitoringLocationVerticalMeasure: true,
    MonitoringLocationVerticalCollectionMethod: true,
  });
  assert.equal(valid, false);
  assert.equal(
    checkProperty(
      validate.errors,
      "dependencies",
      "MonitoringLocationVerticalCollectionMethod",
    ),
    false,
  );
});

test("Should reject MonitoringLocationVerticalMeasure AND NOT MonitoringLocationVerticalCoordinateReferenceSystem", async (t) => {
  const valid = validate({
    MonitoringLocationVerticalMeasure: true,
  });
  assert.equal(valid, false);
  assert.equal(
    checkProperty(
      validate.errors,
      "dependencies",
      "MonitoringLocationVerticalCoordinateReferenceSystem",
    ),
    true,
  );
});
test("Should accept MonitoringLocationVerticalMeasure AND MonitoringLocationVerticalCoordinateReferenceSystem", async (t) => {
  const valid = validate({
    MonitoringLocationVerticalMeasure: true,
    MonitoringLocationVerticalCoordinateReferenceSystem: true,
  });
  assert.equal(valid, false);
  assert.equal(
    checkProperty(
      validate.errors,
      "dependencies",
      "MonitoringLocationVerticalCoordinateReferenceSystem",
    ),
    false,
  );
});

test("Should reject MonitoringLocationVerticalAccuracyMeasure AND NOT MonitoringLocationVerticalAccuracyUnit", async (t) => {
  const valid = validate({
    MonitoringLocationVerticalAccuracyMeasure: true,
  });
  assert.equal(valid, false);
  assert.equal(
    checkProperty(
      validate.errors,
      "dependencies",
      "MonitoringLocationVerticalAccuracyUnit",
    ),
    true,
  );
});
test("Should accept MonitoringLocationVerticalAccuracyMeasure AND MonitoringLocationVerticalAccuracyUnit", async (t) => {
  const valid = validate({
    MonitoringLocationVerticalAccuracyMeasure: true,
    MonitoringLocationVerticalAccuracyUnit: true,
  });
  assert.equal(valid, false);
  assert.equal(
    checkProperty(
      validate.errors,
      "dependencies",
      "MonitoringLocationVerticalAccuracyUnit",
    ),
    false,
  );
});

test("Should reject WellID AND NOT WellIDContext", async (t) => {
  const valid = validate({
    WellID: true,
  });
  assert.equal(valid, false);
  assert.equal(checkProperty(validate.errors, "dependencies", "WellIDContext"), true);
});
test("Should accept WellID AND WellIDContext", async (t) => {
  const valid = validate({
    WellID: true,
    WellIDContext: true,
  });
  assert.equal(valid, false);
  assert.equal(checkProperty(validate.errors, "dependencies", "WellIDContext"), false);
});

test("Should reject BoreholeDepthMeasure AND NOT BoreholeDepthUnit", async (t) => {
  const valid = validate({
    BoreholeDepthMeasure: true,
  });
  assert.equal(valid, false);
  assert.equal(
    checkProperty(validate.errors, "dependencies", "BoreholeDepthUnit"),
    true,
  );
});
test("Should accept BoreholeDepthMeasure AND BoreholeDepthUnit", async (t) => {
  const valid = validate({
    BoreholeDepthMeasure: true,
    BoreholeDepthUnit: true,
  });
  assert.equal(valid, false);
  assert.equal(
    checkProperty(validate.errors, "dependencies", "BoreholeDepthUnit"),
    false,
  );
});

test("Should reject WellDepthMeasure AND NOT WellDepthUnit", async (t) => {
  const valid = validate({
    WellDepthMeasure: true,
  });
  assert.equal(valid, false);
  assert.equal(checkProperty(validate.errors, "dependencies", "WellDepthUnit"), true);
});
test("Should accept WellDepthMeasure AND WellDepthUnit", async (t) => {
  const valid = validate({
    WellDepthMeasure: true,
    WellDepthUnit: true,
  });
  assert.equal(valid, false);
  assert.equal(checkProperty(validate.errors, "dependencies", "WellDepthUnit"), false);
});

test("Should reject WellOpenIntervalTopMeasure AND NOT WellOpenIntervalTopUnit", async (t) => {
  const valid = validate({
    WellOpenIntervalTopMeasure: true,
  });
  assert.equal(valid, false);
  assert.equal(
    checkProperty(validate.errors, "dependencies", "WellOpenIntervalTopUnit"),
    true,
  );
});
test("Should accept WellOpenIntervalTopMeasure AND WellOpenIntervalTopUnit", async (t) => {
  const valid = validate({
    WellOpenIntervalTopMeasure: true,
    WellOpenIntervalTopUnit: true,
  });
  assert.equal(valid, false);
  assert.equal(
    checkProperty(validate.errors, "dependencies", "WellOpenIntervalTopUnit"),
    false,
  );
});

test("Should reject WellOpenIntervalBottomMeasure AND NOT WellOpenIntervalBottomUnit", async (t) => {
  const valid = validate({
    WellOpenIntervalBottomMeasure: true,
  });
  assert.equal(valid, false);
  assert.equal(
    checkProperty(
      validate.errors,
      "dependencies",
      "WellOpenIntervalBottomUnit",
    ),
    true,
  );
});
test("Should accept WellOpenIntervalBottomMeasure AND WellOpenIntervalBottomUnit", async (t) => {
  const valid = validate({
    WellOpenIntervalBottomMeasure: true,
    WellOpenIntervalBottomUnit: true,
  });
  assert.equal(valid, false);
  assert.equal(
    checkProperty(
      validate.errors,
      "dependencies",
      "WellOpenIntervalBottomUnit",
    ),
    false,
  );
});

test("Should reject ActivityDepthAltitudeReferencePointMeasure AND NOT ActivityDepthAltitudeReferencePointUnit", async (t) => {
  const valid = validate({
    ActivityDepthAltitudeReferencePointMeasure: true,
  });
  assert.equal(valid, false);
  assert.equal(
    checkProperty(
      validate.errors,
      "dependencies",
      "ActivityDepthAltitudeReferencePointUnit",
    ),
    true,
  );
});
test("Should accept ActivityDepthAltitudeReferencePointMeasure AND ActivityDepthAltitudeReferencePointUnit", async (t) => {
  const valid = validate({
    ActivityDepthAltitudeReferencePointMeasure: true,
    ActivityDepthAltitudeReferencePointUnit: true,
  });
  assert.equal(valid, false);
  assert.equal(
    checkProperty(
      validate.errors,
      "dependencies",
      "ActivityDepthAltitudeReferencePointUnit",
    ),
    false,
  );
});

test("Should reject SampleCollectionMethodID AND NOT SampleCollectionMethodContext", async (t) => {
  const valid = validate({
    SampleCollectionMethodID: true,
  });
  assert.equal(valid, false);
  assert.equal(
    checkProperty(
      validate.errors,
      "dependencies",
      "SampleCollectionMethodContext",
    ),
    true,
  );
});
test("Should accept SampleCollectionMethodID AND SampleCollectionMethodContext", async (t) => {
  const valid = validate({
    SampleCollectionMethodID: true,
    SampleCollectionMethodContext: true,
  });
  assert.equal(valid, false);
  assert.equal(
    checkProperty(
      validate.errors,
      "dependencies",
      "SampleCollectionMethodContext",
    ),
    false,
  );
});
