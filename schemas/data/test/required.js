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

describe('Required / Dependencies', function () {

  it('Should not set any defaults', function (done) {
    let data = {}
    let valid = validate(data)
    expect(data).to.deep.equal({})

    done()
  })

  it('Should require properties', function (done) {
    let valid = validate({})
    expect(valid).to.equal(false)

    // #/allOf/0
    expect(checkProperty(validate.errors, 'required', 'DatasetName')).to.equal(true)
    expect(checkProperty(validate.errors, 'required', 'MonitoringLocationID')).to.equal(true)
    expect(checkProperty(validate.errors, 'required', 'MonitoringLocationName')).to.equal(true)
    expect(checkProperty(validate.errors, 'required', 'MonitoringLocationType')).to.equal(true)
    expect(checkProperty(validate.errors, 'required', 'MonitoringLocationLatitude')).to.equal(true)
    expect(checkProperty(validate.errors, 'required', 'MonitoringLocationLongitude')).to.equal(true)
    expect(checkProperty(validate.errors, 'required', 'MonitoringLocationHorizontalCoordinateReferenceSystem')).to.equal(true)
    expect(checkProperty(validate.errors, 'required', 'ActivityType')).to.equal(true)
    expect(checkProperty(validate.errors, 'required', 'ActivityMediaName')).to.equal(true)
    expect(checkProperty(validate.errors, 'required', 'ActivityStartDate')).to.equal(true)
    expect(checkProperty(validate.errors, 'required', 'CharacteristicName')).to.equal(true)
    expect(checkProperty(validate.errors, 'required', 'ResultValueType')).to.equal(true)

    done()
  })

  it('Should not require properties', function (done) {
    let valid = validate({
      'DatasetName': 'Test',
      'MonitoringLocationID': 'A1',
      'MonitoringLocationName': 'A1 Test',
      'MonitoringLocationLatitude': '51.0486',
      'MonitoringLocationLongitude': '-114.0708',
      'MonitoringLocationHorizontalCoordinateReferenceSystem': 'AMSMA',
      'MonitoringLocationType': 'Ocean',
      'ActivityType': 'Field Msr/Obs',
      'ActivityMediaName': 'Surface Water',
      'ActivityDepthHeightMeasure': '-34',
      'ActivityDepthHeightUnit': 'm',
      'SampleCollectionEquipmentName': 'Bucket',
      'CharacteristicName': 'Sulfur',
      'MethodSpeciation': 'as B',
      'ResultSampleFraction': 'Dissolved',
      'ResultValue': '99.99',
      'ResultUnit': 'ug/l',
      'ResultValueType': 'Actual',
      'ResultStatusID': 'Accepted',
      'ResultComment': 'None at this time',
      'ResultAnalyticalMethodID': '1',
      'ResultAnalyticalMethodContext': 'APHA',
      'ActivityStartDate': '2018-02-23',
      'ActivityStartTime': '13:15:00',
      'ActivityEndDate': '2018-02-23',
      'ActivityEndTime': '13:15:00',
      'LaboratoryName': 'Farrell Labs',
      'LaboratorySampleID': '101010011110',
      'AnalysisStartDate': '2018-02-23',
      'AnalysisStartTime': '13:15:00',
      'AnalysisStartTimeZone': '-06:00'
    })
    expect(valid).to.equal(true)
    done()
  })

  it('Should reject additional headers', function (done) {
    let valid = validate({
      'MonitoringLocationWaterBody': 'Lake'
    })
    expect(valid).to.equal(false)
    expect(checkProperty(validate.errors, 'additionalProperties', 'MonitoringLocationWaterBody')).to.equal(true)

    done()
  })

  it('Should reject ActivityDepthHeightMeasure AND NOT ActivityDepthHeightUnit', function (done) {
    let valid = validate({
      'ActivityDepthHeightMeasure': true
    })
    expect(valid).to.equal(false)
    expect(checkProperty(validate.errors, 'dependencies', 'ActivityDepthHeightUnit')).to.equal(true)
    done()
  })
  it('Should accept ActivityDepthHeightMeasure AND ActivityDepthHeightUnit', function (done) {
    let valid = validate({
      'ActivityDepthHeightMeasure': true,
      'ActivityDepthHeightUnit': true
    })
    expect(valid).to.equal(false)
    expect(checkProperty(validate.errors, 'dependencies', 'ActivityDepthHeightUnit')).to.equal(false)
    done()
  })

  it('Should reject ResultValue AND NOT ResultUnit', function (done) {
    let valid = validate({
      'ResultValue': true
    })
    expect(valid).to.equal(false)
    expect(checkProperty(validate.errors, 'dependencies', 'ResultUnit')).to.equal(true)
    done()
  })
  it('Should reject ResultValue AND ResultUnit', function (done) {
    let valid = validate({
      'ResultValue': true,
      'ResultUnit': true
    })
    expect(valid).to.equal(false)
    expect(checkProperty(validate.errors, 'dependencies', 'ResultUnit')).to.equal(false)
    done()
  })

  it('Should reject ResultDetectionQuantitationLimitMeasure AND NOT ResultDetectionQuantitationLimitUnit', function (done) {
    let valid = validate({
      'ResultDetectionQuantitationLimitMeasure': true
    })
    expect(valid).to.equal(false)
    expect(checkProperty(validate.errors, 'dependencies', 'ResultDetectionQuantitationLimitUnit')).to.equal(true)
    done()
  })
  it('Should accept ResultDetectionQuantitationLimitMeasure AND ResultDetectionQuantitationLimitUnit', function (done) {
    let valid = validate({
      'ResultDetectionQuantitationLimitMeasure': true,
      ResultDetectionQuantitationLimitUnit: true
    })
    expect(valid).to.equal(false)
    expect(checkProperty(validate.errors, 'dependencies', 'ResultDetectionQuantitationLimitUnit')).to.equal(false)
    done()
  })

  it('Should reject AnalysisStartTime AND NOT AnalysisStartTimeZone', function (done) {
    let valid = validate({
      'AnalysisStartTime': true
    })
    expect(checkProperty(validate.errors, 'dependencies', 'AnalysisStartTimeZone')).to.equal(true)
    done()
  })

  it('Should accept AnalysisStartTime AND AnalysisStartTimeZone', function (done) {
    let valid = validate({
      'AnalysisStartTime': true,
      AnalysisStartTimeZone: true
    })
    expect(checkProperty(validate.errors, 'dependencies', 'AnalysisStartTimeZone')).to.equal(false)
    done()
  })

})
