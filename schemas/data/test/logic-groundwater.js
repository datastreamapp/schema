import { test } from 'node:test'
import assert from 'node:assert/strict'
import validate from '../frontend/index.js'

const checkProperty = (errors, keyword, property) => {
  if (errors === null) return false
  for (const error of errors) {
    if (keyword === 'message' && error.message === property) {
      return true
    } else if (error.keyword === 'errorMessage') {
      const nested = checkProperty(error.params.errors, keyword, property)
      if (nested) return nested
    }
    if (error.keyword !== keyword) continue
    if (
      ['required', 'dependencies'].includes(keyword) &&
      error.params.missingProperty === property
    ) {
      return true
    } else if (
      keyword === 'additionalProperties' &&
      error.params.additionalProperty === property
    ) {
      return true
    } else if (
      keyword === 'oneOf' &&
      error.params.passingSchemas.includes(property)
    ) {
      return true
    } else if (keyword === 'anyOf')
      return true // anyOf branches surface as nested `required` errors inside errorMessage; query those directly via keyword="required" for property-specific assertions.
    else if (keyword === 'not' && error.instancePath.includes(property)) {
      return true
    } else if (keyword === 'enum' && error.instancePath.includes(property)) {
      return true
    } else if (keyword === 'minimum' && error.instancePath.includes(property)) {
      return true
    } else if (
      keyword === 'exclusiveMinimum' &&
      error.instancePath.includes(property)
    ) {
      return true
    } else if (keyword === 'maximum' && error.instancePath.includes(property)) {
      return true
    } else if (
      keyword === 'exclusiveMaximum' &&
      error.instancePath.includes(property)
    ) {
      return true
    } else if (
      keyword === 'false schema' &&
      error.instancePath.includes(property)
    ) {
      return true
    } else if (keyword === 'pattern') return true
  }
  return false
}

test('Should reject WellOpenIntervalTopMeasure not above WellOpenIntervalBottomMeasure', { todo: 'needs cross-field compare, not supported by build' }, async () => {
  validate({ ActivityMediaName: 'Groundwater', WellOpenIntervalTopMeasure: -20, WellOpenIntervalTopUnit: 'm', WellOpenIntervalBottomMeasure: -10, WellOpenIntervalBottomUnit: 'm' })
  assert.equal(checkProperty(validate.errors, 'message', 'error-WellOpenIntervalTopMeasure-Depth'), true)
})

test('Should accept WellOpenIntervalTopMeasure not above WellOpenIntervalBottomMeasure', { todo: 'needs cross-field compare, not supported by build' }, async () => {
  validate({ ActivityMediaName: 'Groundwater', WellOpenIntervalTopMeasure: -10, WellOpenIntervalTopUnit: 'm', WellOpenIntervalBottomMeasure: -20, WellOpenIntervalBottomUnit: 'm' })
  assert.equal(checkProperty(validate.errors, 'message', 'error-WellOpenIntervalTopMeasure-Depth'), false)
})

test('Should reject WellOpenIntervalTopMeasure equal to WellOpenIntervalBottomMeasure', { todo: 'needs cross-field compare, not supported by build' }, async () => {
  validate({ ActivityMediaName: 'Groundwater', WellOpenIntervalTopMeasure: -10, WellOpenIntervalTopUnit: 'm', WellOpenIntervalBottomMeasure: -10, WellOpenIntervalBottomUnit: 'm' })
  assert.equal(checkProperty(validate.errors, 'message', 'error-WellOpenIntervalTopMeasure-Depth'), true)
})

test('Should reject WellOpenIntervalTopMeasure not above BoreholeDepthMeasure', { todo: 'needs cross-field compare, not supported by build' }, async () => {
  validate({ ActivityMediaName: 'Groundwater', WellOpenIntervalTopMeasure: -30, WellOpenIntervalTopUnit: 'm', BoreholeDepthMeasure: -20, BoreholeDepthUnit: 'm' })
  assert.equal(checkProperty(validate.errors, 'message', 'error-WellOpenIntervalTopMeasure-Depth'), true)
})

