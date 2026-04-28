import { test } from "node:test";
import assert from "node:assert/strict";
import { toFriendlyName } from '../bin/build-lib.js'

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
  assert.equal(toFriendlyName('AquiferUnitPorosityType'), 'Aquifer Unit Porosity Type')
})

test('toFriendlyName › Should handle long field names', (t) => {
  assert.equal(toFriendlyName('ActivityDepthAltitudeReferencePoint'), 'Activity Depth Altitude Reference Point')
})

test('toFriendlyName › Should handle single word', (t) => {
  assert.equal(toFriendlyName('Sample'), 'Sample')
})

test('toFriendlyName › Should handle consecutive acronyms', (t) => {
  assert.equal(toFriendlyName('XMLHTTPRequest'), 'XMLHTTP Request')
})