import test from 'ava'

import validate from '../frontend/index.js'
import validateBackend from '../backend/index.js'

test('Should transform values (frontend)', async (t) => {
  const valid = validate({
    DatasetName: 'Test ',
    MonitoringLocationID: 'A1 ',
    MonitoringLocationName: 'A1 Test',
    MonitoringLocationLatitude: '51.0486',
    MonitoringLocationLongitude: '-114.0708',
    MonitoringLocationHorizontalCoordinateReferenceSystem: 'AMSMA',
    MonitoringLocationType: 'ocean',
    ActivityType: 'Field Msr/Obs',
    ActivityMediaName: 'surface Water',
    ActivityDepthHeightMeasure: '-34',
    ActivityDepthHeightUnit: 'm',
    SampleCollectionEquipmentName: 'bucket',
    CharacteristicName: 'aluminum',
    MethodSpeciation: 'as B',
    ResultSampleFraction: 'dissolved',
    ResultValue: '99.99',
    ResultUnit: '#/100Ml ',
    ResultValueType: 'actual',
    ResultStatusID: 'accepted',
    ResultComment: 'None at this time  ',
    ResultAnalyticalMethodID: '1  ',
    ResultAnalyticalMethodContext: 'APHA',
    ResultAnalyticalMethodName: 'Alpha  ',
    ActivityStartDate: '2018-02-23',
    ActivityStartTime: '13:15:00',
    ActivityEndDate: '2018-02-23',
    ActivityEndTime: '13:15:00',
    LaboratoryName: 'Farrell Labs ',
    LaboratorySampleID: '101010011110 ',
    AnalysisStartDate: '2018-02-23',
    AnalysisStartTime: '13:15:00',
    AnalysisStartTimeZone: '-06:00'
  })
  //console.log(valid, JSON.stringify(validate.errors, null, 2))
  t.is(valid, true)
})

test('Should transform values (backend)', async (t) => {
  const valid = validateBackend({
    DatasetName: ' Test ',
    MonitoringLocationID: 'A1 ',
    MonitoringLocationName: 'A1 Test',
    MonitoringLocationLatitude: '51.0486',
    MonitoringLocationLongitude: '-114.0708',
    MonitoringLocationHorizontalCoordinateReferenceSystem: 'AMSMA',
    MonitoringLocationType: 'ocean',
    ActivityType: 'Field Msr/Obs',
    ActivityMediaName: 'surface Water',
    ActivityDepthHeightMeasure: '-34',
    ActivityDepthHeightUnit: 'm',
    SampleCollectionEquipmentName: 'bucket',
    CharacteristicName: 'aluminum',
    MethodSpeciation: 'as B',
    ResultSampleFraction: 'dissolved',
    ResultValue: '99.99',
    ResultUnit: '#/100Ml',
    ResultValueType: 'actual',
    ResultStatusID: 'accepted',
    ResultComment: '  None at this time',
    ResultAnalyticalMethodID: '  1',
    ResultAnalyticalMethodContext: 'APHA',
    ResultAnalyticalMethodName: '  Alpha',
    ActivityStartDate: '2018-02-23',
    ActivityStartTime: '13:15:00',
    ActivityEndDate: '2018-02-23',
    ActivityEndTime: '13:15:00',
    LaboratoryName: 'Farrell Labs ',
    LaboratorySampleID: '101010011110 ',
    AnalysisStartDate: '2018-02-23',
    AnalysisStartTime: '13:15:00',
    AnalysisStartTimeZone: '-06:00'
  })
  //console.log(valid, JSON.stringify(validateBackend.errors, null, 2))
  t.is(valid, true)
})
