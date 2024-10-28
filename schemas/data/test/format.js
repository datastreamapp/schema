import test from "ava";

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
    } else if (keyword === "pattern") return true;
  }
  return false;
};

test("Should accept strings", async (t) => {
  validate({
    DatasetName: "qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM:/.,-'\"",
    MonitoringLocationID: "1234567890",
    MonitoringLocationName: "ÀàäÄÂâÆæÇçÈèÉéÊêËëÎîÏïÔôŒœÙùÛûÜü",
  });
  t.is(checkProperty(validate.errors, "pattern", "DatasetName"), false);
  t.is(
    checkProperty(validate.errors, "pattern", "MonitoringLocationID"),
    false,
  );
  t.is(
    checkProperty(validate.errors, "pattern", "MonitoringLocationName"),
    false,
  );
});

test("Should accept strings-multiline", async (t) => {
  validate({
    ResultComment: `English: qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM
    French: ÀàäÄÂâÆæÇçÈèÉéÊêËëÎîÏïÔôŒœÙùÛûÜü
    Numbers: 1234567890
    Symbols: ~!@#$%^&*()_+-={}|[]\\:";'<>?,./
    `,
  });
  t.is(checkProperty(validate.errors, "pattern", "ResultComment"), false);
});

// TODO update to included strict and loose time format
test("Should accept time formats", async (t) => {
  validate({
    ActivityStartTime: "9:15:00",
    ActivityEndTime: "13:15:00.000",
    AnalysisStartTime: "0:15",
  });
  t.is(checkProperty(validate.errors, "pattern", "ActivityStartTime"), false);
  t.is(checkProperty(validate.errors, "pattern", "ActivityEndTime"), false);
  t.is(checkProperty(validate.errors, "pattern", "AnalysisStartTime"), false);
});

test("Should reject time formats", async (t) => {
  validate({
    ActivityStartTime: "9:15.00",
    ActivityEndTime: "13:15.00.000",
    AnalysisStartTime: "2.15",
  });
  t.is(checkProperty(validate.errors, "pattern", "ActivityStartTime"), true);
  t.is(checkProperty(validate.errors, "pattern", "ActivityEndTime"), true);
  t.is(checkProperty(validate.errors, "pattern", "AnalysisStartTime"), true);

  validate({
    ActivityStartTime: "0:15",
    ActivityEndTime: "!0:15",
    // 'AnalysisStartTime': '2.15'
  });
  t.is(checkProperty(validate.errors, "pattern", "ActivityStartTime"), true);
  t.is(checkProperty(validate.errors, "pattern", "ActivityEndTime"), true);
  // t.is(checkProperty(validate.errors, 'pattern', 'AnalysisStartTime'), true)
});