test('Should reject WellOpenIntervalTopMeasure not above WellDepthMeasure', { todo: 'needs cross-field compare, not supported by build' }, async () => {
  validate({ ActivityMediaName: 'Groundwater', WellOpenIntervalTopMeasure: -30, WellOpenIntervalTopUnit: 'm', WellDepthMeasure: -20, WellDepthUnit: 'm' })
  assert.equal(checkProperty(validate.errors, 'message', 'error-WellOpenIntervalTopMeasure-Depth'), true)
})

test('Should accept WellOpenIntervalTopMeasure above BoreholeDepthMeasure and WellDepthMeasure', { todo: 'needs cross-field compare, not supported by build' }, async () => {
  validate({ ActivityMediaName: 'Groundwater', WellOpenIntervalTopMeasure: -10, WellOpenIntervalTopUnit: 'm', BoreholeDepthMeasure: -30, BoreholeDepthUnit: 'm', WellDepthMeasure: -20, WellDepthUnit: 'm' })
  assert.equal(checkProperty(validate.errors, 'message', 'error-WellOpenIntervalTopMeasure-Depth'), false)
})

test('Should accept WellOpenIntervalTopMeasure when no other depth is provided', { todo: 'needs cross-field compare, not supported by build' }, async () => {
  validate({ ActivityMediaName: 'Groundwater', WellOpenIntervalTopMeasure: -10, WellOpenIntervalTopUnit: 'm' })
  assert.equal(checkProperty(validate.errors, 'message', 'error-WellOpenIntervalTopMeasure-Depth'), false)
})

test('Should reject WellOpenIntervalBottomMeasure below BoreholeDepthMeasure', { todo: 'needs cross-field compare, not supported by build' }, async () => {
  validate({ ActivityMediaName: 'Groundwater', WellOpenIntervalBottomMeasure: -30, WellOpenIntervalBottomUnit: 'm', BoreholeDepthMeasure: -20, BoreholeDepthUnit: 'm' })
  assert.equal(checkProperty(validate.errors, 'message', 'error-WellOpenIntervalBottomMeasure-Depth'), true)
})

test('Should reject WellOpenIntervalBottomMeasure below WellDepthMeasure', { todo: 'needs cross-field compare, not supported by build' }, async () => {
  validate({ ActivityMediaName: 'Groundwater', WellOpenIntervalBottomMeasure: -30, WellOpenIntervalBottomUnit: 'm', WellDepthMeasure: -20, WellDepthUnit: 'm' })
  assert.equal(checkProperty(validate.errors, 'message', 'error-WellOpenIntervalBottomMeasure-Depth'), true)
})

test('Should accept WellOpenIntervalBottomMeasure equal to WellDepthMeasure', { todo: 'needs cross-field compare, not supported by build' }, async () => {
  validate({ ActivityMediaName: 'Groundwater', WellOpenIntervalBottomMeasure: -20, WellOpenIntervalBottomUnit: 'm', WellDepthMeasure: -20, WellDepthUnit: 'm' })
  assert.equal(checkProperty(validate.errors, 'message', 'error-WellOpenIntervalBottomMeasure-Depth'), false)
})

test('Should accept WellOpenIntervalBottomMeasure above BoreholeDepthMeasure', { todo: 'needs cross-field compare, not supported by build' }, async () => {
  validate({ ActivityMediaName: 'Groundwater', WellOpenIntervalBottomMeasure: -10, WellOpenIntervalBottomUnit: 'm', BoreholeDepthMeasure: -20, BoreholeDepthUnit: 'm' })
  assert.equal(checkProperty(validate.errors, 'message', 'error-WellOpenIntervalBottomMeasure-Depth'), false)
})

test('Should accept WellOpenIntervalBottomMeasure when no other depth is provided', { todo: 'needs cross-field compare, not supported by build' }, async () => {
  validate({ ActivityMediaName: 'Groundwater', WellOpenIntervalBottomMeasure: -10, WellOpenIntervalBottomUnit: 'm' })
  assert.equal(checkProperty(validate.errors, 'message', 'error-WellOpenIntervalBottomMeasure-Depth'), false)
})

