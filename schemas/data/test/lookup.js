import { test } from 'node:test'
import assert from 'node:assert/strict'
import lookup from '../lookup/CharacteristicName-CharacteristicWQXGroup.json' with { type: 'json' }
import characteristicName from '../database/CharacteristicName.json' with { type: 'json' }

const added = {
  '2-Chloroethylvinylether': 'Organics, Other',
  '3-Iodo-2-propynyl butyl carbamate': 'Organics, Other',
  Perfluorodecanesulfonate: 'PFAS,Perfluorinated Alkyl Substance',
  'Perfluoropentanesulfonic acid': 'PFAS,Perfluorinated Alkyl Substance',
}

test('CharacteristicName group lookup: added names map to their group', () => {
  for (const [name, group] of Object.entries(added)) {
    assert.equal(lookup[name], group, name)
  }
})

test('CharacteristicName group lookup: added names are valid CharacteristicName values', () => {
  for (const name of Object.keys(added)) {
    assert.ok(characteristicName.enum.includes(name), name)
  }
})

test('CharacteristicName group lookup: every group is a non-empty string', () => {
  for (const [name, group] of Object.entries(lookup)) {
    assert.equal(typeof group, 'string', name)
    assert.notEqual(group.trim(), '', name)
  }
})

test('CharacteristicName group lookup: unknown name has no group', () => {
  assert.equal(lookup['Not a real characteristic'], undefined)
})
