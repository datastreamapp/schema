const expect = require('chai').expect

const schema = require('../dist/json-schema/index.json')
//const validate = require('../dist/validate')

// Start Manual
const Ajv = require('ajv')

const ajv = new Ajv({
  v5: true,
  format: 'full',
  coerceTypes: true,
  allErrors: true,
  useDefaults: true
})
require('ajv-keywords')(ajv, ['transform'])
const validate = ajv.compile(schema)
// End Manual

const checkProperty = (errors, keyword, property) => {
  for (let i = errors.length; i--; i) {
    const error = validate.errors[i]
    if (error.keyword !== keyword) continue
    if (['required', 'dependencies'].includes(keyword) && error.params.missingProperty === property) return true
    else if (keyword === 'additionalProperties' && error.params.additionalProperty === property) return true
    else if(keyword === 'oneOf' && error.params.passingSchemas.includes(property)) return true
    else if(keyword === 'anyOf') return true
  }
  return false
}

describe('DataStream Schema', function () {

  it('Should set defaults', function (done) {
    let data = {}
    const valid = validate(data)
    expect(valid).to.equal(false)

    //expect(data.MonitoringLocationHorizontalCoordinateReferenceSystem).to.equal('UNKWN')
    //expect(data.ResultValueType).to.equal('Actual') // WQX only right now
    //expect(Object.keys(data).length).to.equal(1)

    done()
  })

  it('Should require properties', function (done) {
    const valid = validate({})
    expect(valid).to.equal(false)

    // check required error out
    schema.required.forEach((property) => {
      if (property === 'MonitoringLocationHorizontalCoordinateReferenceSystem') return
      expect(checkProperty(validate.errors, 'required', property)).to.equal(true)
    })

    done()
  })

  it('Should not require properties', function (done) {
    const valid = validate({
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
      'SampleCollectionEquipmentName': 'Bongo Net',
      'CharacteristicName': 'Silver Dioxide',
      'MethodSpeciation': 'as B',
      'ResultSampleFraction': 'Dissolved',
      'ResultValue': '99.99',
      'ResultUnit': 'ug',
      'ResultValueType':'Actual',
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
      'AnalysisStartTimeZone': '-0600'
    })
    //console.log(validate.errors)
    expect(valid).to.equal(true)
    done()
  })

  it('Should reject additional headers', function (done) {
    const valid = validate({
      'MonitoringLocationWaterBody': 'Lake'
    })
    expect(valid).to.equal(false)
    expect(checkProperty(validate.errors, 'additionalProperties', 'MonitoringLocationWaterBody')).to.equal(true)

    done()
  })

  describe('Should enforce conditional required', function () {


    it('ResultValue', function (done) {
      const valid = validate({
        'ResultValue': true,
        'ResultAnalyticalMethodID': true
      })
      expect(valid).to.equal(false)
      expect(checkProperty(validate.errors, 'required', 'ResultDetectionCondition')).to.equal(false)
      done()
    })

    it('ResultDetectionCondition', function (done) {
      const valid = validate({
        'ResultDetectionCondition': true
      })
      expect(valid).to.equal(false)
      expect(checkProperty(validate.errors, 'required', 'ResultValue')).to.equal(false)
      done()
    })

    it('NOT ResultAnalyticalMethodID & NOT ResultAnalyticalMethodName', function (done) {
      const valid = validate({})
      expect(valid).to.equal(false)
      expect(checkProperty(validate.errors, 'required', 'ResultAnalyticalMethodID')).to.equal(false)
      expect(checkProperty(validate.errors, 'required', 'ResultAnalyticalMethodName')).to.equal(false)
      done()
    })

    it('ResultAnalyticalMethodID', function (done) {
      const valid = validate({
        'ResultAnalyticalMethodID': true
      })
      expect(valid).to.equal(false)
      expect(checkProperty(validate.errors, 'required', 'ResultAnalyticalMethodName')).to.equal(false)
      done()
    })

    it('ResultAnalyticalMethodName', function (done) {
      const valid = validate({
        'ResultAnalyticalMethodName': true
      })
      expect(valid).to.equal(false)
      expect(checkProperty(validate.errors, 'required', 'ResultAnalyticalMethodID')).to.equal(false)
      done()
    })

    it('ResultAnalyticalMethodID & ResultAnalyticalMethodName', function (done) {
      const valid = validate({
        'ResultAnalyticalMethodID': true,
        'ResultAnalyticalMethodName': true
      })
      expect(valid).to.equal(false)
      //console.log(JSON.stringify(validate.errors, null, 2))
      // TODO add test
      done()
    })
  })

  describe('Should require allOf', function () {

    // allOf/0
    it('NOT ResultValue AND NOT ResultDetectionCondition', function (done) {
      const valid = validate({})
      expect(valid).to.equal(false)
      expect(checkProperty(validate.errors, 'required', 'ResultValue')).to.equal(true)
      expect(checkProperty(validate.errors, 'required', 'ResultDetectionCondition')).to.equal(true)
      done()
    })
    it('ResultValue AND ResultDetectionCondition', function (done) {
      const valid = validate({
        'ResultValue': 1,
        'ResultDetectionCondition': 'Not Detected'
      })
      expect(valid).to.equal(false)
      expect(checkProperty(validate.errors, 'oneOf', 0)).to.equal(true)
      expect(checkProperty(validate.errors, 'oneOf', 1)).to.equal(true)
      done()
    })

    // allOf/1
    it('CharacteristicName AND MedthodSpeciation', function (done) {
      const valid = validate({
        'CharacteristicName': 'Nitrate'
      })
      expect(valid).to.equal(false)
      expect(checkProperty(validate.errors, 'required', 'MethodSpeciation')).to.equal(true)
      done()
    })

    // allOf/2
    it('CharacteristicName AND ResultSampleFraction', function (done) {
      const valid = validate({
        'CharacteristicName': 'Silver'
      })
      expect(valid).to.equal(false)
      expect(checkProperty(validate.errors, 'required', 'ResultSampleFraction')).to.equal(true)
      done()
    })

    // allOf/3
    it('ResultDetectionCondition = Not Detected', function (done) {
      const valid = validate({
        'ResultDetectionCondition': 'Not Detected'
      })
      expect(valid).to.equal(false)
      expect(checkProperty(validate.errors, 'dependencies', 'ResultDetectionQuantitationLimitType')).to.equal(true)
      expect(checkProperty(validate.errors, 'dependencies', 'ResultDetectionQuantitationLimitMeasure')).to.equal(true)
      expect(checkProperty(validate.errors, 'dependencies', 'ResultDetectionQuantitationLimitUnit')).to.equal(true)
      done()
    })

    it('ResultDetectionCondition = Present Above Quantification Limit', function (done) {
      const valid = validate({
        'ResultDetectionCondition': 'Present Above Quantification Limit'
      })
      expect(valid).to.equal(false)
      expect(checkProperty(validate.errors, 'dependencies', 'ResultDetectionQuantitationLimitType')).to.equal(true)
      expect(checkProperty(validate.errors, 'dependencies', 'ResultDetectionQuantitationLimitMeasure')).to.equal(true)
      expect(checkProperty(validate.errors, 'dependencies', 'ResultDetectionQuantitationLimitUnit')).to.equal(true)
      done()
    })

    it('ResultDetectionCondition = Present Below Quantification Limit', function (done) {
      const valid = validate({
        'ResultDetectionCondition': 'Present Below Quantification Limit'
      })
      expect(valid).to.equal(false)
      expect(checkProperty(validate.errors, 'dependencies', 'ResultDetectionQuantitationLimitType')).to.equal(true)
      expect(checkProperty(validate.errors, 'dependencies', 'ResultDetectionQuantitationLimitMeasure')).to.equal(true)
      expect(checkProperty(validate.errors, 'dependencies', 'ResultDetectionQuantitationLimitUnit')).to.equal(true)
      done()
    })

    it('ResultDetectionCondition false', function (done) {
      const valid = validate({
        'ResultDetectionCondition': ''
      })
      expect(valid).to.equal(false)
      expect(checkProperty(validate.errors, 'dependencies', 'ResultDetectionQuantitationLimitType')).to.equal(false)
      expect(checkProperty(validate.errors, 'dependencies', 'ResultDetectionQuantitationLimitMeasure')).to.equal(false)
      expect(checkProperty(validate.errors, 'dependencies', 'ResultDetectionQuantitationLimitUnit')).to.equal(false)
      done()
    })

    // allOf/4
    it('ActivityType = Sample', function (done) {
      const valid = validate({
        'ActivityType': 'Sample-Other'
      })
      expect(valid).to.equal(false)
      expect(checkProperty(validate.errors, 'dependencies', 'ResultAnalyticalMethodID')).to.equal(true)
      expect(checkProperty(validate.errors, 'dependencies', 'ResultAnalyticalMethodContext')).to.equal(true)
      done()
    })

  })

  describe('Should require dependencies', function () {
    it('ActivityDepthHeightMeasure', function (done) {
      const valid = validate({
        'ActivityDepthHeightMeasure': true
      })
      expect(valid).to.equal(false)
      expect(checkProperty(validate.errors, 'dependencies', 'ActivityDepthHeightUnit')).to.equal(true)
      done()
    })

    it('ResultValue', function (done) {
      const valid = validate({
        'ResultValue': true
      })
      expect(valid).to.equal(false)
      expect(checkProperty(validate.errors, 'dependencies', 'ResultUnit')).to.equal(true)
      done()
    })

    it('ResultDetectionQuantitationLimitMeasure', function (done) {
      const valid = validate({
        'ResultDetectionQuantitationLimitMeasure': true
      })
      expect(valid).to.equal(false)
      expect(checkProperty(validate.errors, 'dependencies', 'ResultDetectionQuantitationLimitUnit')).to.equal(true)
      done()
    })
  })

  it('Should validate time', function (done) {
    const valid = validate({

      'ActivityStartTime': '9:15:00',
      'ActivityEndTime': '13:15:00.000',
      'AnalysisStartTime': '2:15'
    })
    expect(validate.errors.filter((i) => i.keyword === 'pattern').length).to.equal(0)
    done()
  })

  it('Should validate wrong time', function (done) {
    const valid = validate({
      'ActivityStartTime': '9:15.00'
    })
    expect(validate.errors.filter((i) => i.keyword === 'pattern').length).to.equal(1)
    done()
  })

  /*it('Should pass manual test', function (done) {
    const valid = validate(
      {'DatasetName': 'PROVINCIAL (STREAM) WATER QUALITY MONITORING NETWORK (PWQMN)', 'MonitoringLocationID': '17002113002', 'MonitoringLocationName': 'Hwys 7 and 35, upstrm Lindsay', 'MonitoringLocationLatitude': 44.32767014, 'MonitoringLocationLongitude': -78.73027636, 'MonitoringLocationHorizontalCoordinateReferenceSystem': 'UNKWN', 'MonitoringLocationType': 'Unspecified', 'ActivityType': 'Sample-Routine', 'ActivityMediaName': 'Surface Water', 'ActivityStartDate': '2017-04-11', 'SampleCollectionEquipmentName': 'Water Bottle', 'CharacteristicName': 'Total hardness', 'ResultValueType': 'Actual', 'ResultDetectionCondition': 'Below Detection/Quantification Limit', 'ResultDetectionQuantitationLimitMeasure': 1.0, 'ResultDetectionQuantitationLimitUnit': 'mg/l', 'ResultDetectionQuantitationLimitType': 'Method Detection Level', 'ResultStatusID': 'Accepted', 'ResultComment': 'LESS THAN METHOD DETECTION LIMIT', 'ResultAnalyticalMethodID': 'E3497', 'ResultAnalyticalMethodContext': 'PROPRIETARY', 'ResultAnalyticalMethodName': 'THE DETERMINATION OF METALS IN WATER BY INDUCTIVELY COUPLED PLASMA - OPTICAL EMISSION SPECTROSCOPY (ICP-OES)', 'LaboratoryName': 'Ontario Ministry Labs', 'LaboratorySampleID': 'C237623'}
    )
    console.log(JSON.stringify(validate.errors, null, 2))
    expect(0).to.equal(1)
    done()
  })*/

})

// Print out coverage report
// const collector = new istanbul.Collector();
// const reporter = new istanbul.Reporter();
// const sync = true;
//
// collector.add(global.__coverage__);
//
// reporter.add('text');
// reporter.addAll([ 'lcov', 'html' ]);
//
// const oldLog = console.log;
// let logged;
// console.log = (str) => {
//     logged = str;
// };
//
// reporter.write(collector, sync, function () {
//     console.log = oldLog;
//     console.log('Coverage Report');
//     console.log(logged);
// });


