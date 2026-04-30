import { test } from "node:test";
import assert from "node:assert/strict";
import validate from "../frontend/index.js";
import validateStrict from "../extract/index.js";
import validateBackend from "../backend/index.js";

const checkProperty = (errors, keyword, property) => {
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
    } else if (keyword === "maxLength" && error.instancePath.includes(property)) {
      return true;
    } else if (keyword === "pattern") return true;
  }
  return false;
};

test("Should accept strings", async (t) => {
  validate({
    DatasetName: "qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM:/.,-'\"",
    MonitoringLocationID: "1234567890 W̱E¸NÁ¸NEĆ",
    MonitoringLocationName: "ÀàäÄÂâÆæÇçÈèÉéÊêËëÎîÏïÔôŒœÙùÛûÜü",
  });
  assert.equal(checkProperty(validate.errors, "pattern", "DatasetName"), false);
  assert.equal(
    checkProperty(validate.errors, "pattern", "MonitoringLocationID"),
    false,
  );
  assert.equal(
    checkProperty(validate.errors, "pattern", "MonitoringLocationName"),
    false,
  );
});

test("Should reject strings with multiline", async (t) => {
  validate({
    DatasetName: `qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM:/.,-'\"
    1234`,
    MonitoringLocationID: `qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM:/.,-'\"
    1234`,
    MonitoringLocationName: `French: ÀàäÄÂâÆæÇçÈèÉéÊêËëÎîÏïÔôŒœÙùÛûÜü
    Numbers: 1234567890`,
    ResultAnalyticalMethodID: `qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM:/.,-'\"
    1234`,
    ResultAnalyticalMethodName: `qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM:/.,-'\"
    1234`,
    LaboratoryName: `qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM:/.,-'\"
    1234`,
    LaboratorySampleID: `qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM:/.,-'\"
    1234`,
  });

  assert.equal(checkProperty(validate.errors, "pattern", "DatasetName"), true);
  assert.equal(
    checkProperty(validate.errors, "pattern", "MonitoringLocationID"),
    true,
  );
  assert.equal(
    checkProperty(validate.errors, "pattern", "MonitoringLocationName"),
    true,
  );
  assert.equal(
    checkProperty(validate.errors, "pattern", "ResultAnalyticalMethodID"),
    true,
  );
  assert.equal(
    checkProperty(validate.errors, "pattern", "ResultAnalyticalMethodName"),
    true,
  );
  assert.equal(
    checkProperty(validate.errors, "pattern", "LaboratoryName"),
    true,
  );
  assert.equal(
    checkProperty(validate.errors, "pattern", "LaboratorySampleID"),
    true,
  );
});

test("Should accept strings-multiline", async (t) => {
  validate({
    ResultComment: `English: qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM
    French: ÀàäÄÂâÆæÇçÈèÉéÊêËëÎîÏïÔôŒœÙùÛûÜü
    Numbers: 1234567890
    Symbols: ~!@#$%^&*()_+-={}|[]\\:";'<>?,./
    Other: W̱E¸NÁ¸NEĆ
    `,
  });
  assert.equal(checkProperty(validate.errors, "pattern", "ResultComment"), false);
});

// TODO update to included strict and loose time format
test("Should accept time formats", async (t) => {
  validate({
    ActivityStartTime: "9:15:00",
    ActivityEndTime: "13:15:00.000",
    AnalysisStartTime: "0:15",
  });
  assert.equal(checkProperty(validate.errors, "pattern", "ActivityStartTime"), false);
  assert.equal(checkProperty(validate.errors, "pattern", "ActivityEndTime"), false);
  assert.equal(checkProperty(validate.errors, "pattern", "AnalysisStartTime"), false);
});

test("Should reject time formats", async (t) => {
  validate({
    ActivityStartTime: "9:15.00",
    ActivityEndTime: "13:15.00.000",
    AnalysisStartTime: "2.15",
  });
  assert.equal(checkProperty(validate.errors, "pattern", "ActivityStartTime"), true);
  assert.equal(checkProperty(validate.errors, "pattern", "ActivityEndTime"), true);
  assert.equal(checkProperty(validate.errors, "pattern", "AnalysisStartTime"), true);

  validate({
    ActivityStartTime: "0:15",
    ActivityEndTime: "!0:15",
    // 'AnalysisStartTime': '2.15'
  });
  assert.equal(checkProperty(validate.errors, "pattern", "ActivityStartTime"), true);
  assert.equal(checkProperty(validate.errors, "pattern", "ActivityEndTime"), true);
  // assert.equal(checkProperty(validate.errors, 'pattern', 'AnalysisStartTime'), true)
});

