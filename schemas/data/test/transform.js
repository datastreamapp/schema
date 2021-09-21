const expect = require('chai').expect

const validateFrontend = require('../frontend')
const validateBackend = require('../backend')

describe('Data Coercion', function () {

  it('Should transform values (frontend)', function (done) {
    const valid = validateFrontend({
      "DatasetName":"Test ",
      "MonitoringLocationID":"A1 ",
      "MonitoringLocationName":"A1 Test",
      "MonitoringLocationLatitude":"51.0486",
      "MonitoringLocationLongitude":"-114.0708",
      "MonitoringLocationHorizontalCoordinateReferenceSystem":"AMSMA",
      "MonitoringLocationType":"ocean",
      "ActivityType":"Field Msr/Obs",
      "ActivityMediaName":"surface Water",
      "ActivityDepthHeightMeasure":"-34",
      "ActivityDepthHeightUnit":"m",
      "SampleCollectionEquipmentName":"bucket",
      "CharacteristicName":"aluminum",
      "MethodSpeciation":"as B",
      "ResultSampleFraction":"dissolved",
      "ResultValue":"99.99",
      "ResultUnit":"#/100Ml",
      'ResultValueType':'actual',
      "ResultStatusID":"accepted",
      "ResultComment":"None at this time  ",
      "ResultAnalyticalMethodID":"1  ",
      "ResultAnalyticalMethodContext":"APHA",
      "ResultAnalyticalMethodName":"Alpha  ",
      "ActivityStartDate":"2018-02-23",
      "ActivityStartTime":"13:15:00",
      "ActivityEndDate":"2018-02-23",
      "ActivityEndTime":"13:15:00",
      "LaboratoryName":"Farrell Labs ",
      "LaboratorySampleID":"101010011110 ",
      "AnalysisStartDate":"2018-02-23",
      "AnalysisStartTime":"13:15:00",
      "AnalysisStartTimeZone":"-06:00"
    })
    console.log(valid, JSON.stringify(validateFrontend.errors, null, 2))
    expect(valid).to.equal(true)
    done()
  })

  it('Should transform values (backend)', function (done) {
    const valid = validateBackend({
      "DatasetName":" Test ",
      "MonitoringLocationID":"A1 ",
      "MonitoringLocationName":"A1 Test",
      "MonitoringLocationLatitude":"51.0486",
      "MonitoringLocationLongitude":"-114.0708",
      "MonitoringLocationHorizontalCoordinateReferenceSystem":"AMSMA",
      "MonitoringLocationType":"ocean",
      "ActivityType":"Field Msr/Obs",
      "ActivityMediaName":"surface Water",
      "ActivityDepthHeightMeasure":"-34",
      "ActivityDepthHeightUnit":"m",
      "SampleCollectionEquipmentName":"bucket",
      "CharacteristicName":"aluminum",
      "MethodSpeciation":"as B",
      "ResultSampleFraction":"dissolved",
      "ResultValue":"99.99",
      "ResultUnit":"#/100Ml",
      'ResultValueType':'actual',
      "ResultStatusID":"accepted",
      "ResultComment":"  None at this time",
      "ResultAnalyticalMethodID":"  1",
      "ResultAnalyticalMethodContext":"APHA",
      "ResultAnalyticalMethodName":"  Alpha",
      "ActivityStartDate":"2018-02-23",
      "ActivityStartTime":"13:15:00",
      "ActivityEndDate":"2018-02-23",
      "ActivityEndTime":"13:15:00",
      "LaboratoryName":"Farrell Labs ",
      "LaboratorySampleID":"101010011110 ",
      "AnalysisStartDate":"2018-02-23",
      "AnalysisStartTime":"13:15:00",
      "AnalysisStartTimeZone":"-06:00"
    })
    console.log(valid, JSON.stringify(validateBackend.errors, null, 2))
    expect(valid).to.equal(true)
    done()
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


