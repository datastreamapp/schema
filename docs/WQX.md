# WQX Comparison

To ensure a lower barrier to entry, multiple changes were made in the structure:
- most optional fields were dropped, 
- CSV flavour of the schema was chosen for ease of export from Microsoft Excel
- `Projects`, `Monitoring Locations` and `Results` were flatten together to simplify the upload process
- Headers are in PascalCase to ensure a simple transformations by the internal system
- Date, Time and Time Zone were changed to use the ISO 8601 format to allow ease of parsing and universal readability

## Projects

Column                           | WQX               | DS-WQX         | Changes
---------------------------------|-------------------|----------------|----------------------------------------------------------
**Project ID**                   | Required, Text    |                | Removed, generated automatically internally using UUID v4
**Project Name**                 | Required, Text    | Required, Text | Renamed to `DatasetName`
**Project Description**          | Conditional, Text |                | Moved to metadata work flow, renamed to `Abstract`
**Sampling Design Type**         | Optional, Values  |                | Removed
**QAPP Approved Indicator**      | Optional, Bool    |                | Removed
**QAPP Approval Agency Name**    | Optional, Text    |                | Removed
**Project Attachment File Name** | Conditional, Text |                | Moved to attachment work flow
**Project Attachment Type**      | Conditional, Text |                | Moved to attachment work flow



## Monitoring Locations

Column                                                         | WQX                 | DS-WQX           | Changes
---------------------------------------------------------------|---------------------|------------------|--------------------------------------------------------
**Monitoring Location ID**                                     | Required, Text      | Optional, Text   | Changed, column is not being used for joining tables
**Monitoring Location Name**                                   | Required, Text      | Required, Text   | None
**Monitoring Location Type**                                   | Required, Values    | Required, Values | [Subset](../src/subset/MonitoringLoationType.json)
**Monitoring Location Description**                            | Optional, Text      |                  | Removed
**HUC Eight-Digit Code**                                       | Optional, Text      |                  | Removed
**HUC Twelve-Digit Code**                                      | Optional, Text      |                  | Removed
**Tribal Land Indicator**                                      | Optional, Bool      |                  | Removed
**Tribal Land Name**                                           | Optional, Text      |                  | Removed
**Alternate Monitoring Location ID**                           | Optional, Text      |                  | Removed
**Alternate Monitoring Location Context**                      | Conditional, Text   |                  | Removed
**Monitoring Location Latitude**                               | Required, Number    | Required, Number | None
**Monitoring Location Longitude**                              | Required, Number    | Required, Number | None
**Monitoring Location Source Map Scale**                       | Conditional, Text   |                  | Removed
**Monitoring Location Horizontal Accuracy Measure Value**      | Optional, Text      |                  | Removed
**Monitoring Location Horizontal Accuracy Measure Unit Code**  | Conditional, Text   |                  | Removed
**Monitoring Location Horizontal Collection Method**           | Required, Values    |                  | Removed, DataStream uses GPS based locations (lat/lng), not addresses, zip/postal code, etc
**Monitoring Location Horizontal Coordinate Reference System** | Required, Values    | Required, Values | None
**Monitoring Location Waterbody**                              |                     | Optional, Text   | Added, carried over from legacy DataStream schema for search purposes
**Vertical Measure**                                           | Optional, Number    |                  | Removed (GW?)
**Vertical Unit**                                              | Conditional, Values |                  | Removed (GW?)
**Vertical Collection Method**                                 | Conditional, Values |                  | Removed (GW?)
**Vertical Coordinate Reference System**                       | Conditional, Values |                  | Removed (GW?)
**Monitoring Location Country Code**                           | Optional, Values    |                  | Removed
**Monitoring Location State Code**                             | Conditional, Values |                  | Removed, can be auto generated internally
**Monitoring Location County Name**                            | Optional, Values    |                  | Removed, can be auto generated internally
**Well Type**                                                  | Optional, Values    |                  | Removed (GW)
**Aquifer Name**                                               | Optional, Text      |                  | Removed (GW), can be auto generated internally
**Well Formation Type**                                        | Optional, Values    |                  | Removed (GW)
**Well Hole Depth Measure Value**                              | Optional, Number    |                  | Removed (GW)
**Well Hole Depth Measure Unit**                               | Conditional, Values |                  | Removed (GW)
**Monitoring Location Attachment File Name**                   | Optional, Text      |                  | Removed
**Monitoring Location Attachment Type**                        | Conditional, Text   |                  | Removed

