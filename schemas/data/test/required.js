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

test("Should not set any defaults", async (t) => {
  const data = {};
  const valid = validate(data);
  t.false(valid);
  t.deepEqual(data, {});
});

test("Should require properties", async (t) => {
  const valid = validate({});
  t.is(valid, false);

  // #/allOf/0
  t.is(checkProperty(validate.errors, "required", "DatasetName"), true);
  t.is(
    checkProperty(validate.errors, "required", "MonitoringLocationID"),
    true,
  );
  t.is(
    checkProperty(validate.errors, "required", "MonitoringLocationName"),
    true,
  );
  t.is(
    checkProperty(validate.errors, "required", "MonitoringLocationType"),
    true,
  );
  t.is(
    checkProperty(validate.errors, "required", "MonitoringLocationLatitude"),
    true,
  );
  t.is(
    checkProperty(validate.errors, "required", "MonitoringLocationLongitude"),
    true,
  );
  t.is(
    checkProperty(
      validate.errors,
      "required",
      "MonitoringLocationHorizontalCoordinateReferenceSystem",
    ),
    true,
  );
  t.is(checkProperty(validate.errors, "required", "ActivityType"), true);
  t.is(checkProperty(validate.errors, "required", "ActivityMediaName"), true);
  t.is(checkProperty(validate.errors, "required", "ActivityStartDate"), true);
  t.is(checkProperty(validate.errors, "required", "CharacteristicName"), true);
  t.is(checkProperty(validate.errors, "required", "ResultValueType"), true);
});

test("Should not require properties", async (t) => {
  const valid = validate({
    DatasetName: "Test",
    MonitoringLocationID: "A1",
    MonitoringLocationName: "A1 Test",
    MonitoringLocationLatitude: "51.0486",
    MonitoringLocationLongitude: "-114.0708",
    MonitoringLocationHorizontalCoordinateReferenceSystem: "AMSMA",
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
  t.is(valid, true);
});

test("Should reject additional headers", async (t) => {
  const valid = validate({
    MonitoringLocationWaterBody: "Lake",
  });
  t.is(valid, false);
  t.is(
    checkProperty(
      validate.errors,
      "additionalProperties",
      "MonitoringLocationWaterBody",
    ),
    true,
  );
});

test("Should reject ActivityDepthHeightMeasure AND NOT ActivityDepthHeightUnit", async (t) => {
  const valid = validate({
    ActivityDepthHeightMeasure: true,
  });
  t.is(valid, false);
  t.is(
    checkProperty(validate.errors, "dependencies", "ActivityDepthHeightUnit"),
    true,
  );
});
test("Should accept ActivityDepthHeightMeasure AND ActivityDepthHeightUnit", async (t) => {
  const valid = validate({
    ActivityDepthHeightMeasure: true,
    ActivityDepthHeightUnit: true,
  });
  t.is(valid, false);
  t.is(
    checkProperty(validate.errors, "dependencies", "ActivityDepthHeightUnit"),
    false,
  );
});

test("Should reject ResultValue AND NOT ResultUnit", async (t) => {
  const valid = validate({
    ResultValue: true,
  });
  t.is(valid, false);
  t.is(checkProperty(validate.errors, "dependencies", "ResultUnit"), true);
});
test("Should reject ResultValue AND ResultUnit", async (t) => {
  const valid = validate({
    ResultValue: true,
    ResultUnit: true,
  });
  t.is(valid, false);
  t.is(checkProperty(validate.errors, "dependencies", "ResultUnit"), false);
});

test("Should reject ResultDetectionQuantitationLimitMeasure AND NOT ResultDetectionQuantitationLimit{Unit,Type}", async (t) => {
  const valid = validate({
    ResultDetectionQuantitationLimitMeasure: true,
  });
  t.is(valid, false);
  t.is(
    checkProperty(
      validate.errors,
      "dependencies",
      "ResultDetectionQuantitationLimitUnit",
    ),
    true,
  );
  t.is(
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
  t.is(valid, false);
  t.is(
    checkProperty(
      validate.errors,
      "dependencies",
      "ResultDetectionQuantitationLimitUnit",
    ),
    false,
  );
  t.is(
    checkProperty(
      validate.errors,
      "dependencies",
      "ResultDetectionQuantitationLimitType",
    ),
    false,
  );
});

test("Should reject AnalysisStartTime AND NOT AnalysisStartTimeZone", async (t) => {
  const valid = validate({
    AnalysisStartTime: true,
  });
  t.false(valid);
  t.is(
    checkProperty(validate.errors, "dependencies", "AnalysisStartTimeZone"),
    true,
  );
});

test("Should accept AnalysisStartTime AND AnalysisStartTimeZone", async (t) => {
  const valid = validate({
    AnalysisStartTime: true,
    AnalysisStartTimeZone: true,
  });
  t.false(valid);
  t.is(
    checkProperty(validate.errors, "dependencies", "AnalysisStartTimeZone"),
    false,
  );
});
