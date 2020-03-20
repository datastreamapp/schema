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
**Monitoring Location ID**                                     | Required, Text      | Required, Text   | None
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
**Monitoring Location Type**                                   |                     | Optional, Text   | Added TODO Why
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

## Results
- **Activity ID**: Removed, N/A
- **Activity Type**: Added new values
  - `Quality Control`: TODO
- **Activity Media Name**: Added new values
  - `Surface Water`: TODO
- **Activity Media Subdivision Name**: Removed, TODO
- **Activity Start Date**: Changed format to meet ISO 8601
- **Activity Start Time**: Changed format to meet ISO 8601
- **Activity Start Time Zone**: Removed, calculated internally using the Latitude and Longitude
- **Activity End Date**: See `Activity Start Date`
- **Activity End Time**: See `Activity Start Time`
- **Activity End Time Zone**: See `Activity Start Time Zone`
- **Activity Relative Depth Name**: Removed, TODO
- **Activity Height/Depth Measure**: None
- **Activity Height/Depth Unit**: None
- **Activity Top Depth/Height Measure**: Removed, TODO
- **Activity Top Depth/Height Unit**: Removed, TODO
- **Activity Bottom Depth/Height Measure**: Removed, TODO
- **Activity Bottom Depth/Height Measure Unit**: Removed, TODO
- **Activity Depth Altitude Reference Point**: Removed, TODO
- **Project ID**: See above
- **Organization**: Removed, Included in the metadata input form
- **Monitoring Location ID**: See Above
- **Activity Comment**: Removed, TODO
- **Activity Latitude**: Removed, TODO
- **Activity Longitude**: Removed, TODO
- **Activity Source Map Scale**: Removed, TODO
- **Activity Horizontal Accuracy Measure**: Removed, TODO
- **Activity Horizontal Accuracy Unit**: Removed, TODO
- **Activity Horizontal Collection Method**: Removed, TODO
- **Activity Horizontal Coordinate Reference System**: Removed, TODO
- **Sample Collection Method ID**: Removed TODO
- **Sample Collection Equipment Name**: None
- **Sample Collection Equipment Comment**: Removed TODO
- **Sample Preparation Method ID**: Removed TODO
- **Sample Container Type**: Removed TODO
- **Sample Container Color**: Removed TODO
- **Chemical Preservative Used**: Removed TODO
- **Thermal Preservative Used**: Removed TODO
- **Sample Transport Storage Description**: Removed TODO
- **Activity Attachment File Name**: Removed TODO
- **Activity Attachment Type**: Removed TODO
- **Data Logger Line**: Removed TODO
- **Result Detection Condition**: Added new values
  - `Not Reported`
  - `Above Detection/Quantification Limit`: TODO
  - `Below Detection/Quantification Limit`: TODO
  - removed `Present Below Quantification Limit` & `Present Above Quantification Limit`
- **Characteristic Name**: Added new values
  - `Silver Dioxide`
  - `Apparent Colour`
  - `C4-Fluorenes`, `Total Phosphorus, mixed forms`, `Total Nitrogen, mixed forms`, `Silica, reactive`, `Residue`, `Thorium`
  - `C10-C16 Hydrocarbons`, `C16-C34 Hydrocarbons`, `C10-C19 Hydrocarbons`, `C34-C50 Hydrocarbons`, `Purgeable hydrocarbons` 
  - `Extractable hydrocarbons`, `Didecyl dimethyl ammonium chloride`, `Diisopropanolamine`, `Monochlorobenzene`, `Sulfolane`
  - `Triphenyltin`, `3-Iodo-2-propynyl butyl carbamate`, `pheophytin`
  - Removed all with `Retired` in the name
  - Remove: `Gasoline range organics (C6-C12 GRO)`, `Extractable fuel hydrocarbons (C13-C22 DRO)`, and `Tetrachloroethene`
  - Removed duplicate names for `Shannon & Wiener Macroinvert Taxonomic Diversity Index`, `Escherichia coli`, and `Enterococcusin`
- **Method Speciation**: Added new values
  - `as CN`: TODO
- **Result Sample Fraction**: Added new values
  - `Acid Soluble`:
  - `Filtered, Lab`: TODO
  - `Filtered, Field`: TODO
  - `Unspecified`: TODO
- **Result Value**: Modified, currently only allows numeric values
- **Result Unit**: Added new values
  - `REL`: TODO
  - `CTU`: TODO
  - `HZN`: TODO
  - `L/mg-m`: TODO
  - `ug/m2-hr`: TODO
  - `mg/m2-hr`: TODO
  - `mg/m2-day`: TODO
  - `ug/cm2-day`: TODO
  - `ng/m2-day`: TODO
  - `TCU`: TODO
  - `#/yr`:
  - `uATM`:
  - TODO confirm list
- **Result Qualifier**: Removed TODO
- **Result Status ID**: None
- **Statistical Base Code**: Removed, TODO
- **Result Value Type**: Changed, removed default value TODO
- **Result Weight Basis**: Removed TODO
- **Result Time Basis**: Removed TODO
- **Result Temperature Basis**: Removed TODO
- **Result Particle Size Basis**: Removed TODO
- **Precision**: Removed TODO
- **Bias**: Removed TODO
- **Confidence Interval**: Removed TODO
- **Upper Confidence Limit**: Removed TODO
- **Lower Confidence Limit**: Removed TODO
- **Result Comment**: None
- **Result Depth/Height Measure**: Removed TODO
- **Result Depth/Height Unit**: Removed TODO
- **Result Depth/Altitude Reference Point**: Removed TODO
- **Result Sampling Point Name**: Removed TODO
- **Result Attachment File Name**: Removed TODO
- **Result Attachment Type**: Removed TODO
- **Result Analytical Method ID**: Changed, removed allowed list, any string accepted TODO
- **Result Analytical Method Context**: Added new values
  - `EN`: TODO
  - `VMV`: TODO
- **Result Analytical Method Name**: ADDED TODO
- **Laboratory Name**: None
- **Laboratory Sample ID**: ADDED TODO
- **Analysis Start Date**: See `Activity Start Date`
- **Analysis Start Time**: See `Activity Start Date`
- **Analysis Start Time Zone**: Changed format to meet ISO 8601 over Time Zone Codes
- **Analysis End Date**: Removed TODO
- **Analysis End Time**: Removed TODO
- **Analysis End Time Zone**: Removed TODO
- **Result Laboratory Comment Code**: Removed TODO
- **Result Detection/Quantitation Limit Type**: None
- **Result Detection/Quantitation Limit Measure**: None
- **Result Detection/Quantitation Limit Unit**: See `Result Unit`
- **Laboratory Accreditation Indicator**: Removed TODO
- **Laboratory Accreditation Authority**: Removed TODO
- **Lab Sample Preparation Method ID**: Removed TODO
- **Lab Sample Preparation Start Date**: Removed TODO
- **Lab Sample Preparation Start Time**: Removed TODO
- **Lab Sample Preparation Start Time Zone**: Removed TODO
- **Lab Sample Preparation End Date**: Removed TODO
- **Lab Sample Preparation End Time**: Removed TODO
- **Lab Sample Preparation End Time Zone**: Removed TODO
- **Substance Dilution Factor**: Removed TODO
- **Activity Group ID**: Removed TODO
- **Activity Group Name**: Removed TODO
- **Activity Group Type**: Removed TODO

See https://github.com/gordonfn/schema/releases for details on `Characteristic Name` grouping changes.