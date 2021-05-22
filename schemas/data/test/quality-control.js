const expect = require('chai').expect

const validate = require('../quality-control')

const defaultObject = {
  //"DatasetName":"Test",
  "MonitoringLocationID":"A1",
  "MonitoringLocationName":"A1 Test",
  "MonitoringLocationLatitude":51.0486,
  "MonitoringLocationLongitude":-114.0708,
  "MonitoringLocationHorizontalCoordinateReferenceSystem":"AMSMA",
  "MonitoringLocationType":"ocean",
  "ActivityType":"Field Msr/Obs",
  "ActivityMediaName":"surface Water",
  "ActivityDepthHeightMeasure":-34,
  "ActivityDepthHeightUnit":"m",
  "SampleCollectionEquipmentName":"bucket",
  "CharacteristicName":"aluminum",
  "MethodSpeciation":"as B",
  "ResultSampleFraction":"Dissolved",
  "ResultValue":99.99,
  "ResultUnit":"#/100ml",
  'ResultValueType':'Actual',
  "ResultStatusID":"Accepted",
  "ResultComment":"None at this time",
  "ResultAnalyticalMethodID":"1",
  "ResultAnalyticalMethodContext":"APHA",
  "ActivityStartDate":"2018-02-23",
  "ActivityStartTime":"13:15:00",
  "ActivityEndDate":"2018-02-23",
  "ActivityEndTime":"13:15:00",
  "LaboratoryName":"Farrell Labs",
  "LaboratorySampleID":"101010011110",
  "AnalysisStartDate":"2018-02-23",
  "AnalysisStartTime":"13:15:00",
  "AnalysisStartTimeZone":"-06:00"
}

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

describe('Quality Control Checks', function () {

  it('Should reject improperly formatted time', function (done) {
    const valid = validate({
      'ActivityStartDate': '2020-01-01',
      'ActivityStartTime': '9:30:00'
    })
    expect(valid).to.equal(false)
    expect(checkProperty(validate.errors, 'pattern', 'ActivityStartTime')).to.equal(true)
    done()
  })

  // #/allOf/6
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

  // #/allOf/7
  it('Should reject Dissolved oxygen saturation < 0', function (done) {

    const valid = validate(Object.assign({}, defaultObject, {
      'CharacteristicName': 'Dissolved oxygen saturation',
      'ResultValue': -2,
      'ResultUnit': '%'
    }))
    expect(valid).to.equal(false)
    expect(checkProperty(validate.errors, 'minimum', 'ResultValue')).to.equal(true)
    done()
  })
  it('Should accept Dissolved oxygen saturation >= 0', function (done) {

    const valid = validate(Object.assign({}, defaultObject, {
      'CharacteristicName': 'Dissolved oxygen saturation',
      'ResultValue': 0,
      'ResultUnit': '%'
    }))
    expect(valid).to.equal(true)
    done()
  })

  // #/allOf/7
  it('Should reject Hardness < 0', function (done) {

    const valid = validate({
      'CharacteristicName': 'Hardness',
      'ResultValue': -1,
      'ResultUnit': 'mg/L'
    })

    expect(valid).to.equal(false)
    expect(checkProperty(validate.errors, 'minimum', 'ResultValue')).to.equal(true)
    done()
  })

  it('Should accept Hardness >= 0', function (done) {

    const valid = validate({
      'CharacteristicName': 'Hardness',
      'ResultValue': 0,
      'ResultUnit': 'mg/L'
    })
    expect(valid).to.equal(true)
    done()
  })

  // #/allOf/8
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

  // #/allOf/9
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
