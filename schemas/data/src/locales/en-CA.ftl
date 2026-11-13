-default-message = must pass "{$keyword}" keyword validation
-comparison-limit = must be {$comparison} {$limit}

items = must not have more than {$limit} {$limit ->
  [one] item
  *[other] items
  }
additionalItems = {items}
additionalProperties = must not have additional properties
anyOf = must match a schema in "anyOf"
const = must be equal to constant
contains = must contain a valid item
dependencies = must have {$depsCount ->
    [one] property
    *[other] properties
  } {$deps} when property {$property} is present
dependentRequired = {dependencies}
enum = must be equal to one of the allowed values
falseSchema = boolean schema is false
format = must match format "{$format}"
formatMaximum = {-comparison-limit}
formatExclusiveMaximum = {-comparison-limit}
formatMinimum = {-comparison-limit}
formatExclusiveMinimum = {-comparison-limit}
if = must match "{$failingKeyword}" schema
maximum = {-comparison-limit}
exclusiveMaximum = {maximum}
maxItems = must not have more than {$limit} {$limit ->
  [one] item
  *[other] items
  }
maxLength = must not be longer than {$limit} {$limit ->
  [one] character
  *[other] characters
  }
maxProperties = must not have more than {$limit} {$limit ->
  [one] property
  *[other] properties
  }
minimum = {-comparison-limit}
exclusiveMinimum = {minimum}
minItems = must not have less than {$limit} {$limit ->
  [one] item
  *[other] items
  }
minLength = must not be shorter than {$limit} {$limit ->
  [one] character
  *[other] characters
  }
minProperties = must not have less than {$limit} {$limit ->
  [one] property
  *[other] properties
  }
