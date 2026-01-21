import { writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import {
  additions,
  custom,
  getList,
  retire,
  sort,
  subset,
  subsetOnly,
  subtractions,
  toFriendlyName,
  wqx,
} from "./build-lib.js";

const __dirname = dirname(fileURLToPath(import.meta.url));

// Extract processing logic into reusable function
async function processValues(col, object) {
  let [retired, list] = await retire(col, object.enum);
  object.enum = list;
  //object.enum = await override(col, object.enum);

  object.enum = await additions(col, object.enum);

  if (subsetOnly.includes(col)) {
    object.enum = await getList("subset", col, object.enum);
  }

  object.enum = [...new Set(sort(object.enum))];
  // catch any additions that may be longer
  object.maxLength = Math.max(...object.enum.map((el) => el.length), 0);

  object.$id = `https://datastream.org/schema/data/values/${col}.loose.json`;
  await writeFile(
    join(__dirname, `/../src/values/${col}.legacy.json`),
    JSON.stringify(object, null, 2),
    { encoding: "utf8" },
  );

  object.enum = await subset(col, object.enum);

  // remove subset values from retire list
  const subsetList = await getList("subset", col);
  retired = retired.filter((item) => !subsetList.includes(item));

  object.enum = await subtractions(col, object.enum, retired);
  //object.enum = await override(col, object.enum);

  object.$id = `https://datastream.org/schema/data/values/${col}.strict.json`;
  await writeFile(
    join(__dirname, `/../src/values/${col}.primary.json`),
    JSON.stringify(object, null, 2),
    { encoding: "utf8" },
  );
}

// Process WQX fields
for (const col of Object.keys(wqx)) {
  console.log(col);
  let object = await import(`wqx/values/${wqx[col]}.json.js`);
  object = { ...object.default };

  // Add alias
  // if (col === 'CharacteristicName') {
  //   const alias = JSON.parse(JSON.stringify(require(`wqx/values/CharacteristicAlias.json`)))
  //   object.enum = object.enum.concat(alias.enum)
  // }

  await processValues(col, object);
}

// Process custom fields (non-WQX)
for (const col of custom) {
  console.log(col);
  const object = { $id: "", title: toFriendlyName(col), description: "", type: "string", enum: [] };
  await processValues(col, object);
}
