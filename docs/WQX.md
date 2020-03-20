# WQX Comparison

To ensure a lower barrier to entry, multiple changes were made in the structure:
- most optional fields were dropped, 
- CSV flavour of the schema was chosen for ease of export from Microsoft Excel
- `Projects`, `Monitoring Locations` and `Results` were flatten together to simplify the upload process
- Headers are in PascalCase to ensure a simple transformations by the internal system
- Date, Time and Time Zone were changed to use the ISO 8601 format to allow ease parsing and universal readability

## Projects

Column                           | WQX               | DS-WQX         | Changes
---------------------------------|-------------------|----------------|----------------------------------------------------------
**Project ID**                   | Required, Text    |                | Removed, generated automatically internally using UUID v4
**Project Name**                 | Required, Text    | Required, Text | Renamed to `DatasetName`, increased max length to 255 (v3 increases to 512)
**Project Description**          | Conditional, Text |                | Moved to metadata input form, renamed to `Abstract`
**Sampling Design Type**         | Optional, Values  |                | Removed
**QAPP Approved Indicator**      | Optional, Bool    |                | Removed
**QAPP Approval Agency Name**    | Optional, Text    |                | Removed
**Project Attachment File Name** | Conditional, Text |                | Removed
**Project Attachment Type**      | Conditional, Text |                | Removed



## Monitoring Locations

Column                                                         | WQX                 | DS-WQX           | Changes
---------------------------------------------------------------|---------------------|------------------|--------------------------------------------------------
**Monitoring Location ID**                                     | Required, Text      | Optional, Text   | Changed, column is not being used for joining tables
**Monitoring Location Name**                                   | Required, Text      | Required, Text   | None
**Monitoring Location Type**                                   | Required, Values    | Required, Values | Added new values: `Estuary`, `Ocean`
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
**Monitoring Location Horizontal Collection Method**           | Required, Values    |                  | Removed TODO Why
**Monitoring Location Horizontal Coordinate Reference System** | Required, Values    | Required, Values | None
**Monitoring Location Waterbody**                              |                     | Optional, Text   | Added TODO Why
**Vertical Measure**                                           | Optional, Number    |                  | Removed
**Vertical Unit**                                              | Conditional, Values |                  | Removed
**Vertical Collection Method**                                 | Conditional, Values |                  | Removed
**Vertical Coordinate Reference System**                       | Conditional, Values |                  | Removed
**Monitoring Location Country Code**                           | Optional, Values    |                  | Removed
**Monitoring Location State Code**                             | Conditional, Values |                  | Removed, can be auto generated internally
**Monitoring Location County Name**                            | Optional, Values    |                  | Removed, US Specific, can be auto generated internally
**Well Type**                                                  | Optional, Values    |                  | Removed
**Aquifer Name**                                               | Optional, Text      |                  | Removed
**Well Formation Type**                                        | Optional, Values    |                  | Removed
**Well Hole Depth Measure Value**                              | Optional, Number    |                  | Removed
**Well Hole Depth Measure Unit**                               | Conditional, Values |                  | Removed
**Monitoring Location Attachment File Name**                   | Optional, Text      |                  | Removed
**Monitoring Location Attachment Type**                        | Conditional, Text   |                  | Removed

