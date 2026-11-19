import { test } from 'node:test'
import assert from 'node:assert/strict'
import validate from '../quality-control/index.js'

const has = (message, errors = validate.errors) =>
  (errors ?? []).some(
    (error) =>
      error.message === message ||
      (error.keyword === 'errorMessage' && has(message, error.params.errors))
  )

// *** ActivityDepthAltitudeReferencePoint-GroundSurface *** //
test('Should warn when Ground surface reference point has a non-zero ActivityDepthAltitudeReferencePointMeasure', async () => {
  validate({
    ActivityDepthAltitudeReferencePoint: 'Ground surface',
    ActivityDepthAltitudeReferencePointMeasure: -5,
    ActivityDepthAltitudeReferencePointUnit: 'm',
  })
  assert.equal(has('qc-ActivityDepthAltitudeReferencePoint-GroundSurface'), true)
})
test('Should not warn when Ground surface reference point has ActivityDepthAltitudeReferencePointMeasure 0', async () => {
  validate({
    ActivityDepthAltitudeReferencePoint: 'Ground surface',
    ActivityDepthAltitudeReferencePointMeasure: 0,
    ActivityDepthAltitudeReferencePointUnit: 'm',
  })
  assert.equal(has('qc-ActivityDepthAltitudeReferencePoint-GroundSurface'), false)
})
test('Should not warn when Ground surface reference point has no ActivityDepthAltitudeReferencePointMeasure', async () => {
  validate({ ActivityDepthAltitudeReferencePoint: 'Ground surface' })
  assert.equal(has('qc-ActivityDepthAltitudeReferencePoint-GroundSurface'), false)
})
test('Should not warn for another reference point with a non-zero ActivityDepthAltitudeReferencePointMeasure', async () => {
  validate({
    ActivityDepthAltitudeReferencePoint: 'Top of well casing',
    ActivityDepthAltitudeReferencePointMeasure: -5,
    ActivityDepthAltitudeReferencePointUnit: 'm',
  })
  assert.equal(has('qc-ActivityDepthAltitudeReferencePoint-GroundSurface'), false)
})

// *** ResultUnit-Elevation (deactivated) *** //
for (const unit of ['m', 'MASL']) {
  for (const CharacteristicName of ['Water level', 'Water level (probe)']) {
    test(`Should not warn about elevation for ${CharacteristicName} in ${unit}`, async () => {
      validate({ CharacteristicName, ResultValue: 1800, ResultUnit: unit })
      assert.equal(has('qc-ResultUnit-Elevation'), false)
    })
  }
}