test("Should accept timezone formats (strict)", async (t) => {
  let valid = validateStrict({
    ActivityStartTimeZone: "Z",
    ActivityEndTimeZone: "Z",
    AnalysisStartTimeZone: "Z",
  });
  assert.equal(valid, false);
  assert.equal(
    validateStrict.errors.filter(
      (i) => i.instancePath === "/ActivityStartTimeZone",
    ).length,
    0,
  );
  assert.equal(
    validateStrict.errors.filter(
      (i) => i.instancePath === "/ActivityEndTimeZone",
    ).length,
    0,
  );
  assert.equal(
    validateStrict.errors.filter(
      (i) => i.instancePath === "/AnalysisStartTimeZone",
    ).length,
    0,
  );

  valid = validateStrict({
    ActivityStartTimeZone: "+02:15",
    ActivityEndTimeZone: "+02:15",
    AnalysisStartTimeZone: "+02:15",
  });
  assert.equal(valid, false);
  assert.equal(
    validateStrict.errors.filter(
      (i) => i.instancePath === "/ActivityStartTimeZone",
    ).length,
    0,
  );
  assert.equal(
    validateStrict.errors.filter(
      (i) => i.instancePath === "/ActivityEndTimeZone",
    ).length,
    0,
  );
  assert.equal(
    validateStrict.errors.filter(
      (i) => i.instancePath === "/AnalysisStartTimeZone",
    ).length,
    0,
  );

  valid = validateStrict({
    ActivityStartTimeZone: "-02:15",
    ActivityEndTimeZone: "-02:15",
    AnalysisStartTimeZone: "-02:15",
  });
  assert.equal(valid, false);
  assert.equal(
    validateStrict.errors.filter(
      (i) => i.instancePath === "/ActivityStartTimeZone",
    ).length,
    0,
  );
  assert.equal(
    validateStrict.errors.filter(
      (i) => i.instancePath === "/ActivityEndTimeZone",
    ).length,
    0,
  );
  assert.equal(
    validateStrict.errors.filter(
      (i) => i.instancePath === "/AnalysisStartTimeZone",
    ).length,
    0,
  );
});

test("Should reject timezone formats (strict)", async (t) => {
  let valid = validateStrict({
    ActivityStartTimeZone: "z",
    ActivityEndTimeZone: "z",
    AnalysisStartTimeZone: "z",
  });
  assert.equal(valid, false);
  assert.equal(
    validateStrict.errors.filter(
      (i) => i.instancePath === "/ActivityStartTimeZone",
    ).length,
    1,
  );
  assert.equal(
    validateStrict.errors.filter(
      (i) => i.instancePath === "/ActivityEndTimeZone",
    ).length,
    1,
  );
  assert.equal(
    validateStrict.errors.filter(
      (i) => i.instancePath === "/AnalysisStartTimeZone",
    ).length,
    1,
  );

  valid = validateStrict({
    ActivityStartTimeZone: "9:45",
    ActivityEndTimeZone: "9:45",
    AnalysisStartTimeZone: "9:45",
  });
  assert.equal(valid, false);
  assert.equal(
    validateStrict.errors.filter(
      (i) => i.instancePath === "/ActivityStartTimeZone",
    ).length,
    1,
  );
  assert.equal(
    validateStrict.errors.filter(
      (i) => i.instancePath === "/ActivityEndTimeZone",
    ).length,
    1,
  );
  assert.equal(
    validateStrict.errors.filter(
      (i) => i.instancePath === "/AnalysisStartTimeZone",
    ).length,
    1,
  );

  valid = validateStrict({
    ActivityStartTimeZone: "-00:00:00",
    ActivityEndTimeZone: "-00:00:00",
    AnalysisStartTimeZone: "-00:00:00",
  });
  assert.equal(valid, false);
  assert.equal(
    validateStrict.errors.filter(
      (i) => i.instancePath === "/ActivityStartTimeZone",
    ).length,
    2,
  );
  assert.equal(
    validateStrict.errors.filter(
      (i) => i.instancePath === "/ActivityEndTimeZone",
    ).length,
    2,
  );
  assert.equal(
    validateStrict.errors.filter(
      (i) => i.instancePath === "/AnalysisStartTimeZone",
    ).length,
    2,
  );

  valid = validateStrict({
    ActivityStartTimeZone: "-0215",
    ActivityEndTimeZone: "-0215",
    AnalysisStartTimeZone: "-0215",
  });
  assert.equal(valid, false);
  assert.equal(
    validateStrict.errors.filter(
      (i) => i.instancePath === "/ActivityStartTimeZone",
    ).length,
    1,
  );
  assert.equal(
    validateStrict.errors.filter(
      (i) => i.instancePath === "/ActivityEndTimeZone",
    ).length,
    1,
  );
  assert.equal(
    validateStrict.errors.filter(
      (i) => i.instancePath === "/AnalysisStartTimeZone",
    ).length,
    1,
  );

  valid = validateStrict({
    ActivityStartTimeZone: "-215",
    ActivityEndTimeZone: "-215",
    AnalysisStartTimeZone: "-215",
  });
  assert.equal(valid, false);
  assert.equal(
    validateStrict.errors.filter(
      (i) => i.instancePath === "/ActivityStartTimeZone",
    ).length,
    1,
  );
  assert.equal(
    validateStrict.errors.filter(
      (i) => i.instancePath === "/ActivityEndTimeZone",
    ).length,
    1,
  );
  assert.equal(
    validateStrict.errors.filter(
      (i) => i.instancePath === "/AnalysisStartTimeZone",
    ).length,
    1,
  );

  valid = validateStrict({
    ActivityStartTimeZone: "-2:15",
    ActivityEndTimeZone: "-2:15",
    AnalysisStartTimeZone: "-2:15",
  });
  assert.equal(valid, false);
  assert.equal(
    validateStrict.errors.filter(
      (i) => i.instancePath === "/ActivityStartTimeZone",
    ).length,
    1,
  );
  assert.equal(
    validateStrict.errors.filter(
      (i) => i.instancePath === "/ActivityEndTimeZone",
    ).length,
    1,
  );
  assert.equal(
    validateStrict.errors.filter(
      (i) => i.instancePath === "/AnalysisStartTimeZone",
    ).length,
    1,
  );
});

