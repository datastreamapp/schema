const expect = require('chai').expect

const schema = require('../dist/json-schema/index.json')
const Ajv = require('ajv');

const ajv = new Ajv({
  v5: true,
  format:'full',
  coerceTypes: true,
  allErrors: true,
  useDefaults: true
});
require('ajv-keywords')(ajv, ['transform'])
const validate = ajv.compile(schema);

const checkMissingProperty = (errors, keyword, property) => {
  for (let i = errors.length; i--; i) {
    const error = validate.errors[i]
    if (error.keyword !== keyword) continue
    if (error.params.missingProperty === property) return true
  }
  return false
}

describe('DataStream Schema', function () {

  it('Should transform values', function (done) {
    const valid = validate({
      "DatasetName":"Test",
      "MonitoringLocationID":"A1",
      "MonitoringLocationName":"A1 Test",
      "MonitoringLocationLatitude":"51.0486",
      "MonitoringLocationLongitude":"-114.0708",
      "MonitoringLocationHorizontalCoordinateReferenceSystem":"AMSMA",
      "MonitoringLocationType":"Atmosphere",
      "MonitoringLocationWaterbody":"Elbow River",
      "ActivityType":"Field Msr/Obs",
      "ActivityMediaName":"surface Water",
      "ActivityDepthHeightMeasure":"-34",
      "ActivityDepthHeightUnit":"m",
      "SampleCollectionEquipmentName":"Bongo Net",
      "CharacteristicName":"aluminum",
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