test("Should accept timezone formats (strict)", async (t) => {
  let valid = validateStrict({
    ActivityStartTimeZone: "Z",
    ActivityEndTimeZone: "Z",
    AnalysisStartTimeZone: "Z",
  });
  t.false(valid);
  t.is(
    validateStrict.errors.filter(
      (i) => i.instancePath === "/ActivityStartTimeZone",
    ).length,
    0,
  );
  t.is(
    validateStrict.errors.filter(
      (i) => i.instancePath === "/ActivityEndTimeZone",
    ).length,
    0,
  );
  t.is(
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
  t.false(valid);
  t.is(
    validateStrict.errors.filter(
      (i) => i.instancePath === "/ActivityStartTimeZone",
    ).length,
    0,
  );
  t.is(
    validateStrict.errors.filter(
      (i) => i.instancePath === "/ActivityEndTimeZone",
    ).length,
    0,
  );
  t.is(
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
  t.false(valid);
  t.is(
    validateStrict.errors.filter(
      (i) => i.instancePath === "/ActivityStartTimeZone",
    ).length,
    0,
  );
  t.is(
    validateStrict.errors.filter(
      (i) => i.instancePath === "/ActivityEndTimeZone",
    ).length,
    0,
  );
  t.is(
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
  t.false(valid);
  t.is(
    validateStrict.errors.filter(
      (i) => i.instancePath === "/ActivityStartTimeZone",
    ).length,
    1,
  );
  t.is(
    validateStrict.errors.filter(
      (i) => i.instancePath === "/ActivityEndTimeZone",
    ).length,
    1,
  );
  t.is(
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
  t.false(valid);
  t.is(
    validateStrict.errors.filter(
      (i) => i.instancePath === "/ActivityStartTimeZone",
    ).length,
    1,
  );
  t.is(
    validateStrict.errors.filter(
      (i) => i.instancePath === "/ActivityEndTimeZone",
    ).length,
    1,
  );
  t.is(
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
  t.false(valid);
  t.is(
    validateStrict.errors.filter(
      (i) => i.instancePath === "/ActivityStartTimeZone",
    ).length,
    2,
  );
  t.is(
    validateStrict.errors.filter(
      (i) => i.instancePath === "/ActivityEndTimeZone",
    ).length,
    2,
  );
  t.is(
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
  t.false(valid);
  t.is(
    validateStrict.errors.filter(
      (i) => i.instancePath === "/ActivityStartTimeZone",
    ).length,
    1,
  );
  t.is(
    validateStrict.errors.filter(
      (i) => i.instancePath === "/ActivityEndTimeZone",
    ).length,
    1,
  );
  t.is(
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
  t.false(valid);
  t.is(
    validateStrict.errors.filter(
      (i) => i.instancePath === "/ActivityStartTimeZone",
    ).length,
    1,
  );
  t.is(
    validateStrict.errors.filter(
      (i) => i.instancePath === "/ActivityEndTimeZone",
    ).length,
    1,
  );
  t.is(
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
  t.false(valid);
  t.is(
    validateStrict.errors.filter(
      (i) => i.instancePath === "/ActivityStartTimeZone",
    ).length,
    1,
  );
  t.is(
    validateStrict.errors.filter(
      (i) => i.instancePath === "/ActivityEndTimeZone",
    ).length,
    1,
  );
  t.is(
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
  t.true(valid);
  t.is(validateBackend.errors, null);

  valid = validateBackend({
    ActivityStartTimeZone: "+02:15",
    ActivityEndTimeZone: "+02:15",
    AnalysisStartTimeZone: "+02:15",
  });
  t.true(valid);
  t.is(validateBackend.errors, null);

  valid = validateBackend({
    ActivityStartTimeZone: "-02:15",
    ActivityEndTimeZone: "-02:15",
    AnalysisStartTimeZone: "-02:15",
  });
  t.true(valid);
  t.is(validateBackend.errors, null);

  valid = validateBackend({
    ActivityStartTimeZone: "-0215",
    ActivityEndTimeZone: "-0215",
    AnalysisStartTimeZone: "-0215",
  });
  t.true(valid);
  t.is(validateBackend.errors, null);

  valid = validateBackend({
    ActivityStartTimeZone: "-215",
    ActivityEndTimeZone: "-215",
    AnalysisStartTimeZone: "-215",
  });
  t.true(valid);
  t.is(validateBackend.errors, null);

  valid = validateBackend({
    ActivityStartTimeZone: "-2:15",
    ActivityEndTimeZone: "-2:15",
    AnalysisStartTimeZone: "-2:15",
  });
  t.true(valid);
  t.is(validateBackend.errors, null);
});

test("Should reject timezone formats (loose)", async (t) => {
  let valid = validateBackend({
    ActivityStartTimeZone: "z",
    ActivityEndTimeZone: "z",
    AnalysisStartTimeZone: "z",
  });
  t.false(valid);
  t.is(
    validateBackend.errors.filter(
      (i) => i.instancePath === "/ActivityStartTimeZone",
    ).length,
    1,
  );
  t.is(
    validateBackend.errors.filter(
      (i) => i.instancePath === "/ActivityEndTimeZone",
    ).length,
    1,
  );
  t.is(
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
  t.false(valid);
  t.is(
    validateBackend.errors.filter(
      (i) => i.instancePath === "/ActivityStartTimeZone",
    ).length,
    1,
  );
  t.is(
    validateBackend.errors.filter(
      (i) => i.instancePath === "/ActivityEndTimeZone",
    ).length,
    1,
  );
  t.is(
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
  t.false(valid);
  t.is(
    validateBackend.errors.filter(
      (i) => i.instancePath === "/ActivityStartTimeZone",
    ).length,
    2,
  );
  t.is(
    validateBackend.errors.filter(
      (i) => i.instancePath === "/ActivityEndTimeZone",
    ).length,
    2,
  );
  t.is(
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
  t.is(checkProperty(validate.errors, "pattern", "ResultComment"), false);
});

test("Should reject CSV Injection check when leading space", async (t) => {
  validate({
    ResultComment: " test",
  });
  t.is(checkProperty(validate.errors, "pattern", "ResultComment"), true);
});

test("Should reject CSV Injection check when leading caragereturn", async (t) => {
  validate({
    ResultComment: "\rtest",
  });
  t.is(checkProperty(validate.errors, "pattern", "ResultComment"), true);
});

test("Should reject CSV Injection check when leading newline", async (t) => {
  validate({
    ResultComment: "\ntest",
  });
  t.is(checkProperty(validate.errors, "pattern", "ResultComment"), true);
});

test("Should reject CSV Injection check when leading tab", async (t) => {
  validate({
    ResultComment: "\ttest",
  });
  t.is(checkProperty(validate.errors, "pattern", "ResultComment"), true);
});

test("Should reject CSV Injection check when leading =", async (t) => {
  validate({
    ResultComment: "=test",
  });
  t.is(checkProperty(validate.errors, "pattern", "ResultComment"), true);
});

test("Should reject CSV Injection check when leading +", async (t) => {
  validate({
    ResultComment: "+test",
  });
  t.is(checkProperty(validate.errors, "pattern", "ResultComment"), true);
});

test("Should reject CSV Injection check when leading -", async (t) => {
  validate({
    ResultComment: "-test",
  });
  t.is(checkProperty(validate.errors, "pattern", "ResultComment"), true);
});

test("Should reject CSV Injection check when leading @", async (t) => {
  validate({
    ResultComment: "@test",
  });
  t.is(checkProperty(validate.errors, "pattern", "ResultComment"), true);
});

test("Should reject CSV Injection check when leading null char", async (t) => {
  validate({
    ResultComment: "\x00test",
  });
  t.is(checkProperty(validate.errors, "pattern", "ResultComment"), true);
});