test("Should accept timezone formats (loose)", async (t) => {
  let valid = validateBackend({
    ActivityStartTimeZone: "Z",
    ActivityEndTimeZone: "Z",
    AnalysisStartTimeZone: "Z",
  });
  assert.equal(valid, true);
  assert.equal(validateBackend.errors, null);

  valid = validateBackend({
    ActivityStartTimeZone: "+02:15",
    ActivityEndTimeZone: "+02:15",
    AnalysisStartTimeZone: "+02:15",
  });
  assert.equal(valid, true);
  assert.equal(validateBackend.errors, null);

  valid = validateBackend({
    ActivityStartTimeZone: "-02:15",
    ActivityEndTimeZone: "-02:15",
    AnalysisStartTimeZone: "-02:15",
  });
  assert.equal(valid, true);
  assert.equal(validateBackend.errors, null);

  valid = validateBackend({
    ActivityStartTimeZone: "-0215",
    ActivityEndTimeZone: "-0215",
    AnalysisStartTimeZone: "-0215",
  });
  assert.equal(valid, true);
  assert.equal(validateBackend.errors, null);

  valid = validateBackend({
    ActivityStartTimeZone: "-215",
    ActivityEndTimeZone: "-215",
    AnalysisStartTimeZone: "-215",
  });
  assert.equal(valid, true);
  assert.equal(validateBackend.errors, null);

  valid = validateBackend({
    ActivityStartTimeZone: "-2:15",
    ActivityEndTimeZone: "-2:15",
    AnalysisStartTimeZone: "-2:15",
  });
  assert.equal(valid, true);
  assert.equal(validateBackend.errors, null);
});

