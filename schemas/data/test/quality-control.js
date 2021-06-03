const expect = require('chai').expect

const validate = require('../quality-control')
const schema = require('../quality-control/index.json')

const defaultObject = {
  //"DatasetName":"Test",
  'MonitoringLocationID': 'A1',
  'MonitoringLocationName': 'A1 Test',
  'MonitoringLocationLatitude': 51.0486,
  'MonitoringLocationLongitude': -114.0708,
  'MonitoringLocationHorizontalCoordinateReferenceSystem': 'AMSMA',
  'MonitoringLocationType': 'ocean',
  'ActivityType': 'Field Msr/Obs',
  'ActivityMediaName': 'surface Water',
  'ActivityDepthHeightMeasure': -34,
  'ActivityDepthHeightUnit': 'm',
  'SampleCollectionEquipmentName': 'bucket',
  'CharacteristicName': 'aluminum',
  'MethodSpeciation': 'as B',
  'ResultSampleFraction': 'Dissolved',
  'ResultValue': 99.99,
  'ResultUnit': '#/100ml',
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
}

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

describe('Quality Control Checks', function () {

  it('Should accept with empty object', function(done) {
    const obj = {}
    const valid = validate(obj)
    console.log(valid, JSON.stringify(validate.errors, null, 2))
    expect(valid).to.equal(true)
    done()
  })

  it('Should accept with undefined values', function(done) {
    const obj = {}
    for(const key in defaultObject) {
      obj[key] = undefined
    }
    const valid = validate(obj)
    console.log(valid, JSON.stringify(validate.errors, null, 2))
    expect(valid).to.equal(true)
    done()
  })

  // it('Should accept with empty strings values', function(done) {
  //   const obj = {}
  //   for(const key in schema.properties) {
  //     if (schema.properties[key].type === 'string'
  //       && !(schema.properties[key].enum && schema.properties[key].enum.length)
  //       && !(schema.properties[key].pattern)
  //     ) obj[key] = ''
  //   }
  //   const valid = validate(obj)
  //   console.log(valid, JSON.stringify(validate.errors, null, 2))
  //   expect(valid).to.equal(true)
  //   done()
  // })



  it('Should reject improperly formatted time', function (done) {
    const valid = validate({
      'ActivityStartDate': '2020-01-01',
      'ActivityStartTime': '9:30:00'
    })
    expect(valid).to.equal(false)
    expect(checkProperty(validate.errors, 'pattern', 'ActivityStartTime')).to.equal(true)
    done()
  })

  // CharacteristicName-MethodSpeciation
  it('Should reject MethodSpeciation when its not expected', function (done) {

    const valid = validate({
      'CharacteristicName': 'pH',
      'MethodSpeciation': 'as N'
    })
    expect(valid).to.equal(false)
    expect(checkProperty(validate.errors, 'false schema', 'MethodSpeciation')).to.equal(true)
    done()
  })
  it('Should accept MethodSpeciation when its expected', function (done) {

    const valid = validate({
      'CharacteristicName': 'pH'
    })
    expect(valid).to.equal(true)
    done()
  })

  // CharacteristicName-ResultSampleFraction
  it('Should reject ResultSampleFraction when its not expected', function (done) {

    const valid = validate({
      'CharacteristicName': 'pH',
      'ResultSampleFraction': 'Total'
    })
    expect(valid).to.equal(false)
    expect(checkProperty(validate.errors, 'false schema', 'ResultSampleFraction')).to.equal(true)
    done()
  })
  it('Should accept ResultSampleFraction when its not expected', function (done) {

    const valid = validate({
      'CharacteristicName': 'pH'
    })
    expect(valid).to.equal(true)
    done()
  })

  // MonitoringLocationDepthHeightMeasure - TODO future?

  // ResultDetectionQuantitationLimitMeasure-Minimum
  it('Should reject when measure is below 0', function (done) {

    const valid = validate({
      'ResultDetectionQuantitationLimitMeasure': -1,
      'ResultDetectionQuantitationLimitUnit': 'mg/l'
    })
    expect(valid).to.equal(false)
    expect(checkProperty(validate.errors, 'minimum', 'ResultDetectionQuantitationLimitMeasure')).to.equal(true)
    done()
  })
  it('Should accept when measure is above 0', function (done) {

    const valid = validate({
      'ResultDetectionQuantitationLimitMeasure': 1,
      'ResultDetectionQuantitationLimitUnit': 'mg/l'
    })
    expect(valid).to.equal(true)
    done()
  })

  //ResultDetectionQuantitationLimitUnit-Allowed
  it('Should accept when ResultDetectionQuantitationLimitMeasure & ResultDetectionQuantitationLimitUnit exist', function (done) {

    const valid = validate({
      'CharacteristicName': 'Temperature, water',
      'ResultDetectionQuantitationLimitMeasure': 0,
      'ResultDetectionQuantitationLimitUnit': 'deg C'
    })
    expect(valid).to.equal(true)
    done()
  })
  it('Should reject when ResultDetectionQuantitationLimitUnit exists without ResultDetectionQuantitationLimitMeasure', function (done) {

    const valid = validate({
      'CharacteristicName': 'Temperature, water',
      'ResultDetectionQuantitationLimitUnit': 'deg C'
    })
    expect(valid).to.equal(false)
    expect(checkProperty(validate.errors, 'required', 'ResultDetectionQuantitationLimitMeasure')).to.equal(true)
    expect(checkProperty(validate.errors, 'false schema', 'ResultDetectionQuantitationLimitUnit')).to.equal(true)
    done()
  })

  // ResultUnit-Allowed
  it('Should accept when ResultValue & ResultUnit exist', function (done) {

    const valid = validate({
      'CharacteristicName': 'Temperature, water',
      'ResultValue': 0,
      'ResultUnit': 'deg C'
    })
    expect(valid).to.equal(true)
    done()
  })
  it('Should reject when ResultUnit exists without ResultValue', function (done) {

    const valid = validate({
      'CharacteristicName': 'Temperature, water',
      'ResultUnit': 'deg C'
    })
    expect(valid).to.equal(false)
    expect(checkProperty(validate.errors, 'required', 'ResultValue')).to.equal(true)
    expect(checkProperty(validate.errors, 'false schema', 'ResultUnit')).to.equal(true)
    done()
  })

  // ResultValue-DissolvedOxygenUnit
  it('Should reject Dissolved oxygen (DO) in %', function (done) {

    const valid = validate({
      'CharacteristicName': 'Dissolved oxygen (DO)',
      'ResultValue': 1,
      'ResultUnit': '%'
    })
    expect(valid).to.equal(false)
    expect(checkProperty(validate.errors, 'enum', 'ResultUnit')).to.equal(true)
    done()
  })
  it('Should accept Dissolved oxygen (DO) in mg/L', function (done) {

    const valid = validate({
      'CharacteristicName': 'Dissolved oxygen (DO)',
      'ResultValue': 1,
      'ResultUnit': 'mg/L'
    })
    expect(valid).to.equal(true)
    done()
  })

  // ResultValue-DOSatMinimum - TODO
  it('Should reject when measure is below 0', function (done) {

    const valid = validate({
      'ResultValue': -1,
      'ResultUnit': 'mg/l'
    })
    expect(valid).to.equal(false)
    expect(checkProperty(validate.errors, 'minimum', 'ResultValue')).to.equal(true)
    done()
  })
  it('Should accept when measure is above 0', function (done) {

    const valid = validate({
      'ResultValue': 1,
      'ResultUnit': 'mg/l'
    })
    expect(valid).to.equal(true)
    done()
  })

  // ResultValue-Minimum
  it('Should reject when measure is below 0', function (done) {

    const valid = validate({
      'ResultValue': -1,
      'ResultUnit': 'mg/l'
    })
    expect(valid).to.equal(false)
    expect(checkProperty(validate.errors, 'minimum', 'ResultValue')).to.equal(true)
    done()
  })
  it('Should accept when measure is above 0', function (done) {

    const valid = validate({
      'ResultValue': 1,
      'ResultUnit': 'mg/l'
    })
    expect(valid).to.equal(true)
    done()
  })

  // ResultValue-pHRange
  it('Should reject pH below range', function (done) {

    const valid = validate({
      'CharacteristicName': 'pH',
      'ResultValue': -1,
      'ResultUnit': 'None'
    })
    expect(valid).to.equal(false)
    expect(checkProperty(validate.errors, 'minimum', 'ResultValue')).to.equal(true)
    done()
  })
  it('Should reject pH above range', function (done) {

    const valid = validate({
      'CharacteristicName': 'pH',
      'ResultValue': 15,
      'ResultUnit': 'None'
    })
    expect(valid).to.equal(false)
    expect(checkProperty(validate.errors, 'maximum', 'ResultValue')).to.equal(true)
    done()
  })
  it('Should accept pH within range', function (done) {

    const valid = validate({
      'CharacteristicName': 'pH',
      'ResultValue': 7,
      'ResultUnit': 'None'
    })
    expect(valid).to.equal(true)
    done()
  })

  // ResultValue-TemperatureRange
  it('Should reject Temperature below range', function (done) {

    const valid = validate({
      'CharacteristicName': 'Temperature, water',
      'ResultValue': -101,
      'ResultUnit': 'deg C'
    })
    expect(valid).to.equal(false)
    expect(checkProperty(validate.errors, 'minimum', 'ResultValue')).to.equal(true)
    done()
  })
  it('Should reject Temperature above range', function (done) {

    const valid = validate({
      'CharacteristicName': 'Temperature, water',
      'ResultValue': 101,
      'ResultUnit': 'deg C'
    })
    expect(valid).to.equal(false)
    expect(checkProperty(validate.errors, 'maximum', 'ResultValue')).to.equal(true)
    done()
  })
  it('Should accept Temperature within range', function (done) {

    const valid = validate({
      'CharacteristicName': 'Temperature, water',
      'ResultValue': 0,
      'ResultUnit': 'deg C'
    })
    expect(valid).to.equal(true)
    done()
  })

})
