# WQX Comparison

To ensure a lower barrier to entry, multiple changes were made in the structure of the DS-WQX schema:

- most optional fields were dropped, or are conceptually integrated into other fields
- CSV flavour of the schema was chosen for ease of export from Microsoft Excel
- `Projects`, `Monitoring Locations` and `Physical-Chemistry` (i.e.`Results`) were flattened together to simplify the upload process
- Headers are in PascalCase to ensure simple transformations by the internal system
- Date, Time and Time Zone were changed to use the ISO 8601 format to allow ease of parsing and universal readability

For DS-WQX fields that have an equivalent WQX field, and that comprise a list of allowable values, the DS-WQX schema references WQX domain value lists available at https://cdx.epa.gov/wqx/download/DomainValues/All.zip, with changes including:

- DS-WQX fields with files in [subset](https://github.com/datastreamapp/schema/tree/main/schemas/data/src/subset) allow only the corresponding WQX values listed in the file
- DS-WQX fields wtih files in [addtion](https://github.com/datastreamapp/schema/tree/main/schemas/data/src/addition) also contain allowed values that exist only in DS-WQX and not in WQX

Some DS-WQX fields do not have a directly equivalent WQX field, so DS-WQX values are not pulled directly from WQX. In these cases, DS-WQX allowed values are listed in [addition](https://github.com/datastreamapp/schema/tree/main/schemas/data/src/addition) files (e.g. [WellIDContext](https://github.com/datastreamapp/schema/blob/main/schemas/data/src/addition/WellIDContext.json))

*See also https://github.com/datastreamapp/wqx/*

## Projects


| WQX Field           | Equivalent DS-WQX Field                                                                                          | WQX               | DS-WQX         |
| ------------------- | ---------------------------------------------------------------------------------------------------------------- | ----------------- | -------------- |
| Project Name        | `DatasetName` (part of [dataset-level metadata](https://github.com/datastreamapp/schema/tree/main/schemas/meta)) | Required, Text    | Required, Text |
| Project Description | `Abstract`  (part of [dataset-level metadata](https://github.com/datastreamapp/schema/tree/main/schemas/meta))   | Conditional, Text | Required, Text |

### WQX Fields not included

- **Project Attachment File Name**
- **Project Attachment Type**
- **Project ID** (Generated automatically internally using UUID v4)
- **QAPP Approval Agency Name**
- **QAPP Approved Indicator**
- **Sampling Design Type**

## Monitoring Locations


| WQX Field                                                    | Equivalent DS-WQX Field                                 | WQX requirements    | DS-WQX requirements | DS-WQX values    |
| ------------------------------------------------------------ | ------------------------------------------------------- | ------------------- | ------------------- | ---------------- |
| Local Aquifer Code                                           | `AquiferCode`                                           | Conditional, Values | Optional, Text      |                  |
| Local Aquifer Name                                           | `AquiferUnitName`                                       | Optional, Text      | Optional, Values    | Addition         |
| Monitoring Location Horizontal Accuracy Measure Unit Code    | `MonitoringLocationHorizontalAccuracyUnit`              | Conditional, Values | Conditional, Values | Subset           |
| Monitoring Location Horizontal Accuracy Measure Value        | `MonitoringLocationHorizontalAccuracyMeasure`           | Optional, Number    | Optional, Number    |                  |
| Monitoring Location Horizontal Coordinate Reference System   | `MonitoringLocationHorizontalCoordinateReferenceSystem` | Required, Values    | Required, Values    | Subset           |
| Monitoring Location ID                                       | `MonitoringLocationID`                                  | Required, Text      | Required, Text      |                  |
| Monitoring Location Latitude                                 | `MonitoringLocationLatitude`                            | Required, Number    | Required, Number    |                  |
| Monitoring Location Longitude                                | `MonitoringLocationLongitude`                           | Required, Number    | Required, Number    |                  |
| Monitoring Location Name                                     | `MonitoringLocationName`                                | Required, Text      | Required, Text      |                  |
| Monitoring Location Type                                     | `MonitoringLocationType`                                | Required, Values    | Required, Values    | Subset, Addition |
| Vertical Accuracy Measure (WQX 3.0)                          | `MonitoringLocationVerticalAccuracyMeasure`             | Conditional, Number | Optional, Values    | Addition         |
| Vertical Accuracy Unit (WQX 3.0)                             | `MonitoringLocationVerticalAccuracyUnit`                | Conditional, Values | Conditional, Values | Addition         |
| Vertical Collection Method                                   | `MonitoringLocationVerticalCollectionMethod`            | Conditional, Values | Conditional, Values | Subset, Addition |
| Vertical Coordinate Reference System                         | `MonitoringLocationVerticalCoordinateReferenceSystem`   | Conditional, Values | Conditional, Values | Subset, Addition |
| Vertical Measure                                             | `MonitoringLocationVerticalMeasure`                     | Optional, Number    | Conditional, Number |                  |
| Vertical Unit                                                | `MonitoringLocationVerticalUnit`                        | Conditional, Values | Conditional, Values | Subset, Addition |
| Well Formation Type                                          | `LithologyType`                                         | Optional, Values    | Optional, Values    | Subset, Addition |
| Well Hole Depth Measure Unit   (WQX 3.0 WellHoleDepthUnit)   | `BoreholeDepthUnit`  and `WellDepthUnit`                | Conditional, Values | Conditional, Values | Subset           |
| Well Hole Depth Measure Value (WQX 3.0 WellHoleDepthMeasure) | `BoreholeDepthMeasure`  and `WellDepthMeasure`          | Optional, Number    | Optional, Number    |                  |
| Well Type                                                    | `WellUseType`                                           | Conditional, Values | Conditional, Values | Subset, Addition |

### DS-WQX Fields added


| DS-WQX Field                    | DS-WQX requirements |
| ------------------------------- | ------------------- |
| `WellID`                        | Optional, Text      |
| `WellIDContext`                 | Optional, Values    |
| `AquiferType`                   | Optional, Values    |
| `AquiferUnitPorosityType`       | Optional, Values    |
| `WellOpenIntervalTopMeasure`    | Conditional, Number |
| `WellOpenIntervalTopUnit`       | Conditional, Values |
| `WellOpenIntervalBottomMeasure` | Conditional, Number |
| `WellOpenIntervalBottomUnit`    | Conditional, Values |

### WQX Fields not included

- **Alternate Monitoring Location Context**
- **Alternate Monitoring Location ID**
- **HUC Eight-Digit Code**
- **HUC Twelve-Digit Code**
- **Monitoring Location Attachment File Name**
- **Monitoring Location Attachment Type**
- **Monitoring Location Country Code**
- **Monitoring Location County Name**
- **Monitoring Location Description**
- **Monitoring Location Horizontal Collection Method**
- **Monitoring Location Source Map Scale**
- **Monitoring Location State Code**
- **Tribal Land Indicator**
- **Tribal Land Name**

## Physical-Chemistry Results


| WQX Field                                   | Equivalent DS-WQX Field                   | WQX requirements         | DS-WQX requirements       | DS-WQX values    |
| ------------------------------------------- | ----------------------------------------- | ------------------------ | ------------------------- | ---------------- |
| Activity Depth Altitude Reference Point     | `ActivityDepthAltitudeReferencePoint`     | Optional, Text           | Conditional, Values       | Addition         |
| Activity End Date                           | `ActivityEndDate`                         | Required, Date           | Required, Date (ISO 8601) |                  |
| Activity End Time                           | `ActivityEndTime`                         | Optional, Time           | Optional, Time (ISO 8601) |                  |
| Activity End Time Zone                      | `ActivityEndTimeZone`                     | Conditional, Values      | Conditional, Values       |                  |
| Activity Group Type                         | `ActivityGroupType`                       | Required, Values         | Required, Values          | Addition         |
| Activity Height/Depth Measure               | `ActivityDepthHeightMeasure`              | Optional, Text           | Optional, Number          |                  |
| Activity Height/Depth Unit                  | `ActivityDepthHeightUnit`                 | Conditional, Values      | Conditional, Values       | Subset           |
| Activity Media Subdivision Name             | `ActivityMediaName`                       | Optional, Values         | Required, Values          | Subset, Addition |
| Activity Start Date                         | `ActivityStartDate`                       | Required, Date           | Required, Date (ISO 8601) |                  |
| Activity Start Time                         | `ActivityStartTime`                       | Optional, Time           | Optional, Time (ISO 8601) |                  |
| Activity Start Time Zone                    | `ActivityStartTimeZone`                   | Conditional, Values      | Conditional, Values       |                  |
| Activity Type                               | `ActivityType`                            | Required, Values         | Required, Values          | Subset, Addition |
| Analysis Start Date                         | `AnalysisStartDate`                       | Optional, Date           | Optional, Date (ISO 8601) |                  |
| Analysis Start Time                         | `AnalysisStartTime`                       | Optional, Time           | Optional, Time (ISO 8601) |                  |
| Analysis Start Time Zone                    | `AnalysisStartTimeZone`                   | Conditional, Values      | Conditional, Values       |                  |
| Characteristic Name                         | `CharacteristicName`                      | Conditional, Values      | Required, Values          | Subset, Addition |
| Laboratory Name                             | `LaboratoryName`                          | Optional, Text           | Conditional, Text         |                  |
| Method Speciation                           | `MethodSpeciation`                        | Conditional, Values      | Conditional, Values       | Subset, Addition |
| Result Analytical Method Context            | `ResultAnalyticalMethodContext`           | Conditional, Values/Text | Conditional, Values       | Subset, Addition |
| Result Analytical Method ID                 | `ResultAnalyticalMethodID`                | Conditional, Values/Text | Conditional, Text         |                  |
| Result Comment                              | `ResultComment`                           | Optional, Text           | Optional, Text            |                  |
| Result Detection Condition                  | `ResultDetectionCondition`                | Conditional, Values      | Conditional, Values       | Subset, Addition |
| Result Detection/Quantitation Limit Measure | `ResultDetectionQuantitationLimitMeasure` | Conditional, Text        | Conditional, Number       |                  |
| Result Detection/Quantitation Limit Type    | `ResultDetectionQuantitationLimitType`    | Conditional, Values      | Conditional, Values       | Subset, Addition |
| Result Detection/Quantitation Limit Unit    | `ResultDetectionQuantitationLimitUnit`    | Conditional, Values      | Conditional, Values       | See Result Unit  |
| Result Sample Fraction                      | `ResultSampleFraction`                    | Conditional, Values      | Conditional, Values       | Subset, Addition |
| Result Status ID                            | `ResultStatusID`                          | Conditional, Values      | Optional, Values          | Subset           |
| Result Unit                                 | `ResultUnit`                              | Conditional, Values      | Conditional, Values       | Subset, Addition |
| Result Value                                | `ResultValue`                             | Conditional, Text        | Conditional, Number       |                  |
| Result Value Type                           | `ResultValueType`                         | Conditional, Values      | Required, Values          |                  |
| Sample Collection Equipment *               | `SampleCollectionEquipmentName`           | Conditional, Values      | Optional, Values          | Subset, Addition |
| Sample Collection Method Identifier         | `SampleCollectionMethodID`                | Conditional, Values/Text | Conditional, Text         |                  |
| Sample Collection Method Identifier Context | `SampleCollectionMethodContext`           | Conditional, Values/Text | Conditional, Values       | Subset, Addition |
| Sample Collection Method Name (WQX 3.0)     | `SampleCollectionMethodName`              | Conditional, Values/Text | Optional, Text            |                  |

*Note, the DS-WQX field SampleCollectionEquipmentName combines WQX domain value lists for Sample Collection Equipment and Sample Collection Equipment Type

### DS-WQX Fields added


| DS-WQX Field                                 | DS-WQX requirements |
| -------------------------------------------- | ------------------- |
| `ActivityDepthAltitudeReferencePointUnit`    | Conditional, Values |
| `ActivityDepthAltitudeReferencePointMeasure` | Conditional, Number |
| `EventID`                                    | Optional, Text      |
| `LaboratorySampleID`                         | Optional, Text      |
| `SampleCondition`                            | Conditional, Values |

### WQX Fields not included

- **Activity Attachment File Name**
- **Activity Attachment Type**
- **Activity Bottom Depth/Height Measure Unit**
- **Activity Bottom Depth/Height Measure**
- **Activity Comment**
- **Activity Group ID**
- **Activity Group Name**
- **Activity Horizontal Accuracy Measure**
- **Activity Horizontal Accuracy Unit**
- **Activity Horizontal Collection Method**
- **Activity Horizontal Coordinate Reference System**
- **Activity ID** (See DS `EventID`)
- **Activity Latitude**
- **Activity Longitude**
- **Activity Media Name** (See DS `ActivityMediaName`)
- **Activity Relative Depth Name**
- **Activity Source Map Scale**
- **Activity Top Depth/Height Measure**
- **Activity Top Depth/Height Unit**
- **Analysis End Date**
- **Analysis End Time Zone**
- **Analysis End Time**
- **Bias**
- **Chemical Preservative Used**
- **Confidence Interval**
- **Data Logger Line**
- **Lab Sample Preparation End Date**
- **Lab Sample Preparation End Time Zone**
- **Lab Sample Preparation End Time**
- **Lab Sample Preparation Method ID**
- **Lab Sample Preparation Start Date**
- **Lab Sample Preparation Start Time Zone**
- **Lab Sample Preparation Start Time**
- **Laboratory Accreditation Authority**
- **Laboratory Accreditation Indicator**
- **Lower Confidence Limit**
- **Organization** (part of [dataset-level metadata](https://github.com/datastreamapp/schema/tree/main/schemas/meta))
- **Precision**
- **Project ID** (See Project section)
- **Result Attachment File Name**
- **Result Attachment Type**
- **Result Depth/Altitude Reference Point**
- **Result Depth/Height Measure**
- **Result Depth/Height Unit**
- **Result Laboratory Comment Code**
- **Result Particle Size Basis**
- **Result Qualifier**
- **Result Sampling Point Name**
- **Result Temperature Basis**
- **Result Time Basis**
- **Result Weight Basis**
- **Sample Collection Equipment Comment**
- **Sample Container Color**
- **Sample Container Type**
- **Sample Preparation Method ID**
- **Sample Transport Storage Description**
- **Statistical Base Code**
- **Substance Dilution Factor**
- **Thermal Preservative Used**
- **Upper Confidence Limit**
