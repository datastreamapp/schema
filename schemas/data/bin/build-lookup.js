import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { readFile, writeFile } from 'node:fs/promises'

const __dirname = dirname(fileURLToPath(import.meta.url))

// Build groups
let CharacteristicWQXGroups = await readFile(
  join(__dirname, `../node_modules/wqx/groups/CharacteristicName.json`)
).then((res) => JSON.parse(res))
let CharacteristicWQXGroupsLocal = await readFile(
  join(__dirname, `../lookup/CharacteristicName-CharacteristicWQXGroup.json`)
).then((res) => JSON.parse(res))

let CharacteristicWQXGroupMeasureUnitLocal = await readFile(
  join(__dirname, `../lookup/CharacteristicWQXGroup-MeasureUnit.json`)
).then((res) => JSON.parse(res))

for (const key in CharacteristicWQXGroupsLocal) {
  if (CharacteristicWQXGroups[key] === CharacteristicWQXGroupsLocal[key]) {
    console.log(`CharacteristicWQXGroupRedundant "${key}", safe to delete`)
  } else if (CharacteristicWQXGroups[key]) {
    console.log(
      `CharacteristicWQXGroup "${key}":"${CharacteristicWQXGroups[key]}" replace with "${CharacteristicWQXGroupsLocal[key]}"`
    )
  }
  CharacteristicWQXGroups[key] = CharacteristicWQXGroupsLocal[key]
}

await writeFile(
  join(__dirname, `/../lookup/CharacteristicName-CharacteristicWQXGroup.json`),
  JSON.stringify(CharacteristicWQXGroups),
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
  const group = CharacteristicWQXGroups[characteristicName]
  if (
    !CharacteristicWQXGroups[characteristicName] ||
    CharacteristicWQXGroups[characteristicName] === 'Not Assigned'
  ) {
    console.log(
      `CharacteristicWQXGroups "${CharacteristicWQXGroups[characteristicName]}"`,
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
  join(__dirname, `/../lookup/CharacteristicName-MeasureUnit.json`),
  join(__dirname, `/../lookup/CharacteristicWQXGroup-MeasureUnit.json`)
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
