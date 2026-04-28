import { test } from "node:test";
import assert from "node:assert/strict";
import en from '../locales/en-CA.js'
import validate from '../quality-control/index.js'

test('Should transform error message', async (t) => {
  const valid = validate({
    ActivityType: 'Field Msr/Obs',
    CharacteristicName: 'Temperature, water',
    ResultSampleFraction: 'Filtered'
  })
  en(validate.errors)
  assert.equal(valid, false)
})

test('Should transform enum error message', async (t) => {
  const valid = validate({
    CharacteristicName: 'pH',
    ResultValue: 7,
    ResultUnit: 'mg/L'
  })
  assert.equal(valid, false)
  en(validate.errors)
  assert.equal(validate.errors.every(e => typeof e.message === 'string' && e.message.length > 0), true)
})

test('Should transform minimum error message', async (t) => {
  const valid = validate({
    ResultValue: -1,
    ResultUnit: 'mg/l'
  })
  assert.equal(valid, false)
  en(validate.errors)
  assert.equal(validate.errors.every(e => typeof e.message === 'string' && e.message.length > 0), true)
})

test('Should transform pattern error message', async (t) => {
  const valid = validate({
    ActivityStartDate: '2020-01-01',
    ActivityStartTime: '9:30:00'
  })
  assert.equal(valid, false)
  en(validate.errors)
  assert.equal(validate.errors.every(e => typeof e.message === 'string' && e.message.length > 0), true)
})

test('Should handle null errors gracefully', async (t) => {
  const valid = validate({})
  assert.equal(valid, true)
  en(validate.errors)
})
