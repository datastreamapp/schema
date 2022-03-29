import { readFile, writeFile } from "fs/promises";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

import {
  subsetOnly,
  wqx,
  getList,
  sort,
  retire,
  override,
  additions,
  subtractions,
  subset,
} from "./build-lib.js";

for (const col of Object.keys(wqx)) {
  console.log(col);
  let object = await import(`wqx/values/${wqx[col]}.json.js`);
  object = { ...object.default };
  delete object.$id;

  // Add alias
  // if (col === 'CharacteristicName') {
  //   const alias = JSON.parse(JSON.stringify(require(`wqx/values/CharacteristicAlias.json`)))
  //   object.enum = object.enum.concat(alias.enum)
  // }

  const retired = await retire(col, object.enum);
  object.enum = await override(col, object.enum);

  object.enum = await additions(col, object.enum);

  if (subsetOnly.includes(col)) {
    object.enum = await getList("subset", col, object.enum);
  }

  object.enum = [...new Set(sort(object.enum))];
  object.maxLength = Math.max(...object.enum.map((el) => el.length)); // catch any additions that may be longer

  await writeFile(
    join(__dirname, `/../src/values/${col}.legacy.json`),
    JSON.stringify(object, null, 2),
    { encoding: "utf8" }
  );

  object.enum = await subset(col, object.enum); // getList('subset', col, object.enum)
  object.enum = await subtractions(col, object.enum, retired);
  object.enum = await override(col, object.enum);

  await writeFile(
    join(__dirname, `/../src/values/${col}.primary.json`),
    JSON.stringify(object, null, 2),
    { encoding: "utf8" }
  );
}

// Check CharacteristicNameGroups
let characteristicNameGroups = await import(
  `wqx/groups/CharacteristicName.json.js`
);
let characteristicNames = await readFile(
  join(__dirname, `../src/values/CharacteristicName.primary.json`)
).then((res) => JSON.parse(res));
characteristicNames = characteristicNames.enum;

for (const characteristicName of characteristicNames) {
  if (
    !characteristicNameGroups[characteristicName] ||
    characteristicNameGroups[characteristicName] === "Not Assigned"
  ) {
    console.log("CharacteristicNameGroups Not Assigned", characteristicName);
  }
}