test('Should reject Water level elevation without ResultValueType Calculated', async () => {
  validate({ ActivityMediaName: 'Groundwater', CharacteristicName: 'Water level elevation', ResultValue: 100, ResultUnit: 'm', ResultValueType: 'Actual' })
  assert.equal(checkProperty(validate.errors, 'message', 'error-WaterLevelElevation-ResultValueType'), true)
})

test('Should accept Water level elevation without ResultValueType Calculated', async () => {
  validate({ ActivityMediaName: 'Groundwater', CharacteristicName: 'Water level elevation', ResultValue: 100, ResultUnit: 'm', ResultValueType: 'Calculated' })
  assert.equal(checkProperty(validate.errors, 'message', 'error-WaterLevelElevation-ResultValueType'), false)
})

test('Should reject Water level elevation without ResultValueType', async () => {
  validate({ ActivityMediaName: 'Groundwater', CharacteristicName: 'Water level elevation', ResultValue: 100, ResultUnit: 'm' })
  assert.equal(checkProperty(validate.errors, 'message', 'error-WaterLevelElevation-ResultValueType'), true)
})

test('Should accept other CharacteristicName with ResultValueType Actual', async () => {
  validate({ ActivityMediaName: 'Groundwater', CharacteristicName: 'Temperature, water', ResultValue: 5, ResultUnit: 'deg C', ResultValueType: 'Actual' })
  assert.equal(checkProperty(validate.errors, 'message', 'error-WaterLevelElevation-ResultValueType'), false)
})

test('Should reject Water level elevation without ResultAnalyticalMethodName', async () => {
  validate({ ActivityMediaName: 'Groundwater', CharacteristicName: 'Water level elevation', ResultValue: 100, ResultUnit: 'm', ResultValueType: 'Calculated' })
  assert.equal(checkProperty(validate.errors, 'message', 'error-WaterLevelElevation-ResultAnalyticalMethodName'), true)
})

test('Should accept Water level elevation without ResultAnalyticalMethodName', async () => {
  validate({ ActivityMediaName: 'Groundwater', CharacteristicName: 'Water level elevation', ResultValue: 100, ResultUnit: 'm', ResultValueType: 'Calculated', ResultAnalyticalMethodName: 'Calculated' })
  assert.equal(checkProperty(validate.errors, 'message', 'error-WaterLevelElevation-ResultAnalyticalMethodName'), false)
})

test('Should reject Water level in well without ActivityDepthAltitudeReferencePoint (message key)', async () => {
  validate({ ActivityMediaName: 'Groundwater', CharacteristicName: 'Water level in well, depth from a reference point', ResultValue: -10, ResultUnit: 'm' })
  assert.equal(checkProperty(validate.errors, 'message', 'error-CharacteristicName-WaterLevel-ActivityDepthAltitudeReferencePoint'), true)
})

test('Should reject Multilevel Well without open interval', async () => {
  validate({ ActivityMediaName: 'Groundwater', MonitoringLocationType: 'Multilevel Well' })
  assert.equal(checkProperty(validate.errors, 'message', 'error-MonitoringLocationType-MultilevelWell-WellOpenInterval'), true)
})

test('Should accept Multilevel Well without open interval', async () => {
  validate({ ActivityMediaName: 'Groundwater', MonitoringLocationType: 'Multilevel Well', WellOpenIntervalTopMeasure: -10, WellOpenIntervalTopUnit: 'm', WellOpenIntervalBottomMeasure: -20, WellOpenIntervalBottomUnit: 'm' })
  assert.equal(checkProperty(validate.errors, 'message', 'error-MonitoringLocationType-MultilevelWell-WellOpenInterval'), false)
})

test('Should reject Multilevel Well missing WellOpenIntervalTopMeasure', async () => {
  validate({ ActivityMediaName: 'Groundwater', MonitoringLocationType: 'Multilevel Well', WellOpenIntervalTopUnit: 'm', WellOpenIntervalBottomMeasure: -20, WellOpenIntervalBottomUnit: 'm' })
  assert.equal(checkProperty(validate.errors, 'message', 'error-MonitoringLocationType-MultilevelWell-WellOpenInterval'), true)
})

