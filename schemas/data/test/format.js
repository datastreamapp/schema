const expect = require('chai').expect

const schema = require('../primary/index.json')
let validate = require('../frontend')
let validateStrict = require('../primary')
let validateBackend = require('../backend')

const checkProperty = (errors, keyword, property) => {
  for (const error of errors) {
    if (error.keyword === 'errorMessage') {
      const nested = checkProperty(error.params.errors, keyword, property)
      if (nested) return nested
    }
    if (error.keyword !== keyword) continue
    if (['required', 'dependencies'].includes(keyword) && error.params.missingProperty === property) return true
    else if (keyword === 'additionalProperties' && error.params.additionalProperty === property) return true
    else if (keyword === 'oneOf' && error.params.passingSchemas.includes(property)) return true
    else if (keyword === 'anyOf') return true
    else if (keyword === 'not' && error.instancePath.includes(property)) return true
    else if (keyword === 'enum' && error.instancePath.includes(property)) return true
    else if (keyword === 'minimum' && error.instancePath.includes(property)) return true
    else if (keyword === 'exclusiveMinimum' && error.instancePath.includes(property)) return true
    else if (keyword === 'maximum' && error.instancePath.includes(property)) return true
    else if (keyword === 'exclusiveMaximum' && error.instancePath.includes(property)) return true
    else if (keyword === 'pattern') return true
  }
  return false
}

describe('Formatting', function () {

  // TODO update to included strict and loose time format
  it('Should accept time formats', function (done) {
    validate({
      'ActivityStartTime': '9:15:00',
      'ActivityEndTime': '13:15:00.000',
      'AnalysisStartTime': '2:15'
    })
    expect(checkProperty(validate.errors, 'pattern', 'ActivityStartTime')).to.equal(false)
    expect(checkProperty(validate.errors, 'pattern', 'ActivityEndTime')).to.equal(false)
    expect(checkProperty(validate.errors, 'pattern', 'AnalysisStartTime')).to.equal(false)
    done()
  })

  it('Should reject time formats', function (done) {
    validate({
      'ActivityStartTime': '9:15.00',
      'ActivityEndTime': '13:15.00.000',
      'AnalysisStartTime': '2.15'
    })
    console.log(JSON.stringify(validate.errors, null, 2))
    expect(checkProperty(validate.errors, 'pattern', 'ActivityStartTime')).to.equal(true)
    expect(checkProperty(validate.errors, 'pattern', 'ActivityEndTime')).to.equal(true)
    expect(checkProperty(validate.errors, 'pattern', 'AnalysisStartTime')).to.equal(true)
    done()
  })

  it('Should accept timezone formats (strict)', function (done) {
    let valid = validateStrict({
      'AnalysisStartTimeZone': 'Z'
    })
    expect(validateStrict.errors.filter((i) => i.keyword === 'pattern').length).to.equal(0)

    valid = validateStrict({
      'AnalysisStartTimeZone': '+02:15'
    })
    expect(validateStrict.errors.filter((i) => i.keyword === 'pattern').length).to.equal(0)

    valid = validateStrict({
      'AnalysisStartTimeZone': '-02:15'
    })
    expect(validateStrict.errors.filter((i) => i.keyword === 'pattern').length).to.equal(0)

    done()
  })

  it('Should reject timezone formats (strict)', function (done) {
    let valid = validateStrict({
      'AnalysisStartTimeZone': 'z'
    })
    expect(validateStrict.errors.filter((i) => i.keyword === 'pattern').length).to.equal(1)
    valid = validateStrict({
      'AnalysisStartTimeZone': '9:45'
    })
    expect(validateStrict.errors.filter((i) => i.keyword === 'pattern').length).to.equal(1)
    valid = validateStrict({
      'AnalysisStartTimeZone': '-00:00:00'
    })
    expect(validateStrict.errors.filter((i) => i.keyword === 'pattern').length).to.equal(1)

    valid = validateStrict({
      'AnalysisStartTimeZone': '-0215'
    })
    expect(validateStrict.errors.filter((i) => i.keyword === 'pattern').length).to.equal(1)

    valid = validateStrict({
      'AnalysisStartTimeZone': '-215'
    })
    expect(validateStrict.errors.filter((i) => i.keyword === 'pattern').length).to.equal(1)

    valid = validateStrict({
      'AnalysisStartTimeZone': '-2:15'
    })
    expect(validateStrict.errors.filter((i) => i.keyword === 'pattern').length).to.equal(1)

    done()
  })

  it('Should reject timezone formats (loose)', function (done) {
    let valid = validateBackend({
      'AnalysisStartTimeZone': 'Z'
    })
    expect(validateBackend.errors).to.equal(null)

    valid = validateBackend({
      'AnalysisStartTimeZone': '+02:15'
    })
    expect(validateBackend.errors).to.equal(null)

    valid = validateBackend({
      'AnalysisStartTimeZone': '-02:15'
    })
    expect(validateBackend.errors).to.equal(null)

    valid = validateBackend({
      'AnalysisStartTimeZone': '-0215'
    })
    expect(validateBackend.errors).to.equal(null)

    valid = validateBackend({
      'AnalysisStartTimeZone': '-215'
    })
    expect(validateBackend.errors).to.equal(null)

    valid = validateBackend({
      'AnalysisStartTimeZone': '-2:15'
    })
    expect(validateBackend.errors).to.equal(null)

    done()
  })

  it('Should reject timezone formats (loose)', function (done) {
    let valid = validateBackend({
      'AnalysisStartTimeZone': 'z'
    })
    expect(validateBackend.errors.filter((i) => i.keyword === 'pattern').length).to.equal(1)
    valid = validateBackend({
      'AnalysisStartTimeZone': '9:45'
    })
    expect(validateBackend.errors.filter((i) => i.keyword === 'pattern').length).to.equal(1)
    valid = validateBackend({
      'AnalysisStartTimeZone': '-00:00:00'
    })
    expect(validateBackend.errors.filter((i) => i.keyword === 'pattern').length).to.equal(1)
    done()
  })

})
