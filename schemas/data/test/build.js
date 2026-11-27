import { test } from 'node:test'
import assert from 'node:assert/strict'
import { toFriendlyName, replaceRetired } from '../bin/build-lib.js'

test('toFriendlyName › Should convert PascalCase to friendly name', (t) => {
  assert.equal(toFriendlyName('AquiferCode'), 'Aquifer Code')
})

test('toFriendlyName › Should convert camelCase to friendly name', (t) => {
  assert.equal(toFriendlyName('aquiferCode'), 'aquifer Code')
})

test('toFriendlyName › Should handle acronyms followed by words', (t) => {
  assert.equal(toFriendlyName('WellIDContext'), 'Well ID Context')
})

test('toFriendlyName › Should handle multiple word boundaries', (t) => {
  assert.equal(
    toFriendlyName('AquiferUnitPorosityType'),
    'Aquifer Unit Porosity Type'
  )
})

test('toFriendlyName › Should handle long field names', (t) => {
  assert.equal(
    toFriendlyName('ActivityDepthAltitudeReferencePoint'),
    'Activity Depth Altitude Reference Point'
  )
})

test('toFriendlyName › Should handle single word', (t) => {
  assert.equal(toFriendlyName('Sample'), 'Sample')
})

test('toFriendlyName › Should handle consecutive acronyms', (t) => {
  assert.equal(toFriendlyName('XMLHTTPRequest'), 'XMLHTTP Request')
})

const retiredNames = [
  ['2-Chloroethylvinylether ***RETIRED***use 2-Chloroethyl vinyl ether', '2-Chloroethylvinylether'],
  ['3-Iodo-2-propynyl butyl carbamate ***RETIRED*** use 3-Iodo-2-propynyl butylcarbamate', '3-Iodo-2-propynyl butyl carbamate'],
  ['4-Nonylphenol pentaethoxylates ***RETIRED*** use 4-Nonylphenol pentaethoxylate', '4-Nonylphenol pentaethoxylates'],
  ['4-Nonylphenol tetraethoxylates ***RETIRED*** use 4-Nonylphenol tetraethoxylate', '4-Nonylphenol tetraethoxylates'],
  ['Perfluorodecanesulfonate ***RETIRED*** use Perfluorodecane sulfonate', 'Perfluorodecanesulfonate'],
  ['Perfluoropentanesulfonic acid ***RETIRED*** use Perfluoropentane sulfonic acid', 'Perfluoropentanesulfonic acid']
]

for (const [input, expected] of retiredNames) {
  test(`replaceRetired › Should strip capital ***RETIRED*** suffix: ${expected}`, (t) => {
    assert.equal(replaceRetired(input), expected)
  })
}

test('replaceRetired › Should still strip lowercase ***retired*** suffix', (t) => {
  assert.equal(
    replaceRetired('Old name ***retired*** use New name'),
    'Old name'
  )
})

test('replaceRetired › Should leave a normal name unchanged', (t) => {
  assert.equal(replaceRetired('Perfluorodecane sulfonate'), 'Perfluorodecane sulfonate')
})
