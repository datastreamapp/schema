const expect = require('chai').expect

const schema = require('../primary/index.json')
let validate = require('../frontend')
let validateStrict = require('../primary')
let validateBackend = require('../backend')

const checkProperty = (errors, keyword, property) => {
  if (errors === null) return false
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
    else if (keyword === 'false schema' && error.instancePath.includes(property)) return true
    else if (keyword === 'pattern') return true
  }
  return false
}

describe('Conditional Logic', function () {

  // allOf/1
  it('Should accept CharacteristicName AND NOT MethodSpeciation', function (done) {
    let valid = validate({
      'CharacteristicName': 'Calcium'
    })
    expect(checkProperty(validate.errors, 'required', 'CharacteristicName')).to.equal(false)
    expect(checkProperty(validate.errors, 'required', 'MethodSpeciation')).to.equal(false)
    done()
  })
  it('Should reject CharacteristicName AND NOT MethodSpeciation', function (done) {
    let valid = validate({
      'CharacteristicName': 'Nitrate'
    })
    expect(checkProperty(validate.errors, 'required', 'MethodSpeciation')).to.equal(true)
    done()
  })
  it('Should accept CharacteristicName AND MethodSpeciation', function (done) {
    let valid = validate({
      'CharacteristicName': 'Nitrate',
      'MethodSpeciation': 'as N'
    })
    expect(checkProperty(validate.errors, 'required', 'CharacteristicName')).to.equal(false)
    expect(checkProperty(validate.errors, 'required', 'MethodSpeciation')).to.equal(false)
    done()
  })

  // CharacteristicName-ResultSampleFraction
  it('Should accept CharacteristicName AND NOT ResultSampleFraction', function (done) {
    let valid = validate({
      'CharacteristicName': 'Dissolved oxygen (DO)'
    })
    expect(checkProperty(validate.errors, 'required', 'CharacteristicName')).to.equal(false)
    expect(checkProperty(validate.errors, 'required', 'ResultSampleFraction')).to.equal(false)
    done()
  })
  it('Should rejects CharacteristicName AND NOT ResultSampleFraction', function (done) {
    let valid = validate({
      'CharacteristicName': 'Silver'
    })
    expect(checkProperty(validate.errors, 'required', 'ResultSampleFraction')).to.equal(true)
    done()
  })
  it('Should accept CharacteristicName AND ResultSampleFraction', function (done) {
    let valid = validate({
      'CharacteristicName': 'Silver',
      'ResultSampleFraction': 'Dissolved'
    })
    expect(checkProperty(validate.errors, 'required', 'CharacteristicName')).to.equal(false)
    expect(checkProperty(validate.errors, 'required', 'ResultSampleFraction')).to.equal(false)
    done()
  })

  // CharacteristicName-Nutrient-ResultSampleFraction
  it('Should reject Nutrient CharacteristicName AND ResultSampleFraction', function (done) {
    let valid = validate({
      'CharacteristicName': 'Ammonia',
      'ResultSampleFraction': 'Total'
    })
    expect(checkProperty(validate.errors, 'required', 'CharacteristicName')).to.equal(false)
    expect(checkProperty(validate.errors, 'required', 'ResultSampleFraction')).to.equal(false)
    done()
  })
  it('Should accept Nutrient CharacteristicName AND filter ResultSampleFraction', function (done) {
    let valid = validate({
      'CharacteristicName': 'Ammonia',
      'ResultSampleFraction': 'Filtered'
    })
    expect(checkProperty(validate.errors, 'required', 'CharacteristicName')).to.equal(false)
    expect(checkProperty(validate.errors, 'required', 'ResultSampleFraction')).to.equal(false)
    done()
  })

  // allOf/3
  it('Should reject NOT ResultValue AND NOT ResultDetectionCondition', function (done) {
    let valid = validate({})
    expect(checkProperty(validate.errors, 'required', 'ResultValue')).to.equal(true)
    expect(checkProperty(validate.errors, 'required', 'ResultDetectionCondition')).to.equal(true)
    done()
  })
  it('Should reject ResultValue AND ResultDetectionCondition', function (done) {
    let valid = validate({
      'ResultValue': 1,
      'ResultDetectionCondition': 'Not Reported'
    })
    expect(checkProperty(validate.errors, 'false schema', 'ResultValue')).to.equal(true)
    expect(checkProperty(validate.errors, 'false schema', 'ResultDetectionCondition')).to.equal(true)
    done()
  })

  it('Should accept ResultValue OR ResultDetectionCondition', function (done) {
    let valid = validate({
      'ResultValue': 1,
    })
    expect(checkProperty(validate.errors, 'required', 'ResultValue')).to.equal(false)
    expect(checkProperty(validate.errors, 'required', 'ResultDetectionCondition')).to.equal(false)
    expect(checkProperty(validate.errors, 'enum', 'ResultValue')).to.equal(false)
    expect(checkProperty(validate.errors, 'enum', 'ResultDetectionCondition')).to.equal(false)

    valid = validate({
      'ResultDetectionCondition': 'Not Reported'
    })
    expect(checkProperty(validate.errors, 'required', 'ResultValue')).to.equal(false)
    expect(checkProperty(validate.errors, 'required', 'ResultDetectionCondition')).to.equal(false)
    expect(checkProperty(validate.errors, 'enum', 'ResultValue')).to.equal(false)
    expect(checkProperty(validate.errors, 'enum', 'ResultDetectionCondition')).to.equal(false)
    done()
  })

  // allOf/4

  it('Should reject ResultDetectionCondition = Present Above Quantification Limit', function (done) {
    let valid = validate({
      'ResultDetectionCondition': 'Present Above Quantification Limit'
    })
    expect(valid).to.equal(false)
    expect(checkProperty(validate.errors, 'dependencies', 'ResultDetectionQuantitationLimitType')).to.equal(true)
    expect(checkProperty(validate.errors, 'dependencies', 'ResultDetectionQuantitationLimitMeasure')).to.equal(true)
    expect(checkProperty(validate.errors, 'dependencies', 'ResultDetectionQuantitationLimitUnit')).to.equal(true)
    done()
  })

  it('Should reject ResultDetectionCondition = Present Below Quantification Limit', function (done) {
    let valid = validate({
      'ResultValue': 1,
      'ResultDetectionCondition': 'Present Below Quantification Limit'
    })
    expect(valid).to.equal(false)
    expect(checkProperty(validate.errors, 'dependencies', 'ResultDetectionQuantitationLimitType')).to.equal(true)
    expect(checkProperty(validate.errors, 'dependencies', 'ResultDetectionQuantitationLimitMeasure')).to.equal(true)
    expect(checkProperty(validate.errors, 'dependencies', 'ResultDetectionQuantitationLimitUnit')).to.equal(true)
    done()
  })

  it('Should accept ResultDetectionCondition', function (done) {
    let valid = validate({
      'ResultValue': 1,
      'ResultDetectionCondition': 'Present Below Quantification Limit',
      'ResultDetectionQuantitationLimitType':'A',
      'ResultDetectionQuantitationLimitMeasure':1,
      'ResultDetectionQuantitationLimitUnit':'mg/L'
    })
    expect(valid).to.equal(false)
    expect(checkProperty(validate.errors, 'dependencies', 'ResultDetectionQuantitationLimitType')).to.equal(false)
    expect(checkProperty(validate.errors, 'dependencies', 'ResultDetectionQuantitationLimitMeasure')).to.equal(false)
    expect(checkProperty(validate.errors, 'dependencies', 'ResultDetectionQuantitationLimitUnit')).to.equal(false)
    done()
  })

  // allOf/4
  it('Should reject ResultDetectionCondition = Not Detected', function (done) {
    let valid = validate({
      'ResultDetectionCondition': 'Not Detected',
      'ResultDetectionQuantitationLimitType': 'Sample Detection Limit',
      'ResultDetectionQuantitationLimitMeasure': 0,
      'ResultDetectionQuantitationLimitUnit': 'None'
    })
    expect(valid).to.equal(false)
    expect(checkProperty(validate.errors, 'false schema', 'ResultDetectionQuantitationLimitType')).to.equal(true)
    expect(checkProperty(validate.errors, 'false schema', 'ResultDetectionQuantitationLimitMeasure')).to.equal(true)
    expect(checkProperty(validate.errors, 'false schema', 'ResultDetectionQuantitationLimitUnit')).to.equal(true)

    done()
  })

  it('Should accept ResultDetectionCondition = Not Detected', function (done) {
    let valid = validate({
      'ResultDetectionCondition': 'Not Detected'
    })
    expect(valid).to.equal(false)
    expect(checkProperty(validate.errors, 'enum', 'ResultDetectionQuantitationLimitType')).to.equal(false)
    expect(checkProperty(validate.errors, 'enum', 'ResultDetectionQuantitationLimitMeasure')).to.equal(false)
    expect(checkProperty(validate.errors, 'enum', 'ResultDetectionQuantitationLimitUnit')).to.equal(false)

    done()
  })

  it('Should reject ResultDetectionCondition = Detected Not Quantified', function (done) {
    let valid = validate({
      'ResultDetectionCondition': 'Detected Not Quantified',
      'ResultDetectionQuantitationLimitType': 'Sample Detection Limit',
      'ResultDetectionQuantitationLimitMeasure': 0,
      'ResultDetectionQuantitationLimitUnit': 'None'
    })
    expect(valid).to.equal(false)
    expect(checkProperty(validate.errors, 'false schema', 'ResultDetectionQuantitationLimitType')).to.equal(true)
    expect(checkProperty(validate.errors, 'false schema', 'ResultDetectionQuantitationLimitMeasure')).to.equal(true)
    expect(checkProperty(validate.errors, 'false schema', 'ResultDetectionQuantitationLimitUnit')).to.equal(true)

    done()
  })

  it('Should accept ResultDetectionCondition = Detected Not Quantified', function (done) {
    let valid = validate({
      'ResultDetectionCondition': 'Detected Not Quantified'
    })
    expect(valid).to.equal(false)
    expect(checkProperty(validate.errors, 'enum', 'ResultDetectionQuantitationLimitType')).to.equal(false)
    expect(checkProperty(validate.errors, 'enum', 'ResultDetectionQuantitationLimitMeasure')).to.equal(false)
    expect(checkProperty(validate.errors, 'enum', 'ResultDetectionQuantitationLimitUnit')).to.equal(false)

    done()
  })

  // allOf/5
  it('Should reject ActivityType = Sample for ResultAnalyticalMethodID', function (done) {
    let valid = validate({
      'ActivityType': 'Sample-Other'
    })
    expect(valid).to.equal(false)
    expect(checkProperty(validate.errors, 'dependencies', 'ResultAnalyticalMethodID')).to.equal(true)
    expect(checkProperty(validate.errors, 'dependencies', 'ResultAnalyticalMethodContext')).to.equal(true)
    done()
  })
  it('Should accept ActivityType = Sample for ResultAnalyticalMethodID', function (done) {
    let valid = validate({
      'ActivityType': 'Sample-Other',
      'ResultAnalyticalMethodID': '0',
      'ResultAnalyticalMethodContext': 'ENV'
    })
    expect(valid).to.equal(false)
    expect(checkProperty(validate.errors, 'dependencies', 'ResultAnalyticalMethodID')).to.equal(false)
    expect(checkProperty(validate.errors, 'dependencies', 'ResultAnalyticalMethodContext')).to.equal(false)

    done()
  })

  it('Should reject ActivityType = Sample for ResultAnalyticalMethodName', function (done) {
    let valid = validate({
      'ActivityType': 'Sample-Other'
    })
    expect(valid).to.equal(false)
    expect(checkProperty(validate.errors, 'dependencies', 'ResultAnalyticalMethodName')).to.equal(true)
    done()
  })

  it('Should accept ActivityType = Sample for ResultAnalyticalMethodName', function (done) {
    let valid = validate({
      'ActivityType': 'Sample-Other',
      'ResultAnalyticalMethodName': 'Unspecified'
    })
    expect(valid).to.equal(false)
    expect(checkProperty(validate.errors, 'dependencies', 'ResultAnalyticalMethodName')).to.equal(false)

    done()
  })

})