test("Should reject timezone formats (loose)", async (t) => {
  let valid = validateBackend({
    ActivityStartTimeZone: "z",
    ActivityEndTimeZone: "z",
    AnalysisStartTimeZone: "z",
  });
  assert.equal(valid, false);
  assert.equal(
    validateBackend.errors.filter(
      (i) => i.instancePath === "/ActivityStartTimeZone",
    ).length,
    1,
  );
  assert.equal(
    validateBackend.errors.filter(
      (i) => i.instancePath === "/ActivityEndTimeZone",
    ).length,
    1,
  );
  assert.equal(
    validateBackend.errors.filter(
      (i) => i.instancePath === "/AnalysisStartTimeZone",
    ).length,
    1,
  );

  valid = validateBackend({
    ActivityStartTimeZone: "9:45",
    ActivityEndTimeZone: "9:45",
    AnalysisStartTimeZone: "9:45",
  });
  assert.equal(valid, false);
  assert.equal(
    validateBackend.errors.filter(
      (i) => i.instancePath === "/ActivityStartTimeZone",
    ).length,
    1,
  );
  assert.equal(
    validateBackend.errors.filter(
      (i) => i.instancePath === "/ActivityEndTimeZone",
    ).length,
    1,
  );
  assert.equal(
    validateBackend.errors.filter(
      (i) => i.instancePath === "/AnalysisStartTimeZone",
    ).length,
    1,
  );

  valid = validateBackend({
    ActivityStartTimeZone: "-00:00:00",
    ActivityEndTimeZone: "-00:00:00",
    AnalysisStartTimeZone: "-00:00:00",
  });
  assert.equal(valid, false);
  assert.equal(
    validateBackend.errors.filter(
      (i) => i.instancePath === "/ActivityStartTimeZone",
    ).length,
    2,
  );
  assert.equal(
    validateBackend.errors.filter(
      (i) => i.instancePath === "/ActivityEndTimeZone",
    ).length,
    2,
  );
  assert.equal(
    validateBackend.errors.filter(
      (i) => i.instancePath === "/AnalysisStartTimeZone",
    ).length,
    2,
  );
});

test("Should pass CSV Injection check", async (t) => {
  validate({
    ResultComment: "Bar River",
  });
  assert.equal(checkProperty(validate.errors, "pattern", "ResultComment"), false);
});

test("Should reject CSV Injection check when leading space", async (t) => {
  validate({
    ResultComment: " test",
  });
  assert.equal(checkProperty(validate.errors, "pattern", "ResultComment"), true);
});

test("Should reject CSV Injection check when leading caragereturn", async (t) => {
  validate({
    ResultComment: "\rtest",
  });
  assert.equal(checkProperty(validate.errors, "pattern", "ResultComment"), true);
});

test("Should reject CSV Injection check when leading newline", async (t) => {
  validate({
    ResultComment: "\ntest",
  });
  assert.equal(checkProperty(validate.errors, "pattern", "ResultComment"), true);
});

test("Should reject CSV Injection check when leading tab", async (t) => {
  validate({
    ResultComment: "\ttest",
  });
  assert.equal(checkProperty(validate.errors, "pattern", "ResultComment"), true);
});

test("Should reject CSV Injection check when leading =", async (t) => {
  validate({
    ResultComment: "=test",
  });
  assert.equal(checkProperty(validate.errors, "pattern", "ResultComment"), true);
});

test("Should reject CSV Injection check when leading +", async (t) => {
  validate({
    ResultComment: "+test",
  });
  assert.equal(checkProperty(validate.errors, "pattern", "ResultComment"), true);
});

test("Should reject CSV Injection check when leading -", async (t) => {
  validate({
    ResultComment: "-test",
  });
  assert.equal(checkProperty(validate.errors, "pattern", "ResultComment"), true);
});

test("Should reject CSV Injection check when leading @", async (t) => {
  validate({
    ResultComment: "@test",
  });
  assert.equal(checkProperty(validate.errors, "pattern", "ResultComment"), true);
});

test("Should reject CSV Injection check when leading null char", async (t) => {
  validate({
    ResultComment: "\x00test",
  });
  assert.equal(checkProperty(validate.errors, "pattern", "ResultComment"), true);
});

// *** Range constraints — GW measure fields *** //
test("Should reject BoreholeDepthMeasure > 0", async (t) => {
  validate({ BoreholeDepthMeasure: 1, BoreholeDepthUnit: "m" });
  assert.equal(checkProperty(validate.errors, "maximum", "BoreholeDepthMeasure"), true);
});
test("Should accept BoreholeDepthMeasure <= 0", async (t) => {
  validate({ BoreholeDepthMeasure: -10, BoreholeDepthUnit: "m" });
  assert.equal(checkProperty(validate.errors, "maximum", "BoreholeDepthMeasure"), false);
});

test("Should reject WellDepthMeasure > 0", async (t) => {
  validate({ WellDepthMeasure: 1, WellDepthUnit: "m" });
  assert.equal(checkProperty(validate.errors, "maximum", "WellDepthMeasure"), true);
});
test("Should accept WellDepthMeasure <= 0", async (t) => {
  validate({ WellDepthMeasure: -10, WellDepthUnit: "m" });
  assert.equal(checkProperty(validate.errors, "maximum", "WellDepthMeasure"), false);
});

