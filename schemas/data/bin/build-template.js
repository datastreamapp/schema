import { readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));

const schema = await readFile(join(__dirname,"../primary/index.json"))
  .then((res) => JSON.parse(res))
  .catch(() => ({}));
const characteristics = await readFile(join(__dirname, "../src/values/CharacteristicName.primary.json"))
  .then((res) => JSON.parse(res).enum)
  .catch(() => []);
const methodSpeciation = await readFile(join(__dirname, "../src/logic/CharacteristicName-MethodSpeciation.json"))
  .then((res) => JSON.parse(res).if.properties.CharacteristicName.enum)
  .catch(() => []);
const methodSpeciationOptional = await readFile(join(__dirname, "../src/quality-control/partial/CharacteristicName-MethodSpeciation-Optional.json"))
  .then((res) => JSON.parse(res).enum)
  .catch(() => []);
const sampleFraction = await readFile(join(__dirname, "../src/logic/CharacteristicName-ResultSampleFraction.json"))
  .then((res) => JSON.parse(res).if.properties.CharacteristicName.enum)
  .catch(() => []);
//const sampleFractionOptional = await readFile('../src/quality-control/partial/CharacteristicName-ResultSampleFraction-Optional.json').then(res => JSON.parse(res).enum).catch(() => ([]))
import characteristicGroup from "wqx/groups/CharacteristicName.json.js"
import characteristicCASNumber from "wqx/groups/CASNumber.json.js"
import unitDescriptions from "wqx/descriptions/MeasurementUnit.json.js"

const unitDescriptionsOverrides = await readFile(join(__dirname, "../src/lookup/MeasurementUnit.json"))
  .then((res) => JSON.parse(res))
  .catch(() => ({}));

const buildUnits = async () => {
  let csv = "Unit,Description\n";

  for (const value of schema.properties.ResultUnit.enum) {
    csv += `"${value}","${unitDescriptions[value] ?? unitDescriptionsOverrides[value] ?? ''}"\n`;
  }

  await writeFile(join(__dirname, `/template/Units.csv`), csv, {
    encoding: "utf8",
  });
};

const buildCharacteristics = async () => {
  let csv =
    "CharacteristicName,MethodSpeciation,SampleFraction,Group,CASNumber\n";

  for (const value of characteristics) {
    let methodSpeciationRequired = methodSpeciation.includes(value)
      ? 'Yes'
      : 'No';
    if (
      methodSpeciationRequired === 'No' &&
      methodSpeciationOptional.includes(value)
    ) {
      methodSpeciationRequired = 'May';
    }

    let sampleFractionRequired = sampleFraction.includes(value)
      ? 'Yes'
      : 'No';
    // if (sampleFractionRequired === '"No"' && sampleFractionOptional.includes(value)) {
    //   sampleFractionRequired = '"May"'
    // }

    csv += `"${value}","${methodSpeciationRequired}","${sampleFractionRequired}","${
      characteristicGroup[value] || "Not Assigned"
    }","${characteristicCASNumber[value] || ""}"\n`;
  }

  await writeFile(join(__dirname, `/template/Characteristics.csv`), csv, {
    encoding: "utf8",
  });
};

const buildAllowed = async () => {
  let csv = "";

  for (const key of Object.keys(schema.properties)) {
    let { type, enum: allowed, maxLength } = schema.properties[key];
    if (Array.isArray(allowed))
      allowed = allowed.map((value) => `"${value}"`).join(",");
    csv += `${key},${maxLength || ""},${allowed || ""}\n`;
  }

  await writeFile(join(__dirname, `/template/AllowedValues.csv`), csv, {
    encoding: "utf8",
  });
};

buildUnits();
buildCharacteristics();
buildAllowed();