test('Should reject Multilevel Well missing WellOpenIntervalTopUnit', async () => {
  validate({ ActivityMediaName: 'Groundwater', MonitoringLocationType: 'Multilevel Well', WellOpenIntervalTopMeasure: -10, WellOpenIntervalBottomMeasure: -20, WellOpenIntervalBottomUnit: 'm' })
  assert.equal(checkProperty(validate.errors, 'message', 'error-MonitoringLocationType-MultilevelWell-WellOpenInterval'), true)
})

test('Should reject Multilevel Well missing WellOpenIntervalBottomMeasure', async () => {
  validate({ ActivityMediaName: 'Groundwater', MonitoringLocationType: 'Multilevel Well', WellOpenIntervalTopMeasure: -10, WellOpenIntervalTopUnit: 'm', WellOpenIntervalBottomUnit: 'm' })
  assert.equal(checkProperty(validate.errors, 'message', 'error-MonitoringLocationType-MultilevelWell-WellOpenInterval'), true)
})

test('Should reject Multilevel Well missing WellOpenIntervalBottomUnit', async () => {
  validate({ ActivityMediaName: 'Groundwater', MonitoringLocationType: 'Multilevel Well', WellOpenIntervalTopMeasure: -10, WellOpenIntervalTopUnit: 'm', WellOpenIntervalBottomMeasure: -20 })
  assert.equal(checkProperty(validate.errors, 'message', 'error-MonitoringLocationType-MultilevelWell-WellOpenInterval'), true)
})

test('Should accept Well without open interval', async () => {
  validate({ ActivityMediaName: 'Groundwater', MonitoringLocationType: 'Well' })
  assert.equal(checkProperty(validate.errors, 'message', 'error-MonitoringLocationType-MultilevelWell-WellOpenInterval'), false)
})

test('Should reject Top of subaqueous sediment without Porewater', async () => {
  validate({ ActivityMediaName: 'Surface Water', ActivityDepthAltitudeReferencePoint: 'Top of subaqueous sediment' })
  assert.equal(checkProperty(validate.errors, 'message', 'error-ActivityDepthAltitudeReferencePoint-SubaqueousSediment-Porewater'), true)
})

test('Should accept Top of subaqueous sediment without Porewater', async () => {
  validate({ ActivityMediaName: 'Porewater', ActivityDepthAltitudeReferencePoint: 'Top of subaqueous sediment' })
  assert.equal(checkProperty(validate.errors, 'message', 'error-ActivityDepthAltitudeReferencePoint-SubaqueousSediment-Porewater'), false)
})

for (const value of ['Borehole', 'Dug Well', 'Multilevel Well', 'Nested Well', 'Other-Ground Water', 'Piezometer', 'Seep', 'Sump', 'Well']) {
  test(`Should reject groundwater-only MonitoringLocationType with Surface Water: ${value}`, async () => {
    validate({ ActivityMediaName: 'Surface Water', MonitoringLocationType: value })
    assert.equal(checkProperty(validate.errors, 'message', 'error-MonitoringLocationType-GroundwaterOnly-ActivityMediaName'), true)
  })
}

for (const value of ['Borehole', 'Dug Well', 'Multilevel Well', 'Nested Well', 'Other-Ground Water', 'Piezometer', 'Seep', 'Sump', 'Well']) {
  test(`Should accept groundwater-only MonitoringLocationType with Groundwater: ${value}`, async () => {
    validate({ ActivityMediaName: 'Groundwater', MonitoringLocationType: value })
    assert.equal(checkProperty(validate.errors, 'message', 'error-MonitoringLocationType-GroundwaterOnly-ActivityMediaName'), false)
  })
}

