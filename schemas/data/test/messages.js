import test from 'ava'

import en from '../locales/en-CA.js'
import validate from '../quality-control/index.js'

test('Should transform error message', async (t) => {
  const valid = validate({
    ActivityType: 'Field Msr/Obs',
    CharacteristicName: 'Temperature, water',
    ResultSampleFraction: 'Filtered'
  })
  en(validate.errors)
  t.is(valid, false)
})

test('Should transform enum error message', async (t) => {
  const valid = validate({
    CharacteristicName: 'pH',
    ResultValue: 7,
    ResultUnit: 'mg/L'
  })
  t.is(valid, false)
  en(validate.errors)
  t.true(validate.errors.every(e => typeof e.message === 'string' && e.message.length > 0))
})

test('Should transform minimum error message', async (t) => {
  const valid = validate({
    ResultValue: -1,
    ResultUnit: 'mg/l'
  })
  t.is(valid, false)
  en(validate.errors)
  t.true(validate.errors.every(e => typeof e.message === 'string' && e.message.length > 0))
})

test('Should transform pattern error message', async (t) => {
  const valid = validate({
    ActivityStartDate: '2020-01-01',
    ActivityStartTime: '9:30:00'
  })
  t.is(valid, false)
  en(validate.errors)
  t.true(validate.errors.every(e => typeof e.message === 'string' && e.message.length > 0))
})

test('Should handle null errors gracefully', async (t) => {
  const valid = validate({})
  t.is(valid, true)
  en(validate.errors)
  t.pass()
})
