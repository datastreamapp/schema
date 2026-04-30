import { test } from "node:test";
import assert from "node:assert/strict";
import primary from "../primary/index.json" with { type: "json" };
import frontend from "../frontend/index.json" with { type: "json" };
import extract from "../extract/index.json" with { type: "json" };
import backend from "../backend/index.json" with { type: "json" };
import qualityControl from "../quality-control/index.json" with { type: "json" };

const flavours = { primary, frontend, extract, backend, "quality-control": qualityControl };
const main = primary.allOf[0];

// *** $id contract *** //
test("primary $id matches the published URL", () => {
  assert.equal(primary.$id, "https://datastream.org/schema/data/primary.json");
});

test("all flavour $ids match their filesystem paths", () => {
  for (const [flavour, schema] of Object.entries(flavours)) {
    assert.equal(
      schema.$id,
      `https://datastream.org/schema/data/${flavour}.json`,
      `${flavour}/index.json`
    );
  }
});

// *** structural integrity *** //
test("primary has no unresolved $refs (fully dereferenced bundle)", () => {
  assert.equal(JSON.stringify(primary).includes('"$ref":'), false);
});

test("primary has no transform keyword (strict, no coercion)", () => {
  assert.equal(JSON.stringify(primary).includes('"transform":'), false);
});

// *** required fields contract *** //
test("primary required fields match the documented contract", () => {
  assert.deepEqual(main.required.sort(), [
    "ActivityMediaName",
    "ActivityStartDate",
    "ActivityType",
    "CharacteristicName",
    "DatasetName",
    "MonitoringLocationHorizontalCoordinateReferenceSystem",
    "MonitoringLocationID",
    "MonitoringLocationLatitude",
    "MonitoringLocationLongitude",
    "MonitoringLocationName",
    "MonitoringLocationType",
    "ResultValueType",
  ]);
});

// *** GW field constraints (pinned) *** //
test("AquiferCode is text with maxLength 10", () => {
  const f = main.properties.AquiferCode;
  assert.equal(f.type, "string");
  assert.equal(f.maxLength, 10);
});

test("WellID is text with maxLength 55", () => {
  const f = main.properties.WellID;
  assert.equal(f.type, "string");
  assert.equal(f.maxLength, 55);
});

test("SampleCollectionMethodID has maxLength 50", () => {
  assert.equal(main.properties.SampleCollectionMethodID.maxLength, 50);
});

test("SampleCollectionMethodName has maxLength 300", () => {
  assert.equal(main.properties.SampleCollectionMethodName.maxLength, 300);
});

test("BoreholeDepthMeasure has maximum 0", () => {
  assert.equal(main.properties.BoreholeDepthMeasure.maximum, 0);
});

test("WellDepthMeasure has maximum 0", () => {
  assert.equal(main.properties.WellDepthMeasure.maximum, 0);
});

test("WellOpenIntervalTopMeasure has maximum 0", () => {
  assert.equal(main.properties.WellOpenIntervalTopMeasure.maximum, 0);
});

test("WellOpenIntervalBottomMeasure has maximum 0", () => {
  assert.equal(main.properties.WellOpenIntervalBottomMeasure.maximum, 0);
});

test("MonitoringLocationVerticalAccuracyMeasure has minimum 0", () => {
  assert.equal(main.properties.MonitoringLocationVerticalAccuracyMeasure.minimum, 0);
});

test("ActivityDepthAltitudeReferencePointMeasure has minimum 0", () => {
  assert.equal(main.properties.ActivityDepthAltitudeReferencePointMeasure.minimum, 0);
});

// *** non-GW field constraints (pinned) *** //
test("MonitoringLocationLatitude bounded to 0..90 (northern hemisphere)", () => {
  const f = main.properties.MonitoringLocationLatitude;
  assert.equal(f.minimum, 0);
  assert.equal(f.maximum, 90);
});

test("MonitoringLocationLongitude bounded to -180..180", () => {
  const f = main.properties.MonitoringLocationLongitude;
  assert.equal(f.minimum, -180);
  assert.equal(f.maximum, 180);
});

test("MonitoringLocationHorizontalAccuracyMeasure has minimum 0", () => {
  assert.equal(main.properties.MonitoringLocationHorizontalAccuracyMeasure.minimum, 0);
});

test("DatasetName has length 1..512", () => {
  const f = main.properties.DatasetName;
  assert.equal(f.minLength, 1);
  assert.equal(f.maxLength, 512);
});

test("MonitoringLocationID has length 1..55", () => {
  const f = main.properties.MonitoringLocationID;
  assert.equal(f.minLength, 1);
  assert.equal(f.maxLength, 55);
});

test("MonitoringLocationName has length 1..255", () => {
  const f = main.properties.MonitoringLocationName;
  assert.equal(f.minLength, 1);
  assert.equal(f.maxLength, 255);
});

test("LaboratoryName has maxLength 100", () => {
  assert.equal(main.properties.LaboratoryName.maxLength, 100);
});

test("LaboratorySampleID has maxLength 60", () => {
  assert.equal(main.properties.LaboratorySampleID.maxLength, 60);
});

test("ResultComment has maxLength 4000", () => {
  assert.equal(main.properties.ResultComment.maxLength, 4000);
});

test("ResultAnalyticalMethodID has maxLength 50", () => {
  assert.equal(main.properties.ResultAnalyticalMethodID.maxLength, 50);
});

test("ResultAnalyticalMethodName has maxLength 300", () => {
  assert.equal(main.properties.ResultAnalyticalMethodName.maxLength, 300);
});

// *** cross-flavour consistency *** //
test("primary, frontend, extract, and backend define the same property names", () => {
  const pProps = Object.keys(main.properties).sort();
  for (const flavour of ["frontend", "extract", "backend"]) {
    const props = Object.keys(flavours[flavour].allOf[0].properties).sort();
    assert.deepEqual(props, pProps, `${flavour} differs from primary`);
  }
});