for (const value of ['Borehole', 'Dug Well', 'Multilevel Well', 'Nested Well', 'Other-Ground Water', 'Piezometer', 'Seep', 'Sump', 'Well']) {
  test(`Should accept groundwater-only MonitoringLocationType with Porewater: ${value}`, async () => {
    validate({ ActivityMediaName: 'Porewater', MonitoringLocationType: value })
    assert.equal(checkProperty(validate.errors, 'message', 'error-MonitoringLocationType-GroundwaterOnly-ActivityMediaName'), false)
  })
}

test('Should accept Spring with Surface Water', async () => {
  validate({ ActivityMediaName: 'Surface Water', MonitoringLocationType: 'Spring' })
  assert.equal(checkProperty(validate.errors, 'message', 'error-MonitoringLocationType-GroundwaterOnly-ActivityMediaName'), false)
})

for (const value of ['Water level elevation', 'Water level in well, depth from a reference point']) {
  test(`Should reject groundwater-only CharacteristicName with Surface Water: ${value}`, async () => {
    validate({ ActivityMediaName: 'Surface Water', CharacteristicName: value })
    assert.equal(checkProperty(validate.errors, 'message', 'error-CharacteristicName-GroundwaterOnly-ActivityMediaName'), true)
  })
}

for (const value of ['Water level elevation', 'Water level in well, depth from a reference point']) {
  test(`Should accept groundwater-only CharacteristicName with Groundwater: ${value}`, async () => {
    validate({ ActivityMediaName: 'Groundwater', CharacteristicName: value })
    assert.equal(checkProperty(validate.errors, 'message', 'error-CharacteristicName-GroundwaterOnly-ActivityMediaName'), false)
  })
}

for (const value of ['Atmosphere', 'Canal Drainage', 'Canal Irrigation', 'Canal Transport', 'Estuary', 'Great Lake', 'Lake/Pond', 'Ocean', 'Pond-Stormwater', 'Reservoir', 'River/Stream', 'Storm Sewer', 'Unspecified', 'Wetland']) {
  test(`Should reject surface-water-only MonitoringLocationType with Groundwater: ${value}`, async () => {
    validate({ ActivityMediaName: 'Groundwater', MonitoringLocationType: value })
    assert.equal(checkProperty(validate.errors, 'message', 'error-MonitoringLocationType-SurfaceWaterOnly-ActivityMediaName'), true)
  })
}

for (const value of ['Atmosphere', 'Canal Drainage', 'Canal Irrigation', 'Canal Transport', 'Estuary', 'Great Lake', 'Lake/Pond', 'Ocean', 'Pond-Stormwater', 'Reservoir', 'River/Stream', 'Storm Sewer', 'Unspecified', 'Wetland']) {
  test(`Should reject surface-water-only MonitoringLocationType with Porewater: ${value}`, async () => {
    validate({ ActivityMediaName: 'Porewater', MonitoringLocationType: value })
    assert.equal(checkProperty(validate.errors, 'message', 'error-MonitoringLocationType-SurfaceWaterOnly-ActivityMediaName'), true)
  })
}

for (const value of ['Atmosphere', 'Canal Drainage', 'Canal Irrigation', 'Canal Transport', 'Estuary', 'Great Lake', 'Lake/Pond', 'Ocean', 'Pond-Stormwater', 'Reservoir', 'River/Stream', 'Storm Sewer', 'Unspecified', 'Wetland']) {
  test(`Should accept surface-water-only MonitoringLocationType with Surface Water: ${value}`, async () => {
    validate({ ActivityMediaName: 'Surface Water', MonitoringLocationType: value })
    assert.equal(checkProperty(validate.errors, 'message', 'error-MonitoringLocationType-SurfaceWaterOnly-ActivityMediaName'), false)
  })
}

test('Should accept Spring with Groundwater', async () => {
  validate({ ActivityMediaName: 'Groundwater', MonitoringLocationType: 'Spring' })
  assert.equal(checkProperty(validate.errors, 'message', 'error-MonitoringLocationType-SurfaceWaterOnly-ActivityMediaName'), false)
})

