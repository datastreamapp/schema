const fs = require('fs')

const {subsetOnly, wqx, getList, sort, retire, override, additions, subtractions, subset} = require('./build-lib')

Object.keys(wqx).forEach(col => {
  console.log(col)
  let object = JSON.parse(JSON.stringify(require(`wqx/values/${wqx[col]}.json`)))
  delete object.$id

  // Add alias
  // if (col === 'CharacteristicName') {
  //   const alias = JSON.parse(JSON.stringify(require(`wqx/values/CharacteristicAlias.json`)))
  //   object.enum = object.enum.concat(alias.enum)
  // }

  object.enum = override(col, object.enum)
  const retired = retire(col, object.enum)

  object.enum = additions(col, object.enum)

  if (subsetOnly.includes(col)) {
    object.enum = getList('subset', col, object.enum)
  }

  object.enum = [...new Set(sort(object.enum))]
  object.maxLength = Math.max(...(object.enum.map(el => el.length)))  // catch any additions that may be longer

  fs.writeFileSync(__dirname + `/../src/values/${col}.legacy.json`, JSON.stringify(object, null, 2), { encoding: 'utf8' })

  object.enum = subset(col, object.enum) // getList('subset', col, object.enum)
  object.enum = subtractions(col, object.enum, retired)

  fs.writeFileSync(__dirname + `/../src/values/${col}.primary.json`, JSON.stringify(object, null, 2), { encoding: 'utf8' })
})

// Check CharacteristicNameGroups
let characteristicNameGroups = require(`wqx/groups/CharacteristicName.json`)
let characteristicNames = require(`../src/values/CharacteristicName.primary.json`)
characteristicNames = characteristicNames.enum

for(const characteristicName of characteristicNames) {
  if (!characteristicNameGroups[characteristicName] || characteristicNameGroups[characteristicName] === 'Not Assigned') {
    console.log('CharacteristicNameGroups Not Assigned', characteristicName)
  }
}