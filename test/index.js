const expect = require('chai').expect

const schema = require('../dist/json-schema')
const validate = require('../dist/validate')

const checkMissingProperty = (errors, keyword, property) => {
  for (let i = errors.length; i--; i) {
    const error = validate.errors[i]
    if (error.keyword !== keyword) continue
    if (error.params.missingProperty === property) return true
  }
  return false
}

describe('DataStream Schema', function () {

  it('Should set defaults', function (done) {
    let data = {}
    const valid = validate(data)
    expect(valid).to.equal(false)

    //expect(data.MonitoringLocationHorizontalCoordinateReferenceSystem).to.equal('UNKWN')
    expect(Object.keys(data).length).to.equal(0)

    done()
  })

  it('Should require properties', function (done) {
    const valid = validate({})
    expect(valid).to.equal(false)

    // check required error out
    schema.required.forEach((property) => {
      if (property === 'MonitoringLocationHorizontalCoordinateReferenceSystem') return
      expect(checkMissingProperty(validate.errors, 'required', property)).to.equal(true)
    })

    done()
  })

  it('Should not require properties', function (done) {
    const valid = validate({
      "DatasetName":"Test",
      "MonitoringLocationID":"A1",
      "MonitoringLocationName":"A1 Test",
      "MonitoringLocationLatitude":"51.0486",
      "MonitoringLocationLongitude":"-114.0708",
      "MonitoringLocationHorizontalCoordinateReferenceSystem":"AMSMA",
      "MonitoringLocationRegion":"Calgary",
      "MonitoringLocationType":"Atmosphere",
      "MonitoringLocationWaterbody":"Elbow River",
      "ActivityType":"Field Msr/Obs",
      "ActivityMediaName":"Water",
      "ActivityDepthHeightMeasure":"-34",
      "ActivityDepthHeightUnit":"m",
      "SampleCollectionEquipmentName":"Bongo Net",
      "CharacteristicName":"(E)-Dimethomorph",
      "MethodSpeciation":"as B",
      "ResultSampleFraction":"Dissolved",
      "ResultValue":"99.99",
      "ResultUnit":"#/100ml",
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
      "AnalysisStartTimeZone":"-0600"
    })
    //console.log(validate.errors)
    expect(valid).to.equal(true)
    done()
  })

  describe('Should enforce conditional required', function () {
    it('NOT ResultValue & NOT ResultDetectionCondition', function (done) {
      const valid = validate({})
      expect(valid).to.equal(false)
      expect(checkMissingProperty(validate.errors, 'required', 'ResultValue')).to.equal(true)
      expect(checkMissingProperty(validate.errors, 'required', 'ResultDetectionCondition')).to.equal(true)
      done()
    })

    it('ResultValue', function (done) {
      const valid = validate({
        'ResultValue': true,
        'ResultAnalyticalMethodID': true
      })
      expect(valid).to.equal(false)
      expect(checkMissingProperty(validate.errors, 'required', 'ResultDetectionCondition')).to.equal(false)
      done()
    })

    it('ResultDetectionCondition', function (done) {
      const valid = validate({
        'ResultDetectionCondition': true
      })
      expect(valid).to.equal(false)
      expect(checkMissingProperty(validate.errors, 'required', 'ResultValue')).to.equal(false)
      done()
    })

    it('NOT ResultAnalyticalMethodID & NOT ResultAnalyticalMethodName', function (done) {
      const valid = validate({})
      expect(valid).to.equal(false)
      expect(checkMissingProperty(validate.errors, 'required', 'ResultAnalyticalMethodID')).to.equal(false)
      expect(checkMissingProperty(validate.errors, 'required', 'ResultAnalyticalMethodName')).to.equal(false)
      done()
    })

    it('ResultAnalyticalMethodID', function (done) {
      const valid = validate({
        'ResultAnalyticalMethodID': true
      })
      expect(valid).to.equal(false)
      expect(checkMissingProperty(validate.errors, 'required', 'ResultAnalyticalMethodName')).to.equal(false)
      done()
    })

    it('ResultAnalyticalMethodName', function (done) {
      const valid = validate({
        'ResultAnalyticalMethodName': true
      })
      expect(valid).to.equal(false)
      expect(checkMissingProperty(validate.errors, 'required', 'ResultAnalyticalMethodIDResultAnalyticalMethodID')).to.equal(false)
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

  describe('Should require based on switch', function() {
    it('ResultDetectionCondition true', function (done) {
      const valid = validate({
        'ResultDetectionCondition':'Present Above Quantification Limit'
      });
      expect(valid).to.equal(false);
      expect(checkMissingProperty(validate.errors, 'dependencies', 'ResultDetectionQuantitationLimitMeasure')).to.equal(true);
      done();
    });

    it('ResultDetectionCondition true', function (done) {
      const valid = validate({
        'ResultDetectionCondition':'Present Below Quantification Limit'
      });
      expect(valid).to.equal(false);
      expect(checkMissingProperty(validate.errors, 'dependencies', 'ResultDetectionQuantitationLimitMeasure')).to.equal(true);
      done();
    });

    it('ResultDetectionCondition false', function (done) {
      const valid = validate({
        'ResultDetectionCondition':''
      });
      expect(valid).to.equal(false);
      expect(checkMissingProperty(validate.errors, 'dependencies', 'ResultDetectionQuantitationLimitMeasure')).to.equal(false);
      done();
    });

    it('CharacteristicName true', function (done) {
      const valid = validate({
        'CharacteristicName':'Silver'
      });
      expect(valid).to.equal(false);
      expect(checkMissingProperty(validate.errors, 'required', 'ResultSampleFraction')).to.equal(true);
      done();
    });

  })

  describe('Should require dependencies', function () {
    it('ActivityDepthHeightMeasure', function (done) {
      const valid = validate({
        'ActivityDepthHeightMeasure': true
      })
      expect(valid).to.equal(false)
      expect(checkMissingProperty(validate.errors, 'dependencies', 'ActivityDepthHeightUnit')).to.equal(true)
      done()
    })

    it('ResultValue', function (done) {
      const valid = validate({
        'ResultValue': true
      })
      expect(valid).to.equal(false)
      expect(checkMissingProperty(validate.errors, 'dependencies', 'ResultUnit')).to.equal(true)
      done()
    })

    it('ResultDetectionQuantitationLimitMeasure', function (done) {
      const valid = validate({
        'ResultDetectionQuantitationLimitMeasure': true
      })
      expect(valid).to.equal(false)
      expect(checkMissingProperty(validate.errors, 'dependencies', 'ResultDetectionQuantitationLimitUnit')).to.equal(true)
      expect(checkMissingProperty(validate.errors, 'dependencies', 'ResultDetectionQuantitationLimitType')).to.equal(true)
      done()
    })

    it('ResultAnalyticalMethodID', function (done) {
      const valid = validate({
        'ResultAnalyticalMethodID': true
      })
      expect(valid).to.equal(false)
      expect(checkMissingProperty(validate.errors, 'dependencies', 'ResultAnalyticalMethodContext')).to.equal(true)
      done()
    })
  })

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