for (const value of ['Bankfull Height', 'Depth of water column', 'Depth, Secchi disk depth', 'Depth, snow cover', 'Ice thickness', 'Light attenuation, depth at 99%', 'Transparency, Secchi tube with disk', 'Transparency, tube with disk', 'Water level', 'Water level (probe)', 'White ice thickness']) {
  test(`Should reject surface-water-only CharacteristicName with Groundwater: ${value}`, async () => {
    validate({ ActivityMediaName: 'Groundwater', CharacteristicName: value })
    assert.equal(checkProperty(validate.errors, 'message', 'error-CharacteristicName-SurfaceWaterOnly-ActivityMediaName'), true)
  })
}

for (const value of ['Bankfull Height', 'Depth of water column', 'Depth, Secchi disk depth', 'Depth, snow cover', 'Ice thickness', 'Light attenuation, depth at 99%', 'Transparency, Secchi tube with disk', 'Transparency, tube with disk', 'Water level', 'Water level (probe)', 'White ice thickness']) {
  test(`Should reject surface-water-only CharacteristicName with Porewater: ${value}`, async () => {
    validate({ ActivityMediaName: 'Porewater', CharacteristicName: value })
    assert.equal(checkProperty(validate.errors, 'message', 'error-CharacteristicName-SurfaceWaterOnly-ActivityMediaName'), true)
  })
}

for (const value of ['Bankfull Height', 'Depth of water column', 'Depth, Secchi disk depth', 'Depth, snow cover', 'Ice thickness', 'Light attenuation, depth at 99%', 'Transparency, Secchi tube with disk', 'Transparency, tube with disk', 'Water level', 'Water level (probe)', 'White ice thickness']) {
  test(`Should accept surface-water-only CharacteristicName with Surface Water: ${value}`, async () => {
    validate({ ActivityMediaName: 'Surface Water', CharacteristicName: value })
    assert.equal(checkProperty(validate.errors, 'message', 'error-CharacteristicName-SurfaceWaterOnly-ActivityMediaName'), false)
  })
}

test('Should reject ResultValue 0 when ResultUnit is DOY', async () => {
  validate({ ActivityMediaName: 'Surface Water', CharacteristicName: 'Day, ice on', ResultValue: 0, ResultUnit: 'DOY' })
  assert.equal(checkProperty(validate.errors, 'message', 'error-ResultValue-DOY-Range'), true)
})

test('Should reject ResultValue 367 when ResultUnit is DOY', async () => {
  validate({ ActivityMediaName: 'Surface Water', CharacteristicName: 'Day, ice on', ResultValue: 367, ResultUnit: 'DOY' })
  assert.equal(checkProperty(validate.errors, 'message', 'error-ResultValue-DOY-Range'), true)
})

test('Should reject ResultValue 1.5 when ResultUnit is DOY', async () => {
  validate({ ActivityMediaName: 'Surface Water', CharacteristicName: 'Day, ice on', ResultValue: 1.5, ResultUnit: 'DOY' })
  assert.equal(checkProperty(validate.errors, 'message', 'error-ResultValue-DOY-Range'), true)
})

test('Should accept ResultValue 300 when ResultUnit is DOY', async () => {
  validate({ ActivityMediaName: 'Surface Water', CharacteristicName: 'Day, ice on', ResultValue: 300, ResultUnit: 'DOY' })
  assert.equal(checkProperty(validate.errors, 'message', 'error-ResultValue-DOY-Range'), false)
})

test('Should accept ResultValue 1 when ResultUnit is DOY', async () => {
  validate({ ActivityMediaName: 'Surface Water', CharacteristicName: 'Day, ice on', ResultValue: 1, ResultUnit: 'DOY' })
  assert.equal(checkProperty(validate.errors, 'message', 'error-ResultValue-DOY-Range'), false)
})

test('Should accept ResultValue 366 when ResultUnit is DOY', async () => {
  validate({ ActivityMediaName: 'Surface Water', CharacteristicName: 'Day, ice on', ResultValue: 366, ResultUnit: 'DOY' })
  assert.equal(checkProperty(validate.errors, 'message', 'error-ResultValue-DOY-Range'), false)
})

