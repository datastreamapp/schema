import { readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { subset, sort } from "./build-lib.js";

const __dirname = dirname(fileURLToPath(import.meta.url));

const columns = [
  "ActivityMediaName", // filter
  "ActivityType",
  "ActivityGroupType", // filter
  "CharacteristicName", // filter
  "CharacteristicGroup", // filter
  "MethodSpeciation", // app display
  "MonitoringLocationHorizontalCoordinateReferenceSystem",
  "MonitoringLocationType", // app filter
  "ResultAnalyticalMethodContext",
  "ResultDetectionCondition",
  "ResultDetectionQuantitationLimitType",
  "ResultSampleFraction", // app display
  "ResultStatusID",
  "ResultValueType",
  "SampleCollectionEquipmentName",
  //"MeasurementUnit",
];

const setup = async (column) => {
  const locales = await readFile(
    join(__dirname, `../src/locales/${column}.json`)
  )
    .then((res) => JSON.parse(res))
    .catch((e) => ({}));
  const allowedValues = await readFile(
    join(__dirname, `../src/values/${column}.primary.json`)
  ).then((res) => JSON.parse(res));

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

await Promise.all(columns.map((column) => setup(column)));
