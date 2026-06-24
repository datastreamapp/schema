import { test } from "node:test";
import assert from "node:assert/strict";
import validate from '../frontend/index.js'
import validateBackend from '../backend/index.js'
import validateExtract from '../extract/index.js'

test('Should transform values (frontend)', async (t) => {
  const valid = validate({
    DatasetName: 'Test ',
    MonitoringLocationID: 'A1 ',
    MonitoringLocationName: 'A1 Test',
    MonitoringLocationLatitude: '51.0486',
    MonitoringLocationLongitude: '-114.0708',
    MonitoringLocationHorizontalCoordinateReferenceSystem: 'WGS84',
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
  assert.equal(valid, true)
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
    EventID: '  Spring 2018 survey  ',
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
  assert.equal(valid, true)
})

// *** cross-flavour fixtures *** //
// Each fixture is run through frontend, extract, and backend validators to
// exercise validation paths that the flavour-specific tests above don't reach.

const crossFlavourFixtures = [
  {
    name: 'Groundwater well field measurement',
    data: {
      DatasetName: 'GW Test',
      MonitoringLocationID: 'GW-01',
      MonitoringLocationName: 'Test Well',
      MonitoringLocationLatitude: 51.0486,
      MonitoringLocationLongitude: -114.0708,
      MonitoringLocationHorizontalCoordinateReferenceSystem: 'WGS84',
      MonitoringLocationVerticalMeasure: 1050,
      MonitoringLocationVerticalUnit: 'm',
      MonitoringLocationVerticalCoordinateReferenceSystem: 'CGVD2013',
      MonitoringLocationVerticalCollectionMethod: 'GPS Carrier Phase Static Relative Position',
      MonitoringLocationVerticalAccuracyMeasure: 0.1,
      MonitoringLocationVerticalAccuracyUnit: 'm',
      MonitoringLocationType: 'Well',
      WellID: 'well-123',
      WellIDContext: 'AB',
      WellUseType: 'Domestic',
      AquiferCode: 'AQ-01',
      AquiferUnitName: 'Abbotsford Shallow Aquifer',
      AquiferType: 'Confined',
      AquiferUnitPorosityType: 'Granular',
      LithologyType: 'Sand',
      WellDepthMeasure: -30,
      WellDepthUnit: 'm',
      BoreholeDepthMeasure: -32,
      BoreholeDepthUnit: 'm',
      WellOpenIntervalTopMeasure: -25,
      WellOpenIntervalTopUnit: 'm',
      WellOpenIntervalBottomMeasure: -28,
      WellOpenIntervalBottomUnit: 'm',
      ActivityType: 'Field Msr/Obs',
      ActivityMediaName: 'Groundwater',
      ActivityStartDate: '2026-01-15',
      ActivityStartTime: '12:00:00',
      ActivityStartTimeZone: '-06:00',
      ActivityDepthAltitudeReferencePoint: 'Top of well casing',
      ActivityDepthAltitudeReferencePointMeasure: 27,
      ActivityDepthAltitudeReferencePointUnit: 'm',
      SampleCondition: 'Static, before pumping or purging',
      CharacteristicName: 'Temperature, water',
      ResultValue: 8.2,
      ResultUnit: 'deg C',
      ResultValueType: 'Actual',
      ResultStatusID: 'Validated',
    },
  },
  {
    name: 'Groundwater well routine sample collection',
    data: {
      DatasetName: 'GW Sample',
      MonitoringLocationID: 'GW-04',
      MonitoringLocationName: 'Test Well 4',
      MonitoringLocationLatitude: 51.0486,
      MonitoringLocationLongitude: -114.0708,
      MonitoringLocationHorizontalCoordinateReferenceSystem: 'WGS84',
      MonitoringLocationVerticalMeasure: 1050,
      MonitoringLocationVerticalUnit: 'm',
      MonitoringLocationVerticalCoordinateReferenceSystem: 'CGVD2013',
      MonitoringLocationVerticalCollectionMethod: 'GPS Carrier Phase Static Relative Position',
      MonitoringLocationVerticalAccuracyMeasure: 0.1,
      MonitoringLocationVerticalAccuracyUnit: 'm',
      MonitoringLocationType: 'Well',
      WellID: 'well-456',
      WellIDContext: 'AB',
      WellUseType: 'Domestic',
      AquiferCode: 'AQ-02',
      AquiferUnitName: 'Abbotsford Shallow Aquifer',
      AquiferType: 'Confined',
      AquiferUnitPorosityType: 'Granular',
      LithologyType: 'Sand',
      WellDepthMeasure: -30,
      WellDepthUnit: 'm',
      BoreholeDepthMeasure: -32,
      BoreholeDepthUnit: 'm',
      WellOpenIntervalTopMeasure: -25,
      WellOpenIntervalTopUnit: 'm',
      WellOpenIntervalBottomMeasure: -28,
      WellOpenIntervalBottomUnit: 'm',
      ActivityType: 'Sample-Routine',
      ActivityMediaName: 'Groundwater',
      ActivityStartDate: '2026-01-15',
      ActivityStartTime: '12:00:00',
      ActivityStartTimeZone: '-06:00',
      ActivityDepthAltitudeReferencePoint: 'Top of well casing',
      ActivityDepthAltitudeReferencePointMeasure: 27,
      ActivityDepthAltitudeReferencePointUnit: 'm',
      SampleCollectionMethodID: 'D4448-01',
      SampleCollectionMethodContext: 'ASTM',
      SampleCollectionMethodName: 'Standard guide for sampling ground-water monitoring wells',
      SampleCondition: 'Static, before pumping or purging',
      CharacteristicName: 'Chloride',
      ResultSampleFraction: 'Dissolved',
      ResultValue: 12.4,
      ResultUnit: 'mg/L',
      ResultValueType: 'Actual',
      ResultStatusID: 'Validated',
      ResultAnalyticalMethodID: 'EPA-300.0',
      ResultAnalyticalMethodContext: 'USEPA',
      LaboratoryName: 'Test Lab Inc.',
    },
  },
  {
    name: 'Surface water field measurement',
    data: {
      DatasetName: 'SW Test',
      MonitoringLocationID: 'SW-01',
      MonitoringLocationName: 'Test River',
      MonitoringLocationLatitude: 51.0486,
      MonitoringLocationLongitude: -114.0708,
      MonitoringLocationHorizontalCoordinateReferenceSystem: 'WGS84',
      MonitoringLocationType: 'River/Stream',
      EventID: 'Spring 2018 survey',
      ActivityType: 'Field Msr/Obs',
      ActivityMediaName: 'Surface Water',
      ActivityStartDate: '2026-01-15',
      ActivityStartTime: '12:00:00',
      ActivityStartTimeZone: '-06:00',
      CharacteristicName: 'Temperature, water',
      ResultValue: 18.5,
      ResultUnit: 'deg C',
      ResultValueType: 'Actual',
      ResultStatusID: 'Validated',
    },
  },
  {
    name: 'Groundwater with sample collection method context/ID',
    data: {
      DatasetName: 'GW Method',
      MonitoringLocationID: 'GW-02',
      MonitoringLocationName: 'Test Well 2',
      MonitoringLocationLatitude: 51.0486,
      MonitoringLocationLongitude: -114.0708,
      MonitoringLocationHorizontalCoordinateReferenceSystem: 'WGS84',
      MonitoringLocationType: 'Well',
      WellUseType: 'Domestic',
      WellDepthMeasure: -15,
      WellDepthUnit: 'm',
      SampleCollectionMethodID: 'D4448-01',
      SampleCollectionMethodContext: 'ASTM',
      SampleCollectionMethodName: 'Standard guide for sampling ground-water monitoring wells',
      ActivityType: 'Field Msr/Obs',
      ActivityMediaName: 'Groundwater',
      ActivityStartDate: '2026-01-15',
      ActivityStartTime: '12:00:00',
      ActivityStartTimeZone: '-06:00',
      SampleCondition: 'Static, before pumping or purging',
      CharacteristicName: 'Temperature, water',
      ResultValue: 8.2,
      ResultUnit: 'deg C',
      ResultValueType: 'Actual',
      ResultStatusID: 'Validated',
    },
  },
  {
    name: 'Groundwater with vertical measure cascade',
    data: {
      DatasetName: 'GW Vertical',
      MonitoringLocationID: 'GW-03',
      MonitoringLocationName: 'Test Well 3',
      MonitoringLocationLatitude: 51.0486,
      MonitoringLocationLongitude: -114.0708,
      MonitoringLocationHorizontalCoordinateReferenceSystem: 'WGS84',
      MonitoringLocationVerticalMeasure: 1500,
      MonitoringLocationVerticalUnit: 'm',
      MonitoringLocationVerticalCollectionMethod: 'GPS Carrier Phase Static Relative Position',
      MonitoringLocationVerticalCoordinateReferenceSystem: 'CGVD2013',
      MonitoringLocationType: 'Well',
      WellUseType: 'Domestic',
      WellDepthMeasure: -20,
      WellDepthUnit: 'm',
      ActivityType: 'Field Msr/Obs',
      ActivityMediaName: 'Groundwater',
      ActivityStartDate: '2026-01-15',
      ActivityStartTime: '12:00:00',
      ActivityStartTimeZone: '-06:00',
      SampleCondition: 'Static, before pumping or purging',
      CharacteristicName: 'Temperature, water',
      ResultValue: 8.2,
      ResultUnit: 'deg C',
      ResultValueType: 'Actual',
      ResultStatusID: 'Validated',
    },
  },
]

for (const { name, data } of crossFlavourFixtures) {
  test(`frontend accepts ${name}`, async () => {
    assert.equal(validate(structuredClone(data)), true)
  })
  test(`extract accepts ${name}`, async () => {
    assert.equal(validateExtract(structuredClone(data)), true)
  })
  test(`backend accepts ${name}`, async () => {
    assert.equal(validateBackend(structuredClone(data)), true)
  })
}

// *** cross-flavour negative fixtures *** //
// Each fixture mutates the GW well baseline with a single violation. Run
// through all three validators to exercise error-reporting paths.

const baseline = crossFlavourFixtures[0].data
const negativeFixtures = [
  {
    name: 'invalid MonitoringLocationType enum',
    mutate: (d) => {
      d.MonitoringLocationType = 'NotAType'
    },
  },
  {
    name: 'WellDepthMeasure > 0 (range violation)',
    mutate: (d) => {
      d.WellDepthMeasure = 5
    },
  },
  {
    name: 'WellID exceeding maxLength',
    mutate: (d) => {
      d.WellID = 'x'.repeat(56);
      d.WellIDContext = 'AB'
    },
  },
  {
    name: 'AquiferCode exceeding maxLength',
    mutate: (d) => {
      d.AquiferCode = '12345678901'
    },
  },
]

for (const { name, mutate } of negativeFixtures) {
  const build = () => {
    const d = structuredClone(baseline);
    mutate(d);
    return d
  }
  test(`frontend rejects ${name}`, async () => {
    assert.equal(validate(build()), false)
  })
  test(`extract rejects ${name}`, async () => {
    assert.equal(validateExtract(build()), false)
  })
  test(`backend rejects ${name}`, async () => {
    assert.equal(validateBackend(build()), false)
  })
}