## Physical-Chemistry Results
Column                                              | WQX                 | DS-WQX              | Changes
----------------------------------------------------|---------------------|---------------------|----------------------------------------------------------------
**Activity ID**                                     | Required, Text      |                     | Removed TODO Why
**Activity Type**                                   | Required, Values    | Required, Values    | Added `Quality Control` (TODO Why)
**Activity Media Name**                             | Required, Values    | Required, Values    | Added `Surface Water` (TODO Why)
**Activity Media Subdivision Name**                 | Optional, Values    |                     | Removed
**Activity Start Date**                             | Required, Date      | Required, Date      | Changed format to meet ISO 8601
**Activity Start Time**                             | Optional, Time      | Optional, Time      | Changed format to meet ISO 8601
**Activity Start Time Zone**                        | Conditional, Text   |                     | Removed, calculated internally using the Latitude and Longitude
**Activity End Date**                               | Required, Date      | Required, Date      | See `Activity Start Date`
**Activity End Time**                               | Optional, Time      | Optional, Time      | See `Activity Start Time`
**Activity End Time Zone**                          | Conditional, Text   |                     | See `Activity Start Time Zone`
**Activity Relative Depth Name**                    | Optional, Values    |                     | Removed
**Activity Height/Depth Measure**                   | Optional, Text      | Optional, Number    | Changed type to Number only
**Activity Height/Depth Unit**                      | Conditional, Values | Conditional, Values | None
**Activity Top Depth/Height Measure**               | Optional, Text      |                     | Removed
**Activity Top Depth/Height Unit**                  | Conditional, Values |                     | Removed
**Activity Bottom Depth/Height Measure**            | Optional, Text      |                     | Removed
**Activity Bottom Depth/Height Measure Unit**       | Conditional, Values |                     | Removed
**Activity Depth Altitude Reference Point**         | Conditional, Text   |                     | Removed
**Project ID**                                      | Required, Values    |                     | See `Project ID`
**Organization**                                    | Optional, Text      |                     | Removed, Included in the metadata input form
**Monitoring Location ID**                          | Conditional, Values |                     | See `Monitoring Location ID`
**Activity Comment**                                | Optional, Text      |                     | Removed
**Activity Latitude**                               | Optional, Number    |                     | Removed
**Activity Longitude**                              | Optional, Number    |                     | Removed
**Activity Source Map Scale**                       | Conditional, Text   |                     | Removed 
**Activity Horizontal Accuracy Measure**            | Optional, Number    |                     | Removed
**Activity Horizontal Accuracy Unit**               | Conditional, Values |                     | Removed
**Activity Horizontal Collection Method**           | Conditional, Values |                     | Removed
**Activity Horizontal Coordinate Reference System** | Conditional, Values |                     | Removed
**Sample Collection Method ID**                     | Conditional, Text   |                     | Removed
**Sample Collection Equipment Name**                | Conditional, Values | Optional, Values    | None
**Sample Collection Equipment Comment**             | Optional, Text      |                     | Removed 
**Sample Preparation Method ID**                    | Optional, Text      |                     | Removed 
**Sample Container Type**                           | Conditional, Values |                     | Removed 
**Sample Container Color**                          | Conditional, Values |                     | Removed
**Chemical Preservative Used**                      | Conditional, Text   |                     | Removed
**Thermal Preservative Used**                       | Conditional, Values |                     | Removed
**Sample Transport Storage Description**            | Conditional, Text   |                     | Removed
**Activity Attachment File Name**                   | Optional, Text      |                     | Removed 
**Activity Attachment Type**                        | Conditional, Text   |                     | Removed 
**Data Logger Line**                                | Conditional, Text   |                     | Removed 
**Result Detection Condition**                      | Conditional, Values | Conditional, Values | Added `Not Reported`. Replaced `Present Below Quantification Limit` with `Below Detection/Quantification Limit`, `Present Above Quantification Limit` with `Above Detection/Quantification Limit`
**Characteristic Name**                             | Conditional, Values | Required, Values    | Added new values: `Silver Dioxide`, `Apparent Colour`, `C4-Fluorenes`, `Total Phosphorus, mixed forms`, `Total Nitrogen, mixed forms`, `Silica, reactive`, `Residue`, `Thorium`, `C10-C16 Hydrocarbons`, `C16-C34 Hydrocarbons`, `C10-C19 Hydrocarbons`, `C34-C50 Hydrocarbons`, `Purgeable hydrocarbons`, `Extractable hydrocarbons`, `Didecyl dimethyl ammonium chloride`, `Diisopropanolamine`, `Monochlorobenzene`, `Sulfolane`, `Triphenyltin`, `3-Iodo-2-propynyl butyl carbamate`, `pheophytin`. Removed: `Gasoline range organics (C6-C12 GRO)`, `Extractable fuel hydrocarbons (C13-C22 DRO)`, and `Tetrachloroethene`, duplicate names for `Shannon & Wiener Macroinvert Taxonomic Diversity Index`, `Escherichia coli`, and `Enterococcusin`, all with `(Retired)` in the name
**Method Speciation**                               | Conditional, Values | Conditional, Values | Added `as CN` (TODO Why)
**Result Sample Fraction**                          | Optional, Values    | Optional, Values    | Added `Acid Soluble` (TODO Why), `Filtered, Lab` (TODO Why), `Filtered, Field` (TODO Why), `Unspecified` (TODO Why)
**Result Value**                                    | Conditional, Text   | Conditional, Number | Modified, currently only allows numeric values
**Result Unit**                                     | Conditional, Values | Conditional, Values | Added `REL`, `CTU`, `HZN`, `L/mg-m`, `ug/m2-hr`, `mg/m2-hr`, `mg/m2-day`, `ug/cm2-day`, `ng/m2-day`, `TCU`, `#/yr`, `uATM` (TODO Why)
**Result Qualifier**                                | Optional, Values    |                     | Removed
**Result Status ID**                                | Conditional, Values | Optional, Values    | Modified to be optional (TODO Why)
**Statistical Base Code**                           | Optional, Values    |                     | Removed
**Result Value Type**                               | Conditional, Values | Optional, Values    | Changed, removed default value making it optional
**Result Weight Basis**                             | Optional, Values    |                     | Removed
**Result Time Basis**                               | Optional, Values    |                     | Removed
**Result Temperature Basis**                        | Optional, Values    |                     | Removed
**Result Particle Size Basis**                      | Optional, Text      |                     | Removed
**Precision**                                       | Optional, Text      |                     | Removed
**Bias**                                            | Optional, Text      |                     | Removed
**Confidence Interval**                             | Optional, Text      |                     | Removed
**Upper Confidence Limit**                          | Optional, Text      |                     | Removed
**Lower Confidence Limit**                          | Optional, Text      |                     | Removed
**Result Comment**                                  | Optional, Text      | Optional, Text      | None
**Result Depth/Height Measure**                     | Optional, Text      |                     | Removed
**Result Depth/Height Unit**                        | Conditional, Values |                     | Removed
**Result Depth/Altitude Reference Point**           | Optional, Text      |                     | Removed
**Result Sampling Point Name**                      | Optional, Text      |                     | Removed
**Result Attachment File Name**                     | Optional, Text      |                     | Removed
**Result Attachment Type**                          | Conditional, Text   |                     | Removed
**Result Analytical Method ID**                     | Conditional, Text   | Conditional, Text   | Changed, removed allowed list, any string accepted 
**Result Analytical Method Context**                | Conditional, Text   | Conditional, Values | Added `EN` (TODO Why), `VMV` (TODO Why)
**Result Analytical Method Name**                   |                     | Conditional, Text   | Added (TODO Why) 
**Laboratory Name**                                 | Optional, Text      | Optional, Text      | None
**Laboratory Sample ID**                            |                     | Optional, Text      | Added (TODO Why), same as `Activity ID`?
**Analysis Start Date**                             | Optional, Date      | Optional, Date      | See `Activity Start Date`
**Analysis Start Time**                             | Optional, Time      | Optional, Time      | See `Activity Start Date`
**Analysis Start Time Zone**                        | Conditional, Values | Conditional, Text   | Changed format to meet ISO 8601 over Time Zone Codes
**Analysis End Date**                               | Optional, Date      |                     | Removed
**Analysis End Time**                               | Optional, Time      |                     | Removed
**Analysis End Time Zone**                          | Conditional, Values |                     | Removed
**Result Laboratory Comment Code**                  | Optional, Values    |                     | Removed
**Result Detection/Quantitation Limit Type**        | Conditional, Values | Conditional, Values | None
**Result Detection/Quantitation Limit Measure**     | Conditional, Text   | Conditional, Number | Modified, currently only allows numeric values
**Result Detection/Quantitation Limit Unit**        | Conditional, Values | Conditional, Values | See `Result Unit`
**Laboratory Accreditation Indicator**              | Optional, Bool      |                     | Removed 
**Laboratory Accreditation Authority**              | Optional, Text      |                     | Removed
**Lab Sample Preparation Method ID**                | Optional, Text      |                     | Removed
**Lab Sample Preparation Start Date**               | Optional, Date      |                     | Removed
**Lab Sample Preparation Start Time**               | Optional, Time      |                     | Removed
**Lab Sample Preparation Start Time Zone**          | Conditional, Values |                     | Removed
**Lab Sample Preparation End Date**                 | Optional, Date      |                     | Removed
**Lab Sample Preparation End Time**                 | Optional, Time      |                     | Removed
**Lab Sample Preparation End Time Zone**            | Conditional, Values |                     | Removed
**Substance Dilution Factor**                       | Optional, Integer   |                     | Removed
**Activity Group ID**                               | Conditional, Text   |                     | Removed
**Activity Group Name**                             | Optional, Text      |                     | Removed
**Activity Group Type**                             | Conditional, Values |                     | Removed

See https://github.com/gordonfn/schema/releases for details on `Characteristic Name` grouping changes.