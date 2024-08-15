import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { readFile, writeFile } from 'node:fs/promises'
import { replaceRetired } from "./build-lib.js";

const __dirname = dirname(fileURLToPath(import.meta.url))

// Build groups
let CharacteristicWQXGroups = await readFile(
  join(__dirname, `../node_modules/wqx/groups/CharacteristicName.json`)
).then((res) => JSON.parse(res))
let CharacteristicWQXGroupsLocal = await readFile(
  join(__dirname, `../lookup/CharacteristicName-CharacteristicWQXGroup.json`)
).then((res) => JSON.parse(res))

let CharacteristicWQXGroupMeasureUnitLocal = await readFile(
  join(__dirname, `../lookup/CharacteristicWQXGroup-MeasurementUnit.json`)
).then((res) => JSON.parse(res))

// Update retired values
const CharacteristicNameWQXGroups = {}
for (const [key, value] of Object.entries(CharacteristicWQXGroups)) {
  const newKey = replaceRetired(key)
  CharacteristicNameWQXGroups[newKey] = value
  if (newKey !== key) {
    console.log(`Replaced retired CharacteristicName in Group lookup: ${key} => ${newKey}`)
  }
}

for (const key in CharacteristicWQXGroupsLocal) {
  if (CharacteristicNameWQXGroups[key] === CharacteristicWQXGroupsLocal[key]) {
    console.log(`CharacteristicWQXGroupRedundant "${key}", safe to delete`)
  } else if (CharacteristicNameWQXGroups[key]) {
    console.log(
      `CharacteristicWQXGroup "${key}":"${CharacteristicNameWQXGroups[key]}" replace with "${CharacteristicWQXGroupsLocal[key]}"`
    )
  }
  CharacteristicNameWQXGroups[key] = CharacteristicWQXGroupsLocal[key]
}

await writeFile(
  join(__dirname, `/../lookup/CharacteristicName-CharacteristicWQXGroup.json`),
  JSON.stringify(CharacteristicNameWQXGroups),
  {
    encoding: 'utf8'
  }
)

// Testing
let characteristicNames = await readFile(
  join(__dirname, `../src/values/CharacteristicName.primary.json`)
).then((res) => JSON.parse(res))
characteristicNames = characteristicNames.enum

for (const characteristicName of characteristicNames) {
  //console.log(characteristicName, CharacteristicWQXGroups[characteristicName])
  const group = CharacteristicNameWQXGroups[characteristicName]
  if (
    !CharacteristicNameWQXGroups[characteristicName] ||
    CharacteristicNameWQXGroups[characteristicName] === 'Not Assigned'
  ) {
    console.log(
      `CharacteristicWQXGroups "${CharacteristicNameWQXGroups[characteristicName]}"`,
      characteristicName
    )
  } else if (!CharacteristicWQXGroupMeasureUnitLocal[group]) {
    console.log(
      `CharacteristicWQXGroups "${group}": Missing normalization mapping`,
      characteristicName
    )
  }
}

// Export - Deprecate when using nodejs18
for (const path of [
  join(__dirname, `/../lookup/CharacteristicName-CharacteristicWQXGroup.json`),
  join(__dirname, `/../lookup/CharacteristicName-MeasurementUnit.json`),
  join(__dirname, `/../lookup/CharacteristicWQXGroup-MeasurementUnit.json`)
]) {
  const json = await readFile(path).then((res) => JSON.parse(res))
  await writeFile(
    path + '.js',
    `export default ${JSON.stringify(json, null, 2)}`,
    {
      encoding: 'utf8'
    }
  )
}
