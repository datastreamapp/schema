import test from 'ava'

import { toFriendlyName } from '../bin/build-lib.js'

test('toFriendlyName › Should convert PascalCase to friendly name', (t) => {
  t.is(toFriendlyName('AquiferCode'), 'Aquifer Code')
})

test('toFriendlyName › Should convert camelCase to friendly name', (t) => {
  t.is(toFriendlyName('aquiferCode'), 'aquifer Code')
})

test('toFriendlyName › Should handle acronyms followed by words', (t) => {
  t.is(toFriendlyName('WellIDContext'), 'Well ID Context')
})

test('toFriendlyName › Should handle multiple word boundaries', (t) => {
  t.is(toFriendlyName('AquiferUnitPorosityType'), 'Aquifer Unit Porosity Type')
})

test('toFriendlyName › Should handle long field names', (t) => {
  t.is(toFriendlyName('ActivityDepthAltitudeReferencePoint'), 'Activity Depth Altitude Reference Point')
})

test('toFriendlyName › Should handle single word', (t) => {
  t.is(toFriendlyName('Sample'), 'Sample')
})

test('toFriendlyName › Should handle consecutive acronyms', (t) => {
  t.is(toFriendlyName('XMLHTTPRequest'), 'XMLHTTP Request')
})