test("Should reject WellOpenIntervalTopMeasure > 0", async (t) => {
  validate({ WellOpenIntervalTopMeasure: 1, WellOpenIntervalTopUnit: "m" });
  assert.equal(checkProperty(validate.errors, "maximum", "WellOpenIntervalTopMeasure"), true);
});
test("Should accept WellOpenIntervalTopMeasure <= 0", async (t) => {
  validate({ WellOpenIntervalTopMeasure: -5, WellOpenIntervalTopUnit: "m" });
  assert.equal(checkProperty(validate.errors, "maximum", "WellOpenIntervalTopMeasure"), false);
});

test("Should reject WellOpenIntervalBottomMeasure > 0", async (t) => {
  validate({ WellOpenIntervalBottomMeasure: 1, WellOpenIntervalBottomUnit: "m" });
  assert.equal(checkProperty(validate.errors, "maximum", "WellOpenIntervalBottomMeasure"), true);
});
test("Should accept WellOpenIntervalBottomMeasure <= 0", async (t) => {
  validate({ WellOpenIntervalBottomMeasure: -10, WellOpenIntervalBottomUnit: "m" });
  assert.equal(checkProperty(validate.errors, "maximum", "WellOpenIntervalBottomMeasure"), false);
});

test("Should reject MonitoringLocationVerticalAccuracyMeasure < 0", async (t) => {
  validate({ MonitoringLocationVerticalAccuracyMeasure: -1, MonitoringLocationVerticalAccuracyUnit: "m" });
  assert.equal(checkProperty(validate.errors, "minimum", "MonitoringLocationVerticalAccuracyMeasure"), true);
});
test("Should accept MonitoringLocationVerticalAccuracyMeasure >= 0", async (t) => {
  validate({ MonitoringLocationVerticalAccuracyMeasure: 5, MonitoringLocationVerticalAccuracyUnit: "m" });
  assert.equal(checkProperty(validate.errors, "minimum", "MonitoringLocationVerticalAccuracyMeasure"), false);
});

test("Should reject ActivityDepthAltitudeReferencePointMeasure < 0", async (t) => {
  validate({ ActivityDepthAltitudeReferencePointMeasure: -1, ActivityDepthAltitudeReferencePointUnit: "m" });
  assert.equal(checkProperty(validate.errors, "minimum", "ActivityDepthAltitudeReferencePointMeasure"), true);
});
test("Should accept ActivityDepthAltitudeReferencePointMeasure >= 0", async (t) => {
  validate({ ActivityDepthAltitudeReferencePointMeasure: 5, ActivityDepthAltitudeReferencePointUnit: "m" });
  assert.equal(checkProperty(validate.errors, "minimum", "ActivityDepthAltitudeReferencePointMeasure"), false);
});

// *** Length constraints — GW text fields *** //
test("Should reject AquiferCode > 10 chars", async (t) => {
  validate({ AquiferCode: "12345678901" });
  assert.equal(checkProperty(validate.errors, "maxLength", "AquiferCode"), true);
});
test("Should accept AquiferCode <= 10 chars", async (t) => {
  validate({ AquiferCode: "1234567890" });
  assert.equal(checkProperty(validate.errors, "maxLength", "AquiferCode"), false);
});

test("Should reject WellID > 55 chars", async (t) => {
  validate({ WellID: "x".repeat(56) });
  assert.equal(checkProperty(validate.errors, "maxLength", "WellID"), true);
});
test("Should accept WellID <= 55 chars", async (t) => {
  validate({ WellID: "x".repeat(55) });
  assert.equal(checkProperty(validate.errors, "maxLength", "WellID"), false);
});

test("Should reject SampleCollectionMethodName > 300 chars", async (t) => {
  validate({ SampleCollectionMethodName: "x".repeat(301) });
  assert.equal(checkProperty(validate.errors, "maxLength", "SampleCollectionMethodName"), true);
});
test("Should accept SampleCollectionMethodName <= 300 chars", async (t) => {
  validate({ SampleCollectionMethodName: "x".repeat(300) });
  assert.equal(checkProperty(validate.errors, "maxLength", "SampleCollectionMethodName"), false);
});

test("Should reject SampleCollectionMethodID > 50 chars", async (t) => {
  validate({ SampleCollectionMethodID: "x".repeat(51) });
  assert.equal(checkProperty(validate.errors, "maxLength", "SampleCollectionMethodID"), true);
});
test("Should accept SampleCollectionMethodID <= 50 chars", async (t) => {
  validate({ SampleCollectionMethodID: "x".repeat(50) });
  assert.equal(checkProperty(validate.errors, "maxLength", "SampleCollectionMethodID"), false);
});
