import { readFile, writeFile } from "fs/promises";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

const schema = await readFile("../primary/index.json")
  .then((res) => JSON.parse(res))
  .catch(() => ({}));
const characteristics = await readFile(
  "../src/values/CharacteristicName.primary.json"
)
  .then((res) => JSON.parse(res).enum)
  .catch(() => []);
const methodSpeciation = await readFile(
  "../src/logic/CharacteristicName-MethodSpeciation.json"
)
  .then((res) => JSON.parse(res).if.properties.CharacteristicName.enum)
  .catch(() => []);
const methodSpeciationOptional = await readFile(
  "../src/quality-control/partial/CharacteristicName-MethodSpeciation-Optional.json"
)
  .then((res) => JSON.parse(res).enum)
  .catch(() => []);
const sampleFraction = await readFile(
  "../src/logic/CharacteristicName-ResultSampleFraction.json"
)
  .then((res) => JSON.parse(res).if.properties.CharacteristicName.enum)
  .catch(() => []);
//const sampleFractionOptional = await readFile('../src/quality-control/partial/CharacteristicName-ResultSampleFraction-Optional.json').then(res => JSON.parse(res).enum).catch(() => ([]))
const characteristicGroup = await readFile("wqx/groups/CharacteristicName.json")
  .then((res) => JSON.parse(res))
  .catch(() => ({}));
const characteristicCASNumber = await readFile("wqx/groups/CASNumber.json")
  .then((res) => JSON.parse(res))
  .catch(() => ({}));

const buildUnits = async () => {
  let csv = "Unit\n";

  for (const value of schema.properties.ResultUnit.enum) {
    csv += `"${value}"\n`;
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
      ? '"Yes"'
      : '"No"';
    if (
      methodSpeciationRequired === '"No"' &&
      methodSpeciationOptional.includes(value)
    ) {
      methodSpeciationRequired = '"May"';
    }

    let sampleFractionRequired = sampleFraction.includes(value)
      ? '"Yes"'
      : '"No"';
    // if (sampleFractionRequired === '"No"' && sampleFractionOptional.includes(value)) {
    //   sampleFractionRequired = '"May"'
    // }
    csv += `"${value}",${methodSpeciationRequired},${sampleFractionRequired},"${
      characteristicGroup[value] || "Not Assigned"
    }",${characteristicCASNumber[value] || ""}\n`;
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
