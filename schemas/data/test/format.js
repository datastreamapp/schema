const expect = require('chai').expect

const schema = require('../primary/index.json')
let validate = require('../frontend')
let validateStrict = require('../primary')
let validateBackend = require('../backend')

const checkProperty = (errors, keyword, property) => {
  for (let i = errors.length; i--; i) {
    const error = validate.errors[i]
    if (error.keyword !== keyword) continue
    if (['required', 'dependencies'].includes(keyword) && error.params.missingProperty === property) return true
    else if (keyword === 'enum' && error.params.allowedValues.length && error.dataPath === `/${property}`) return true
    else if (keyword === 'additionalProperties' && error.params.additionalProperty === property) return true
    else if (keyword === 'propertyNames' && error.params.propertyName === property) return true
    //else if(keyword === 'if' && error.params.failingKeyword === 'then' && error.schemaPath === property ) return true
    else if (keyword === 'oneOf' && error.params.passingSchemas.includes(property)) return true
    else if (keyword === 'anyOf') return true
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
    expect(validate.errors.filter((i) => i.keyword === 'pattern').length).to.equal(0)
    done()
  })

  it('Should reject time formats', function (done) {
    validate({
      'ActivityStartTime': '9:15.00',
      'ActivityEndTime': '13:15.00.000',
      'AnalysisStartTime': '2.15'
    })
    expect(validate.errors.filter((i) => i.keyword === 'pattern').length).to.equal(3)
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
