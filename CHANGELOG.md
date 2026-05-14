# Changelog

All notable changes to `@datastreamapp/data-schema` are documented in this file.

The format is loosely based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

Targets `3.0.0`. Introduces **Groundwater support** to the DataStream schema.

### Added

- **Groundwater media** — `Groundwater` added to `ActivityMediaName`, plus 24 new Groundwater-related fields covering well identification, aquifer attributes, well construction depths, sample-collection method, and depth-altitude reference:
  - `MonitoringLocationVerticalAccuracyMeasure`, `MonitoringLocationVerticalAccuracyUnit`, `MonitoringLocationVerticalCollectionMethod`, `MonitoringLocationVerticalCoordinateReferenceSystem`
  - `WellID`, `WellIDContext`, `WellUseType`
  - `AquiferCode`, `AquiferUnitName`, `AquiferType`, `AquiferUnitPorosityType`, `LithologyType`
  - `BoreholeDepthMeasure` / `Unit`, `WellDepthMeasure` / `Unit`, `WellOpenIntervalTopMeasure` / `Unit`, `WellOpenIntervalBottomMeasure` / `Unit`
  - `ActivityDepthAltitudeReferencePoint`, `ActivityDepthAltitudeReferencePointMeasure`, `ActivityDepthAltitudeReferencePointUnit`
  - `SampleCondition`, `SampleCollectionMethodID`, `SampleCollectionMethodContext`, `SampleCollectionMethodName`
- **Groundwater conditional logic rules** (errors block submission):
  - `GroundwaterFields-ActivityMediaName-Groundwater` — Groundwater-only fields require `ActivityMediaName` of `Groundwater` or `Porewater`.
  - `ActivityMediaName-Groundwater-DepthMeasure` — at least one depth measure required.
  - `ActivityDepthHeightMeasure-ActivityDepthAltitudeReferencePoint` — reference point required when depth is reported.
  - `CharacteristicName-WaterLevel-ActivityDepthAltitudeReferencePoint` — reference point required for water-level observations.
  - `MonitoringLocationType-Well-WellUseType` — well/piezometer locations require `WellUseType`.
  - `MonitoringLocationType-Well-SampleCondition` — well/piezometer locations require `SampleCondition` (except continuous time series).
- **Groundwater-related enum additions** (forward-compatible):
  - `MonitoringLocationType`: `Borehole`, `Dug Well`, `Multilevel Well`, `Nested Well`, `Other-Ground Water`, `Piezometer`, `Seep`, `Sump`, `Well`
  - `MonitoringLocationHorizontalCoordinateReferenceSystem`: `OTHER`
  - `MonitoringLocationVerticalUnit`: `ft`, `m`
  - `SampleCollectionEquipmentName`: `Air line`, `Bailer`, `Hydrasleeve`, `Snap sampler`, `Tubing`, `Water level meter`, `Wetted tape`
  - `CharacteristicName`: `Water level elevation`, `Water level in well, depth from a reference point`

### Breaking

- **Top-level `$id`s now end in `.json`**, mirroring filesystem paths so JSON Schema URL resolution works without filesystem fallbacks. Consumers must update `$ref`s when upgrading:
  - `https://datastream.org/schema/data/backend` → `…/backend.json`
  - `…/frontend` → `…/frontend.json`
  - `…/primary` → `…/primary.json`
  - `…/extract` → `…/extract.json`
  - `…/quality-control` → `…/quality-control.json`
  - `…/definitions` → `…/definitions.json`
- **All value-file `$id`s renamed** from `.loose.json` / `.strict.json` to `.legacy.json` / `.primary.json` (≈50 files each). Any `$ref` to a `values/*.loose.json` or `values/*.strict.json` URL must be updated.
- **Misplaced `$id`s corrected** (drifted from their filesystem paths):
  - `logic/ResultUnit-Salinity.json` (was `quality-control/ResultUnit-Salinity.json`)
  - `quality-control/ResultDetectionQuantitationLimitMeasure-Minimum.json` (was `…MinimumMeasure-Minimum.json`)

## [2.29.0] - 2026-03-12

### Added

- Q1 2026 WQX update: new values across `CharacteristicName`, `CharacteristicGroup`, `ActivityType`, `MeasurementUnit`, `ResultDetectionQuantitationLimitUnit`, `ResultUnit`, `SampleCollectionEquipmentName`.

## [2.0.0] - 2020-07-26

- Rewrite build process to:
  - Pull the latest version of WQX values and simplify future updates
  - Improve maintainability and audit control
- `MonitoringLocationID` is now required
- `MonitoringLocationWaterbody` is now deprecated
- `MethodSpeciation` has new conditional requirements
- `ActivityMediaName` has new allowed values: `Ambient Air`, `Surface Water Sediment`, `Pore Water`, `Ocean Water`
- Additional checks to prevent the common issues people run into surrounding Dissolved Oxygen, Hardness, and others. See `src/logic/ResultValue-*.json`.

## [1.0.0] - 2019-10-12

Starting from US EPA WQX:

- `ProjectName` → `DatasetName` to be more generic.
- `ActivityDepthHeightMeasure` — added maximum restriction due to only recording water samples.
- `ResultAnalyticalMethodName` — added for readability.
- `ResultAnalyticalMethodID` — removed allowed values.
- `LaboratorySampleID` — added to improve metadata.
- `AnalysisStartTimeZone` — changed format to follow ISO 8601 (e.g. `-0600`).
- `ActivityStartTimeZone` / `ActivityEndTimeZone` — removed because they can be inferred from the location.
- `State` and `County` → `MonitoringLocationRegion` to allow for a broader meaning that can be applied internationally.