## Physical-Chemistry Results
Column                                              | WQX                      | DS-WQX              | Changes
----------------------------------------------------|--------------------------|---------------------|----------------------------------------------------------------
**Activity ID**                                     | Required, Text           |                     | Removed, duplication of information, WQX concatonates location ID, date and time to create Activity ID 
**Activity Type**                                   | Required, Values         | Required, Values    | [Additions](../src/addition/ActivityType.json)
**Activity Media Name**                             | Required, Values         | Required, Values    | Using subset of `Activity Media Subdivision Name` for simplicity, see [override](src/subset/ActivityMediaSubdivisionName.json)
**Activity Media Subdivision Name**                 | Optional, Values         |                     | Removed, see above
**Activity Start Date**                             | Required, Date           | Required, Date      | Changed format to meet ISO 8601
**Activity Start Time**                             | Optional, Time           | Optional, Time      | Changed format to meet ISO 8601
**Activity Start Time Zone**                        | Conditional, Text        |                     | Removed, calculated internally using the Latitude and Longitude
**Activity End Date**                               | Required, Date           | Required, Date      | See `Activity Start Date`
**Activity End Time**                               | Optional, Time           | Optional, Time      | See `Activity Start Time`
**Activity End Time Zone**                          | Conditional, Text        |                     | See `Activity Start Time Zone`
**Activity Relative Depth Name**                    | Optional, Values         |                     | Removed
**Activity Height/Depth Measure**                   | Optional, Text           | Optional, Number    | Changed type to Number only
**Activity Height/Depth Unit**                      | Conditional, Values      | Conditional, Values | None
**Activity Top Depth/Height Measure**               | Optional, Text           |                     | Removed
**Activity Top Depth/Height Unit**                  | Conditional, Values      |                     | Removed
**Activity Bottom Depth/Height Measure**            | Optional, Text           |                     | Removed
**Activity Bottom Depth/Height Measure Unit**       | Conditional, Values      |                     | Removed
**Activity Depth Altitude Reference Point**         | Conditional, Text        |                     | Removed
**Project ID**                                      | Required, Values         |                     | See `Project ID` above
**Organization**                                    | Optional, Text           |                     | Removed, Included in the metadata input form
**Monitoring Location ID**                          | Conditional, Values      | Optional, Text      | See `Monitoring Location ID` above
**Activity Comment**                                | Optional, Text           |                     | Removed
**Activity Latitude**                               | Optional, Number         |                     | Removed
**Activity Longitude**                              | Optional, Number         |                     | Removed
**Activity Source Map Scale**                       | Conditional, Text        |                     | Removed 
**Activity Horizontal Accuracy Measure**            | Optional, Number         |                     | Removed
**Activity Horizontal Accuracy Unit**               | Conditional, Values      |                     | Removed
**Activity Horizontal Collection Method**           | Conditional, Values      |                     | Removed
**Activity Horizontal Coordinate Reference System** | Conditional, Values      |                     | Removed
**Sample Collection Method ID**                     | Conditional, Values/Text |                     | Removed
**Sample Collection Equipment Name**                | Conditional, Values      | Optional, Values    | None, removed condition on `Sample Collection Method ID` as it's not included (TODO revisit)
**Sample Collection Equipment Comment**             | Optional, Text           |                     | Removed 
**Sample Preparation Method ID**                    | Optional, Text           |                     | Removed 
**Sample Container Type**                           | Conditional, Values      |                     | Removed 
**Sample Container Color**                          | Conditional, Values      |                     | Removed
**Chemical Preservative Used**                      | Conditional, Text        |                     | Removed
**Thermal Preservative Used**                       | Conditional, Values      |                     | Removed
**Sample Transport Storage Description**            | Conditional, Text        |                     | Removed
**Activity Attachment File Name**                   | Optional, Text           |                     | Removed 
**Activity Attachment Type**                        | Conditional, Text        |                     | Removed 
**Data Logger Line**                                | Conditional, Text        |                     | Removed 
**Result Detection Condition**                      | Conditional, Values      | Conditional, Values | [Subset](../src/subset/ResultDetectionCondition.json), Added `Below Detection/Quantification Limit`, `Above Detection/Quantification Limit`. Change was made to improve clarity.
**Characteristic Name**                             | Conditional, Values      | Required, Values    | [Additions](../src/addition/CharacteristicName.json), [Subtractions](../src/subtraction/CharacteristicName.json)
**Method Speciation**                               | Conditional, Values      | Optional, Values    | [Additions](../src/addition/MethodSpeciation.json), Added `as CN` to account for CCME cyanide requirement for method speciation
**Result Sample Fraction**                          | Conditional, Values      | Conditional, Values | [Additions](../src/addition/ResultSampleFraction.json), Added `Unspecified` to account for older data where the sample fraction may be unknown 
**Result Value**                                    | Conditional, Text        | Conditional, Number | Modified, currently only allows numeric values
**Result Unit**                                     | Conditional, Values      | Conditional, Values | [Additions](../src/addition/MeasurmentUnit.json), Added `L/mg-m` for UV absorbance not in `L/mg-cm`, `#/yr` to account for flushing rate, and `uATM` to account for those using micro-atmospheres 
**Result Qualifier**                                | Optional, Values         |                     | Removed
**Result Status ID**                                | Conditional, Values      | Optional, Values    | Modified to be optional (All data published to DataStream is available to public; data with WQX value of 'preliminary' was not made publically accessible via STORET)
**Statistical Base Code**                           | Optional, Values         |                     | Removed
**Result Value Type**                               | Conditional, Values      | Optional, Values    | Changed, removed default value making it optional
**Result Weight Basis**                             | Optional, Values         |                     | Removed
**Result Time Basis**                               | Optional, Values         |                     | Removed
**Result Temperature Basis**                        | Optional, Values         |                     | Removed
**Result Particle Size Basis**                      | Optional, Text           |                     | Removed
**Precision**                                       | Optional, Text           |                     | Removed
**Bias**                                            | Optional, Text           |                     | Removed
**Confidence Interval**                             | Optional, Text           |                     | Removed
**Upper Confidence Limit**                          | Optional, Text           |                     | Removed
**Lower Confidence Limit**                          | Optional, Text           |                     | Removed
**Result Comment**                                  | Optional, Text           | Optional, Text      | None
**Result Depth/Height Measure**                     | Optional, Text           |                     | Removed
**Result Depth/Height Unit**                        | Conditional, Values      |                     | Removed
**Result Depth/Altitude Reference Point**           | Optional, Text           |                     | Removed
**Result Sampling Point Name**                      | Optional, Text           |                     | Removed
**Result Attachment File Name**                     | Optional, Text           |                     | Removed
**Result Attachment Type**                          | Conditional, Text        |                     | Removed
**Result Analytical Method ID**                     | Conditional, Values/Text | Conditional, Text   | Changed, removed allowed list (US specific), any string accepted. (revisit)
**Result Analytical Method Context**                | Conditional, Values/Text | Conditional, Values | [Additions](../src/addition/ResultAnalyticalMethodContext.json), Added `EN` to allow for European standards, and `VMV` to allow for value method variable codes used in Canada
**Result Analytical Method Name**                   |                          | Conditional, Text   | Added as there is no look-up table of allowed method names to cross reference to get this information at the time. Now exists (revisit)
**Laboratory Name**                                 | Optional, Text           | Optional, Text      | None
**Laboratory Sample ID**                            |                          | Optional, Text      | Added, is reported by labs and helpful for some data stewards 
**Analysis Start Date**                             | Optional, Date           | Optional, Date      | See `Activity Start Date`
**Analysis Start Time**                             | Optional, Time           | Optional, Time      | See `Activity Start Date`
**Analysis Start Time Zone**                        | Conditional, Values      | Conditional, Text   | Changed format to meet ISO 8601 over Time Zone Codes
**Analysis End Date**                               | Optional, Date           |                     | Removed
**Analysis End Time**                               | Optional, Time           |                     | Removed
**Analysis End Time Zone**                          | Conditional, Values      |                     | Removed
**Result Laboratory Comment Code**                  | Optional, Values         |                     | Removed
**Result Detection/Quantitation Limit Type**        | Conditional, Values      | Conditional, Values | [Subset](../src/subset/ResultDetectionQuantitationLimitType.json)
**Result Detection/Quantitation Limit Measure**     | Conditional, Text        | Conditional, Number | Modified, currently only allows numeric values. Characteristic Names that require text have been removed.
**Result Detection/Quantitation Limit Unit**        | Conditional, Values      | Conditional, Values | See `Result Unit`
**Laboratory Accreditation Indicator**              | Optional, Bool           |                     | Removed 
**Laboratory Accreditation Authority**              | Optional, Text           |                     | Removed
**Lab Sample Preparation Method ID**                | Optional, Text           |                     | Removed
**Lab Sample Preparation Start Date**               | Optional, Date           |                     | Removed
**Lab Sample Preparation Start Time**               | Optional, Time           |                     | Removed
**Lab Sample Preparation Start Time Zone**          | Conditional, Values      |                     | Removed
**Lab Sample Preparation End Date**                 | Optional, Date           |                     | Removed
**Lab Sample Preparation End Time**                 | Optional, Time           |                     | Removed
**Lab Sample Preparation End Time Zone**            | Conditional, Values      |                     | Removed
**Substance Dilution Factor**                       | Optional, Integer        |                     | Removed
**Activity Group ID**                               | Conditional, Text        |                     | Removed
**Activity Group Name**                             | Optional, Text           |                     | Removed
**Activity Group Type**                             | Conditional, Values      |                     | Removed, can be auto generated internally

See https://github.com/gordonfn/schema/releases for details on `Characteristic Name` grouping changes.

[WQX Allowed Values](https://www.epa.gov/waterdata/storage-and-retrieval-and-water-quality-exchange-domain-services-and-downloads#domain)
