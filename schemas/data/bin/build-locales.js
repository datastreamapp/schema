import { readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { subset, sort } from "./build-lib.js";

const __dirname = dirname(fileURLToPath(import.meta.url));

const columns = [
  "ActivityMediaName", // filter
  "ActivityGroupType", // filter
  "ActivityType",
  "CharacteristicName", // filter
  //'CharacteristicGroup', // filter
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
  "MeasurementUnit",
];

const setup = async (column) => {
  const locales = await readFile(
    join(__dirname, `../src/locales/${column}.json`)
  ).then((res) => JSON.parse(res));
  const allowedValues = await readFile(
    join(__dirname, `../src/values/${column}.primary.json`)
  ).then((res) => JSON.parse(res));

  for (const value of allowedValues.enum) {
    locales[value] ??= {};
    locales[value]["_"] ||= value;
    if (column !== "MeasurementUnit") {
      locales[value].en ||= value;
    }
    locales[value].en ||= null;
    locales[value].fr ||= null;

    if (!locales[value].en) {
      console.warn(`${column}["${value}"].en missing`);
    }
    if (!locales[value].fr) {
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