multipleOf = must be a multiple of {$multipleOf}
not = must not be valid according to schema in "not"
oneOf = must match exactly one schema in "oneOf"
pattern = must match pattern "{$pattern}"
patternRequired = must have property matching pattern "{$missingPattern}"
propertyNames = property name is invalid
required = must have required property {$missingProperty}
type = must be {$type}{$nullable ->
  [true] /null
  *[default] {""}
}
unevaluatedItems = must not have more than {$len} {$len ->
  [one] item
  *[other] items
}
unevaluatedProperties = must not have unevaluated property "{$unevaluatedProperty}"
uniqueItems = must not have duplicate items (items ## {$j} and {$i} are identical)

# errorMessages
error-additional-columns = The file contains columns that are not in DataStream’s schema or Upload Template. Remove them, or correct the header if a column name is misspelled or missing. See the Upload Template for expected columns.

## format
error-date-format = Dates must be in format YYYY-MM-DD (e.g., 2020-09-23). See Tips & Tricks tab of the Upload Template (Dates and Times section) for formatting issues related to Excel or Google Sheets.
error-time-loose-pattern = Times must be in the 24-hour format HH:MM:SS (e.g., 14:30:30). Include a leading zero for hours before 10 (e.g., 04:30:30). See Tips & Tricks tab of the Upload Template (Dates and Times section) for formatting issues related to Excel or Google Sheets.
error-time-strict-pattern = Times must be in the 24-hour format HH:MM:SS (e.g., 14:30:30). Include a leading zero for hours before 10 (e.g., 04:30:30). See Tips & Tricks tab of the Upload Template (Dates and times section) for formatting issues related to Excel or Google Sheets.
error-timezone-loose-pattern = Time zones must be in UTC offset format (e.g., -06:00). See TimeZone LOOKUP tab in the Upload Template.
error-timezone-strict-pattern = Time zones must be in UTC offset format (e.g., -06:00). See TimeZone LOOKUP tab in the Upload Template.
error-string-pattern = Entries in this field must contain only letters, numbers, punctuation, symbols, and spaces. Remove any line breaks (line feeds or carriage returns) from the entry.
error-string-multiline-pattern = Entries in ResultComment must contain only letters, numbers, punctuation, symbols, spaces, and line breaks (line feeds or carriage returns). Remove any other characters from the entry.

## errors
error-ActivityType-CTS-ActivityStartTime = ActivityStartTime is required for continuous time-series data. Use the 24-hour format HH:MM:SS (e.g., 14:30:00). Include a leading zero for hours before 10 (e.g., 04:30:30).
error-ActivityType-ResultAnalyticalMethod = LaboratoryName and ResultAnalyticalMethod fields are required because the ActivityType entered includes "Sample", which indicates lab sample data. See DataStream's Reporting analytical methods guidance: https://datastream.org/en-ca/documentation/reporting-analytical-methods. If the result is actually a field measurement, change ActivityType to the appropriate "Field Msr/Obs" value from the Allowed Values list in the Upload Template (see Glossary tab for descriptions).
error-CharacteristicName-Depth-ActivityDepthHeightMeasure = ActivityDepthHeightMeasure must be blank when the CharacteristicName and ResutValue are measuring depth.
error-CharacteristicName-MethodSpeciation = MethodSpeciation is required for this CharacteristicName. See DataStream's Nutrient or Isotope data guidance: https://datastream.org/en-ca/documentation/nutrient-data-guidance; https://datastream.org/en-ca/documentation/isotope-data-guidance
error-CharacteristicName-Nutrient-ResultSampleFraction = ResultSampleFraction is missing or is not valid for this nutrient CharacteristicName. See DataStream's Nutrient data guidance: https://datastream.org/en-ca/documentation/nutrient-data-guidance
error-CharacteristicName-ResultSampleFraction = ResultSampleFraction is required for this CharacteristicName. Enter a value from the Allowed Values tab of the Upload Template (see Glossary tab for descriptions). For help selecting the appropriate ResultSampleFraction, see DataStream’s Nutrient, Metal-series or Isotope data guidance: E.g., https://datastream.org/en-ca/documentation/nutrient-data-guidance
error-CharacteristicName-StableIsotope-MethodSpeciation = MethodSpeciation is missing or is not valid for this isotope CharacteristicName. See DataStream's Isotope data guidance: https://datastream.org/en-ca/documentation/isotope-data-guidance
error-CSVInjection = The entry in this field starts with an invalid character (e.g.,  `=`, `+`, `-`,`@`,  [tab], [carriage return]). Remove the character from the start of the entry.
error-ResultDetectionCondition-ResultDetectionQuantitationLimit-above-below = ResultDetectionQuantitationLimitMeasure and ResultDetectionQuantitationLimitUnit are required when ResultDetectionCondition indicates a result above or below the detection limit.
error-ResultDetectionCondition-ResultDetectionQuantitationLimit-not-detect = ResultDetectionQuantitationLimitMeasure and  ResultDetectionQuantitationLimitUnit must be blank when ResultDectectionCondition is "Not Detected" or "Detected Not Quantified". See Glossary tab of the Upload Template for descriptions of ResultDetectionCondition allowed values.
error-ResultDetectionCondition-ResultValue = Either ResultValue or ResultDetectionCondition must be reported for each result, but not both. If the result is a specific numberic value, enter ResultValue and leave ResultDetectionCondition blank. If the result was not detected, not quantified, or above or below a detection limit, enter a ResultDetectionCondition value from the Allowed Values list in the Upload Template, and leave ResultValue blank.
error-ResultDetectionQuantitationLimitUnit-Salinity = ResultDetectionQuantitationLimitUnit for Salinity must be ppth (parts per thousand), ppm (parts per million), PSU (practical salinity unit), mg/L (milligrams per litre), or g/L (grams per litre).
error-ResultUnit-Salinity = ResultUnit for Salinity must be ppth (parts per thousand), ppm (parts per million), PSU (practical salinity unit), mg/L (milligrams per litre), or g/L (grams per litre).
qc-ColumnCount = The number of columns in this row does not match the header row. Review your .csv file to ensure all rows have the same number of columns. If you created or edited the file outside of Excel, check that values containing commas are enclosed in double quotes.
qc-RowCount = No data rows found. A dataset requires at least one row of data. Check that you uploaded the correct file.

## errors - groundwater
error-ActivityDepthHeightMeasure-ActivityDepthAltitudeReferencePoint = ActivityDepthAltitudeReferencePoint is required when ActivityDepthHeightMeasure is reported. Enter a value from the Allowed Values list in the Groundwater Upload Template (see Glossary tab for descriptions). See DataStream's Groundwater data guidance. 
error-ActivityMediaName-ActivityDepthHeightMeasure-Maximum = ActivityDepthHeightMeasure must be a negative value. Enter depth as a negative number (e.g., -5.0).
error-ActivityMediaName-Groundwater-DepthMeasure = At least one of ActivityDepthHeightMeasure, BoreholeDepthMeasure, WellDepthMeasure, WellOpenIntervalTopMeasure, or WellOpenIntervalBottomMeasure must be reported for groundwater or porewater. See DataStream's Groundwater data guidance.
error-CharacteristicName-WaterLevel-ActivityDepthAltitudeReferencePoint = ActivityDepthAltitudeReferencePoint is required for this CharacteristicName ("Water level in well, depth from a reference point"). Enter a value from the Allowed Values list in the Groundwater Upload Template.
error-GroundwaterFields-ActivityMediaName-Groundwater = ActivityMediaName must be "Groundwater" or "Porewater" when a groundwater schema field is reported. Check that you are using the appropriate Upload Template for your data type.
error-MonitoringLocationType-Well-SampleCondition = SampleCondition is required when MonitoringLocationType is a well or piezometer. See DataStream's Groundwater data guidance.
error-MonitoringLocationType-Well-WellUseType = WellUseType is required when MonitoringLocationType is a well or piezometer. Enter a value from the Allowed Values list in the Groundwater Upload Template (see Glossary tab for descriptions).

## quality-control
# qc-CharacteristicName-Deprecated = CharacteristicName has been deprecated. Review most up to date template for alternate or contact us.
# qc-MonitoringLocationType-ActivityDepthHeightMeasure-Minimum = Depth should not exceed the maximum depth associated with the selected MonitoringLocationType (i.e. River/stream, Lake/pond)
# qc-ResultUnit-Elevation = The unit for the CharacteristicName should be an elevation. ** TODO: MASL not a unit, needs to be added to QC rule lists
# qc-ResultValue-Depth-Maximum = Depths should be reported as positive values.
qc-ActivityMediaName-ActivityDepthHeightMeasure-Maximum = ActivityDepthHeightMeasure should be a negative value. Enter depth as a negative number (e.g., -5.0).
qc-ActivityType-CTS-ActivityStartTimeZone = ActivityStartTimeZone should be included for continuous time-series data. See DataStream's Continuous time-series data guidance: https://datastream.org/en-ca/documentation/nutrient-data-guidance
qc-ActivityType-CTS-ActivityStartTimeZone-UTC = The ActivityStartTimeZone "+00:00" (UTC/GMT) is outside North America. Convert to local time zone (see TimeZone LOOKUP tab in the Upload Template), or add a note in your dataset metadata to flag that data are reported in UTC/GMT.
qc-ActivityType-ResultSampleFraction = ResultSampleFraction should not be included for field measurements, and is not recommended for this CharacteristicName. Remove the ResultSampleFraction entry so this result is more comparable with other data.
qc-AnalysisStartTime-AnalysisStartTimeZone = AnalysisStartTimeZone should be included when an AnalysisStartTime is provided. Enter in UTC offset format (e.g., -06:00). See TimeZone LOOKUP tab in the Upload Template.
qc-CharacteristicName-ActivityMediaName-AmbientAir = ActivityMediaName should be "Ambient Air" for this characteristic because it is measuring conditions in the atmosphere (e.g. air temperature, barometric pressure) rather than in water. Change ActivityMediaName to this value.
qc-CharacteristicName-ActivityType-Surrogate = A percentage result for this characteristic typically represents percent recovery of a surrogate standard, which is a quality control test of the lab’s analytical method rather than an actual water quality measurement. If this result is for a surrogate standard, change ActivityType to "Quality Control Sample-Lab Surrogate Control Standard".
qc-CharacteristicName-Ammonia = CharacteristicName "Ammonia" is no longer an allowed value. If reporting total ammonia, use "Ammonia and ammonium". If reporting ammonia-nitrogen or free available ammonia use "Ammonia, un-ionized". See DataStream's Nutrient data guidance: https://datastream.org/en-ca/documentation/nutrient-data-guidance
qc-CharacteristicName-Metal-ResultSampleFraction = The ResultSampleFraction entered for this metal characteristic may not be appropriate. See DataStream's Metal-series data guidance: https://datastream.org/en-ca/documentation/metal-series-data-guidance
qc-CharacteristicName-MethodSpeciation = MethodSpeciation is not required and may not be relevant for this CharacteristicName. If it is not applicable, remove the MethodSpeciation entry so this result is comparable with other data for this characteristic.
qc-CharacteristicName-pH-ActivityType-Sample = ActivityType includes "Sample", which indicates lab sample data, so the CharacteristicName should be "pH, lab". If this pH result was measured by a lab, change CharacteristicName to "pH, lab". If it is a field measurement, change ActivityType to the appropriate "Field Msr/Obs" value from the Allowed Values list in the Upload Template (see Glossary tab for descriptions).
qc-CharacteristicName-pH-ResultDetectionQuantitationLimitUnit-None = The unit for this characteristic should be entered as "None". Update the ResultDetectionQuantitationLimitUnit to "None".
qc-CharacteristicName-pH-ResultUnit-None = The unit for this characteristic should be entered as "None". Update the ResultUnit to "None".
qc-CharacteristicName-Ratio-ResultDetectionQuantitationLimitUnit-None = The unit for this characteristic should be entered as "None". Update the ResultDetectionQuantitationLimitUnit to "None".
qc-CharacteristicName-Ratio-ResultUnit-None = The unit for this characteristic should be entered as "None". Update the ResultUnit to "None".
qc-CharacteristicName-ResultAnalyticalMethodName = ResultAnalyticalMethodName is required for ice cover results. Use this field to describe how ice-on and/or ice-off are defined (e.g., Ice-on is defined as the first day of 100% ice cover).
qc-MonitoringLocationCoordinate-BoundingBox = This monitoring location is outside Canada and transboundary Canada-US watersheds. Review and update the monitoring location coordinates. Longitude should be a negative value (e.g., -112.3832).
qc-ResultAnalyticalMethodContext-ActivityType = This ResultAnalyticalMethodContext applies to field measurements only, but the ActivityType entered includes "Sample", which indicates lab sample data. If this is a field measurement, change ActivityType to the appropriate "Field Msr/Obs" value from the Allowed Values list in the Upload Template (see Glossary tab for descriptions). If this is lab data, change ResultAnalyticalMethodContext to one that reflects the lab's method. See DataStream's Reporting analytical methods guidance: https://datastream.org/en-ca/documentation/reporting-analytical-method
qc-ResultDetectionQuantitationLimitMinimumMeasure-Minimum = ResultDetectionQuantitationLimitMeasure should not be below zero for the ResultDetectionQuantitationLimitUnit entered. Check your source data or lab report to confirm the correct measure and unit.
qc-ResultDetectionQuantitationLimitUnit-NoValue = ResultDetectionQuantitationLimitUnit should be blank when ResultDetectionQuantitationLimitMeasure is blank. Remove the unit, or enter the measure.
qc-ResultDetectionQuantitationLimitUnit-Turbidity = The unit entered in ResultDetectionQuantitationLimitUnit is specific to turbidity, but the CharacteristicName is not "Turbidity". Check the unit in your source data and change this field, or, if this is a turbidity result, change the CharacteristicName.
qc-ResultSampleFraction-ActivityMediaName-Sediment = The ResultSampleFraction entered applies only to results where a sequential extraction was used to measure metals. If your data comes from this type of analysis performed on the particulate portion of a water sample, use the ResultSampleFraction "Suspended" and enter the sequential extraction term in the ResultComment. See DataStream's Metal-series data guidance: https://datastream.org/en-ca/documentation/metal-series-data-guidance
qc-ResultSampleFraction-FreeAvailable = ResultSampleFraction “Free Available” is not appropriate for this CharacteristicName. Enter another ResultSampleFraction value from the Allowed Values list in the Upload Template (see Glossary tab for descriptions). For help selecting the appropriate sample fraction for nutrient, metal-series or isotope data, see the relevant DataStream guidance: E.g., https://datastream.org/en-ca/documentation/nutrient-data-guidance
qc-ResultStatusID-Deprecated =  ResultStatusID "Final" and "Accepted" are no longer allowed values. Use "Preliminary", "Provisional", or "Validated". See Glossary tab of the Upload Template for descriptions of these ResultStatusID values.
qc-ResultUnit-NoValue = ResultUnit should be blank when ResultValue is blank. Remove the entry for ResultUnit, or enter the ResultValue.
qc-ResultUnit-Percent = This CharacteristicName is typically measured as a percent. Check the unit in your source data. If the result is a percent, change ResultUnit to "%".
qc-ResultUnit-Turbidity = This ResultUnit is specific to turbidity, but the CharacteristicName entered is not "Turbidity". Check your source data. If this is not a turbidity result, update the unit. If this is a turbidity result, update the CharacteristicName to “Turbidity”.
qc-ResultValue-DissolvedOxygen-Unit = The ResultUnit "%" suggests this is dissolved oxygen saturation rather than a concentration. If so, change CharacteristicName to "Dissolved oxygen saturation". If the result is a concentration, change ResultUnit to a concentration unit (e.g., mg/L).
qc-ResultValue-DOSaturation-Minimum = This characteristic ("Dissolved oxygen saturation") should not have a ResultValue below zero. Check your source data for sign errors or missing-data placeholders.
qc-ResultValue-DOY-Range = The ResultValue for "DOY (day of year)" must be between 1 and 366 (366 only in leap years).
qc-ResultValue-Minimum = The ResultValue should not be below zero for the ResultUnit entered. Check your source data for sign errors or missing-data placeholders.
qc-ResultValue-pH-Range = The ResultValue for pH is outside the expected range of 0 to 14. Check your source data and update any incorrect entries, or use the ResultComment field to provide additional context.
qc-ResultValue-Temperature-Range = The ResultValue for temperature is outside the expected range from -100 to 100 degrees Celcius. Check your source data and update any incorrect entries, or use the ResultComment field to provide additional context.
qc-WhiteSpace = The entry in this field starts or ends with a space. Remove any leading or trailing spaces from the entry.

## quality-control (code)
qc-ActivityEndDate-Future = {qc-Date-Future}
qc-ActivityStartDate-Future = {qc-Date-Future}
qc-ActivityTypeContinuous = When observations of the same type are taken as frequently as once an hour or more, the ActivityType should be "Field Msr/Obs-Continuous Time Series". See DataStream's Continuous time-series data guidance: https://datastream.org/en-ca/documentation/continuous-time-series-data-guidance
qc-AnalysisStartDate-Future = {qc-Date-Future}
qc-DatasetName = The entry in the DatasetName column of this file is different from the name in your dataset metadata. Your metadata name is your dataset’s official name across DataStream. We recommend making them the same: matching names make it easier for others to identify your dataset and see that this file belongs to it. If you upload the file as it is, your published data will use the official name. Your original file is kept unchanged and stays publicly available in the dataset’s Changelog.
qc-Date-Future = A date entered for this result is in the future. Update the affected ActivityStartDate, ActivityEndDate or AnalysisStartDate field.
qc-MonitoringLocationCoordinate-Duplicate = This MonitoringLocationID has more than one set of coordinates (latitude and longitude) associated with it. Each MonitoringLocationID should represent one monitoring site, so choose a single set of coordinates that best represents the site and use it for all results at that site. Otherwise, these will appear as separate locations in DataStream. If these are actually different monitoring sites, enter a unique MonitoringLocationID for each.
qc-MonitoringLocationHorizontalCoordinateReferenceSystem-Duplicate = This MonitoringLocationID has more than one coordinate reference system associated with it. If a reference system was entered incorrectly, update it so each ID uses only one; otherwise, these will appear as separate locations in DataStream. If these are actually different monitoring sites, enter a unique MonitoringLocationID for each.
qc-MonitoringLocationName-Duplicate = This MonitoringLocationID has more than one MonitoringLocationName associated with it. If the name was entered inconsistently (e.g., a spelling, spacing, or capitalization difference), update it so each ID has only one associated name; otherwise, these will appear as separate locations in DataStream. If these are actually different monitoring sites, enter a unique MonitoringLocationID for each.
qc-MonitoringLocationType-Duplicate = This MonitoringLocationID has more than one MonitoringLocationType associated with it. If a location type was entered incorrectly, update it so each ID uses only one; otherwise, these will appear as separate locations in DataStream. If these are actually different monitoring sites, enter a unique MonitoringLocationID for each.

## errors (code)
error-ActivityMediaName-Groundwater-Mixed = Groundwater data must be uploaded in a separate dataset from surface water data. If ActivityMediaName is "Groundwater" or "Porewater" on any row, the file cannot contain surface water ActivityMediaName values.
error-ActivityType-Continuous-Mixed = Continuous time-series data must be uploaded in a separate dataset from discrete (single point-in-time) data. If the ActivityType is "Field Msr/Obs-Continuous Time Series" on any row, the file cannot contain other ActivityType values.
