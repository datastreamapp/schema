import { dirname, join } from "path";
import { fileURLToPath } from "url";
import { readFile, writeFile } from "fs/promises";

const __dirname = dirname(fileURLToPath(import.meta.url));

// Build groups
let characteristicNameGroups = await readFile(
  join(__dirname, `../node_modules/wqx/groups/CharacteristicName.json`)
).then((res) => JSON.parse(res))
let characteristicNameGroupsLocal = await readFile(
  join(__dirname, `../lookup/CharacteristicName-CharacteristicNameGroup.json`)
).then((res) => JSON.parse(res))

for(const key in characteristicNameGroupsLocal) {
  if (characteristicNameGroups[key]) {
    console.log(`CharacteristicNameGroup "${key}":"${characteristicNameGroups[key]}" replace with "${characteristicNameGroupsLocal[key]}"`)
  }
  characteristicNameGroups[key] = characteristicNameGroupsLocal[key]
}

await writeFile(join(__dirname, `/../lookup/CharacteristicName-CharacteristicNameGroup.json`), JSON.stringify(characteristicNameGroups), {
  encoding: "utf8",
});

// Testing
let characteristicNames = await readFile(
  join(__dirname, `../src/values/CharacteristicName.primary.json`)
).then((res) => JSON.parse(res))
characteristicNames = characteristicNames.enum;

for (const characteristicName of characteristicNames) {
  //console.log(characteristicName, characteristicNameGroups[characteristicName])
  if (
    !characteristicNameGroups[characteristicName] ||
    characteristicNameGroups[characteristicName] === "Not Assigned"
  ) {
    console.log("CharacteristicNameGroups Not Assigned", characteristicName);
  }
}

for (const path of [
  join(__dirname, `/../lookup/CharacteristicName-CharacteristicNameGroup.json`),
  join(__dirname, `/../lookup/CharacteristicName-MeasureUnit.json`),
  join(__dirname, `/../lookup/CharacteristicNameGroup-MeasureUnit.json`),
]) {
  const json = await readFile(path).then((res) => JSON.parse(res))
  await writeFile(path+'.js', `export default ${JSON.stringify(json, null, 2)}`, {
    encoding: "utf8",
  });
}
