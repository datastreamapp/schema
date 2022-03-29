import test from 'ava'

import validate from '../frontend/index.js'
import validateStrict from '../primary/index.js'
import validateBackend from '../backend/index.js'

const checkProperty = (errors, keyword, property) => {
  for (const error of errors) {
    if (error.keyword === 'errorMessage') {
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
    } else if (keyword === 'anyOf') return true
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
    } else if (keyword === 'pattern') return true
  }
  return false
}

// TODO update to included strict and loose time format
test('Should accept time formats', async (t) => {
  validate({
    ActivityStartTime: '9:15:00',
    ActivityEndTime: '13:15:00.000',
    AnalysisStartTime: '0:15'
  })
  t.is(checkProperty(validate.errors, 'pattern', 'ActivityStartTime'), false)
  t.is(checkProperty(validate.errors, 'pattern', 'ActivityEndTime'), false)
  t.is(checkProperty(validate.errors, 'pattern', 'AnalysisStartTime'), false)
})

test('Should reject time formats', async (t) => {
  validate({
    ActivityStartTime: '9:15.00',
    ActivityEndTime: '13:15.00.000',
    AnalysisStartTime: '2.15'
  })
  t.is(checkProperty(validate.errors, 'pattern', 'ActivityStartTime'), true)
  t.is(checkProperty(validate.errors, 'pattern', 'ActivityEndTime'), true)
  t.is(checkProperty(validate.errors, 'pattern', 'AnalysisStartTime'), true)

  validate({
    ActivityStartTime: '0:15',
    ActivityEndTime: '!0:15'
    // 'AnalysisStartTime': '2.15'
  })
  t.is(checkProperty(validate.errors, 'pattern', 'ActivityStartTime'), true)
  t.is(checkProperty(validate.errors, 'pattern', 'ActivityEndTime'), true)
  // t.is(checkProperty(validate.errors, 'pattern', 'AnalysisStartTime'), true)
})

test('Should accept timezone formats (strict)', async (t) => {
  let valid = validateStrict({
    AnalysisStartTimeZone: 'Z'
  })
  t.false(valid)
  t.is(validateStrict.errors.filter((i) => i.keyword === 'pattern').length, 0)

  valid = validateStrict({
    AnalysisStartTimeZone: '+02:15'
  })
  t.false(valid)
  t.is(validateStrict.errors.filter((i) => i.keyword === 'pattern').length, 0)

  valid = validateStrict({
    AnalysisStartTimeZone: '-02:15'
  })
  t.false(valid)
  t.is(validateStrict.errors.filter((i) => i.keyword === 'pattern').length, 0)
})

test('Should reject timezone formats (strict)', async (t) => {
  let valid = validateStrict({
    AnalysisStartTimeZone: 'z'
  })
  t.false(valid)
  t.is(validateStrict.errors.filter((i) => i.keyword === 'pattern').length, 1)
  valid = validateStrict({
    AnalysisStartTimeZone: '9:45'
  })
  t.false(valid)
  t.is(validateStrict.errors.filter((i) => i.keyword === 'pattern').length, 1)
  valid = validateStrict({
    AnalysisStartTimeZone: '-00:00:00'
  })
  t.false(valid)
  t.is(validateStrict.errors.filter((i) => i.keyword === 'pattern').length, 1)

  valid = validateStrict({
    AnalysisStartTimeZone: '-0215'
  })
  t.false(valid)
  t.is(validateStrict.errors.filter((i) => i.keyword === 'pattern').length, 1)

  valid = validateStrict({
    AnalysisStartTimeZone: '-215'
  })
  t.false(valid)
  t.is(validateStrict.errors.filter((i) => i.keyword === 'pattern').length, 1)

  valid = validateStrict({
    AnalysisStartTimeZone: '-2:15'
  })
  t.false(valid)
  t.is(validateStrict.errors.filter((i) => i.keyword === 'pattern').length, 1)
})

test('Should reject timezone formats (loose)', async (t) => {
  let valid = validateBackend({
    AnalysisStartTimeZone: 'Z'
  })
  t.true(valid)
  t.is(validateBackend.errors, null)

  valid = validateBackend({
    AnalysisStartTimeZone: '+02:15'
  })
  t.true(valid)
  t.is(validateBackend.errors, null)

  valid = validateBackend({
    AnalysisStartTimeZone: '-02:15'
  })
  t.true(valid)
  t.is(validateBackend.errors, null)

  valid = validateBackend({
    AnalysisStartTimeZone: '-0215'
  })
  t.true(valid)
  t.is(validateBackend.errors, null)

  valid = validateBackend({
    AnalysisStartTimeZone: '-215'
  })
  t.true(valid)
  t.is(validateBackend.errors, null)

  valid = validateBackend({
    AnalysisStartTimeZone: '-2:15'
  })
  t.true(valid)
  t.is(validateBackend.errors, null)
})

test('Should accept timezone formats (loose)', async (t) => {
  let valid = validateBackend({
    AnalysisStartTimeZone: 'z'
  })
  t.false(valid)
  t.is(validateBackend.errors.filter((i) => i.keyword === 'pattern').length, 1)
  valid = validateBackend({
    AnalysisStartTimeZone: '9:45'
  })
  t.false(valid)
  t.is(validateBackend.errors.filter((i) => i.keyword === 'pattern').length, 1)
  valid = validateBackend({
    AnalysisStartTimeZone: '-00:00:00'
  })
  t.false(valid)
  t.is(validateBackend.errors.filter((i) => i.keyword === 'pattern').length, 1)
})
