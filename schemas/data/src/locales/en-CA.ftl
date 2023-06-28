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
unevaluatedProperties = must not have unevaluated properties
uniqueItems = must not have duplicate items (items ## {$j} and {$i} are identical)

# errorMessages
## format
error-date-format = Must match format YYYY-MM-DD (i.e. 1999-12-31)
error-time-loose-pattern = Must match format HH:MM:SS (i.e. 23:59:59)
error-time-strict-pattern = Times earlier than 12:00:00 should include a leading zero (e.g. 05:00:00)
error-timezone-loose-pattern = Must match format '-06:00'
error-timezone-strict-pattern = { error-timezone-loose-pattern }

## errors
error-ActivityType-ResultAnalyticalMethod = Requires LaboratoryName and ResultAnalyticalMethod columns when ActivityType starts with 'Sample' (i.e. Activity is not a Field Msr/Obs)
error-CharacteristicName-MethodSpeciation = MethodSpeciation required for selected CharacteristicName
error-CharacteristicName-Nutrient-ResultSampleFraction = ResultSampleFractions for nutrients should follow guidance in Best Practices Guide for Nutrient Data (see resources page or contact us)
error-CharacteristicName-ResultSampleFraction = ResultSampleFraction required for selected CharacteristicName
error-CharacteristicName-StableIsotope-MethodSpeciation = Isotope MethodSpeciation required for selected CharacteristicName
error-CSVInjection = Invalid starting character. `=`, `+`, `-`, `@`, `[space]`, `[tab]`, `[carriage return]` are not valid characters for the beginning of text columns
error-ResultDetectionCondition-ResultDetectionQuantitationLimit-above-below = ResultDetectionQuantitationLimit fields are required when ResultDetectionCondition is above or below Detection/Quantification limits
error-ResultDetectionCondition-ResultDetectionQuantitationLimit-not-detect = When ResultDetectionCondition is set to 'Not Detected' or 'Detected Not Quantified' the ResultDetectionQuantitationLimit fields should not be populated
error-ResultDetectionCondition-ResultValue = Only one of ResultValue or ResultDetectionCondition should be populated
error-ResultDetectionQuantitationLimitUnit-Salinity = ResultDetectionQuantitationLimitUnit for CharacteristicName Salinity should be ppth (parts per thousand), ppm (parts per million) or PSU (practical salinity unit)
error-ResultUnit-Salinity = ResultUnit for CharacteristicName Salinity should be ppth (parts per thousand), ppm (parts per million) or PSU (practical salinity unit)

## quality-control
qc-ActivityMediaName-ActivityDepthHeightMeasure-Maximum = ActivityDepthHeightMeasure should be below 0
qc-ActivityType-ResultSampleFraction = ResultSampleFraction may not be relevant for selected ActivityType
# qc-CharacteristicName-Deprecated = CharacteristicName has been deprecated. Review most up to date template for alternate or contact us.
qc-CharacteristicName-ActivityMediaName-AmbientAir = The ActivityMediaName for this CharacteristicName should be "Ambient Air"
qc-CharacteristicName-MethodSpeciation = MethodSpeciation is not required and may not be relevant for selected CharacteristicName
qc-MonitoringLocationCoordinate-BoundingBox = Monitoring Location Latitude/Longitude is outside DataStream boundary

qc-ResultAnalyticalMethodContext-YSI-ActivityType = The ActivityType may not be appropriate for this ResultAnalyticalMethodContext. When ResultAnalyticalMethodContext is "YSI", ActivityType "Field Msr/Obs-Portable Data Logger" is expected
qc-ResultDetectionQuantitationLimitMinimumMeasure-Minimum = ResultDetectionQuantitationLimitMeasure should not be below zero for the selected ResultDetectionQuantitationLimitUnit
# qc-MonitoringLocationType-ActivityDepthHeightMeasure-Minimum = Depth should not exceed the maximum depth associated with the selected MonitoringLocationType (i.e. River/stream, Lake/pond)
qc-ResultDetectionQuantitationLimitUnit-None = The unit for the CharacteristicName should be None
qc-ResultDetectionQuantitationLimitUnit-NoValue = ResultDetectionQuantitationLimitUnit is not needed when ResultDetectionQuantitationLimitMeasure is not populated
# qc-ResultUnit-Elevation = The unit for the CharacteristicName should be an elevation. ** TODO: MASL not a unit, needs to be added to QC rule lists
qc-ResultUnit-None = The unit for the CharacteristicName should be None
qc-ResultUnit-NoValue = ResultUnit is not needed when ResultValue is not populated
qc-ResultUnit-Percent = The unit for the CharacteristicName is typically expressed as a %
# qc-ResultValue-Depth-Maximum = Depth is outside an expected range (<0).
qc-ResultValue-DissolvedOxygen-Unit = The unit for Dissolved oxygen (DO) should not be %. For DO saturation, use CharacteristicName 'Dissolved oxygen saturation'
qc-ResultValue-DOSaturation-Minimum = The selected CharacteristicName should not have a measure below zero
qc-ResultValue-Minimum = ResultValue should not be below zero for the selected ResultUnit
qc-ResultValue-pH-Range = pH ResultValue is outside the accepted allowed range (0 to 14)
qc-ResultValue-Temperature-Range = Temperature is outside an expected range (-100 to 100).
qc-WhiteSpace = Leading or trailing white space detected in character string

## quality-control (code)
qc-Date-Future = Contains date in the future
qc-ActivityStartDate-Future = {qc-Date-Future}
qc-ActivityEndDate-Future = {qc-Date-Future}
qc-AnalysisStartDate-Future = {qc-Date-Future}
qc-MonitoringLocationCoordinate-Duplicate = Multiple MonitoringLocation coordinates (Latitude, Longitude) are used with the same MonitoringLocationID
qc-MonitoringLocationName-Duplicate = Multiple MonitoringLocationNames are used with the same MonitoringLocationID
qc-MonitoringLocationType-Duplicate = Multiple MonitoringLocationTypes are used with the same MonitoringLocationID
qc-MonitoringLocationHorizontalCoordinateReferenceSystem-Duplicate = Multiple MonitoringLocationHorizontalCoordinateReferenceSystems are used with the same MonitoringLocationID
