import test from 'ava'

import en from '../locales/en-CA.js'
import validate from '../quality-control/index.js'

test('Should transform error message', async (t) => {
  const valid = validate({
    ActivityType: 'Field Msr/Obs',
    ResultSampleFraction: 'Filtered'
  })
  //console.log(validate.errors)
  en(validate.errors)
  //console.log(validate.errors)
  t.is(valid, false)
})
