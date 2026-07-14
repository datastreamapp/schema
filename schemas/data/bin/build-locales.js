import { readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));

const columns = [
  "ActivityDepthAltitudeReferencePoint",
  "ActivityMediaName", // filter
  "ActivityType",
  "ActivityGroupType", // filter
  "AquiferType",
  "AquiferUnitName",
  "AquiferUnitPorosityType",
  "CharacteristicName", // filter
  "CharacteristicGroup", // filter
  "LithologyType",
  "MethodSpeciation", // app display
  "MonitoringLocationHorizontalCoordinateReferenceSystem",
  "MonitoringLocationType", // app filter
  "MonitoringLocationVerticalCollectionMethod",
  "MonitoringLocationVerticalCoordinateReferenceSystem",
  "ResultAnalyticalMethodContext",
  "ResultDetectionCondition",
  "ResultDetectionQuantitationLimitType",
  "ResultSampleFraction", // app display
  "ResultStatusID",
  "ResultValueType",
  "SampleCollectionEquipmentName",
  "SampleCollectionMethodContext",
  "SampleCondition",
  "WellIDContext",
  "WellUseType",
  //"MeasurementUnit",
];

const load = async (column) => {
  const locales = await readFile(
    join(__dirname, `../src/locales/${column}.json`)
  )
    .then((res) => JSON.parse(res))
    .catch(() => ({}));
  const allowedValues = await readFile(
    join(__dirname, `../src/values/${column}.primary.json`)
  ).then((res) => JSON.parse(res));
  return { column, locales, allowedValues };
};

// A valid locale file is flat with only these top-level keys. Any other key
// (e.g. the file nested under a "${column}" wrapper) means the file is malformed;
// building it would silently append a duplicate flat block via the `??=` in
// write(). Returns an error string or null.
// TODO: tighten this into a full schema check with ajv
const validate = ({ column, locales }) => {
  const unexpected = Object.keys(locales).filter(
    (key) => !["name", "description", "values"].includes(key)
  );
  if (unexpected.length) {
    return (
      `src/locales/${column}.json has unexpected top-level key(s): ${unexpected.join(", ")}. ` +
      `Expected only "name", "description", "values" — the file is likely wrapped under a ` +
      `"${column}" key. Un-nest it before rebuilding.`
    );
  }
  return null;
};

const write = async ({ column, locales, allowedValues }) => {
  locales.name ??= { en: column, fr: null };
  locales.description ??= { en: null, fr: null };
  locales.values ??= {};
  for (const value of allowedValues.enum) {
    locales.values[value] ??= {
      name: { en: value, fr: null },
      description: { en: null, fr: null },
    };
    // if (column !== "MeasurementUnit") {
    //   locales[value].en ||= value;
    // }

    if (!locales.values[value].name.en) {
      console.warn(`${column}["${value}"].en missing`);
    }
    if (!locales.values[value].name.fr) {
      console.warn(`${column}["${value}"].fr missing`);
    }
  }

  await writeFile(
    join(__dirname, `../src/locales/${column}.json`),
    JSON.stringify(locales, null, 2),
    {
      encoding: "utf8",
    }
  );
};

// Two-phase, fail-fast: load and validate EVERY file before writing ANY of them.
// A single malformed file aborts the whole build with no writes, so a bad file
// can never truncate a good one via a mid-run throw during concurrent writes.
const loaded = await Promise.all(columns.map(load));
const errors = loaded.map(validate).filter(Boolean);
if (errors.length) {
  throw new Error(
    `Locale validation failed — no files were written:\n${errors
      .map((error) => `  - ${error}`)
      .join("\n")}`
  );
}
await Promise.all(loaded.map(write));
