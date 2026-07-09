import { test } from 'node:test'
import assert from 'node:assert/strict'
import en from '../locales/en-CA.js'
import validate from '../quality-control/index.js'
import validateFrontend from '../frontend/index.js'
import validateExtract from '../extract/index.js'

test('Should transform error message', async (t) => {
  const valid = validate({
    ActivityType: 'Field Msr/Obs',
    CharacteristicName: 'Temperature, water',
    ResultSampleFraction: 'Filtered',
  })
  en(validate.errors)
  assert.equal(valid, false)
})

test('Should transform enum error message', async (t) => {
  const valid = validate({
    CharacteristicName: 'pH',
    ResultValue: 7,
    ResultUnit: 'mg/L',
  })
  assert.equal(valid, false)
  en(validate.errors)
  assert.equal(
    validate.errors.every(
      (e) => typeof e.message === 'string' && e.message.length > 0
    ),
    true
  )
})

test('Should transform minimum error message', async (t) => {
  const valid = validate({
    ResultValue: -1,
    ResultUnit: 'mg/l',
  })
  assert.equal(valid, false)
  en(validate.errors)
  assert.equal(
    validate.errors.every(
      (e) => typeof e.message === 'string' && e.message.length > 0
    ),
    true
  )
})

test('Should transform pattern error message', async (t) => {
  const valid = validate({
    ActivityStartDate: '2020-01-01',
    ActivityStartTime: '9:30:00',
  })
  assert.equal(valid, false)
  en(validate.errors)
  assert.equal(
    validate.errors.every(
      (e) => typeof e.message === 'string' && e.message.length > 0
    ),
    true
  )
})

test('Should handle null errors gracefully', async (t) => {
  const valid = validate({})
  assert.equal(valid, true)
  en(validate.errors)
})

// *** definitions-level errorMessage surfaces in frontend/extract *** //
// Regression guard: the build must NOT strip errorMessage from the shared
// definitions build (see bin/build `clean definitions`), or these friendly
// messages silently fall back to the raw regex.
const messageFor = (fn, record, field) => {
  fn(record)
  const errors = fn.errors ?? []
  en(errors)
  return errors.find(
    (e) => e.instancePath === '/' + field && e.keyword === 'errorMessage'
  )?.message
}

const validRow = {
  DatasetName: 'Test',
  MonitoringLocationID: 'L1',
  MonitoringLocationName: 'Station 1',
  MonitoringLocationLatitude: '45.4215',
  MonitoringLocationLongitude: '-75.6972',
  MonitoringLocationHorizontalCoordinateReferenceSystem: 'WGS84',
  MonitoringLocationType: 'Estuary',
  ActivityType: 'Field Msr/Obs',
  ActivityMediaName: 'Surface Water',
  ActivityStartDate: '2026-06-15',
  CharacteristicName: 'Temperature, water',
  ResultValue: '18.5',
  ResultUnit: 'deg C',
  ResultValueType: 'Actual',
}

test('frontend surfaces the friendly single-line string message', async (t) => {
  const message = messageFor(
    validateFrontend,
    { ...validRow, EventID: 'a\nb' },
    'EventID'
  )
  assert.match(message, /Only letters, numbers/)
})

test('extract surfaces the friendly single-line string message', async (t) => {
  const message = messageFor(
    validateExtract,
    { ...validRow, EventID: 'a\nb' },
    'EventID'
  )
  assert.match(message, /Only letters, numbers/)
})

test('frontend surfaces the friendly multiline string message', async (t) => {
  const message = messageFor(
    validateFrontend,
    { ...validRow, ResultComment: 'a\tb' },
    'ResultComment'
  )
  assert.match(message, /line feeds\/carriage returns are allowed/)
})

test('frontend surfaces the friendly date-format message', async (t) => {
  const message = messageFor(
    validateFrontend,
    { ...validRow, ActivityStartDate: 'not-a-date' },
    'ActivityStartDate'
  )
  assert.match(message, /YYYY-MM-DD/)
})

test('frontend surfaces the friendly loose-time message', async (t) => {
  const message = messageFor(
    validateFrontend,
    { ...validRow, ActivityStartTime: '99:99' },
    'ActivityStartTime'
  )
  assert.match(message, /HH:MM:SS/)
})

test('extract surfaces the friendly strict-time message', async (t) => {
  const message = messageFor(
    validateExtract,
    { ...validRow, ActivityStartTime: '9:30:00' },
    'ActivityStartTime'
  )
  assert.match(message, /leading zero/)
})

test('frontend surfaces the friendly timezone message', async (t) => {
  const message = messageFor(
    validateFrontend,
    {
      ...validRow,
      ActivityStartTime: '12:00:00',
      ActivityStartTimeZone: 'bad',
    },
    'ActivityStartTimeZone'
  )
  assert.match(message, /-06:00/)
})
