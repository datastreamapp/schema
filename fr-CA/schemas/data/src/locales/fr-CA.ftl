-default-message = doit être valide selon le critère "{$keyword}"
-comparison-limit = doit être {$comparison} {$limit}
items =
    ne doit pas contenir plus de {$limit} {$limit ->
        [one] élémént
       *[other] éléménts
    }
additionalItems = {items}
additionalProperties = ne doit pas contenir de propriétés additionnelles
anyOf = doit correspondre à un schéma de « anyOf »
const = doit être égal à la constante
contains = doit contenir un élément valide
dependencies =
    doit avoir { $depsCount ->
        [one] propriété
       *[other] propriétés
    } { $deps } quand la propriété { $property } est présente
dependentRequired = { dependencies }
enum = doit être égal à une des valeurs prédéfinies
falseSchema = le schema est « false »
format = doit correspondre au format « {$format} »
formatMaximum = {-comparison-limit}
formatExclusiveMaximum = { -comparison-limit }
formatMinimum = { -comparison-limit }
formatExclusiveMinimum = { -comparison-limit }
if = doit correspondre au schéma « {$failingKeyword} »
maximum = { -comparison-limit }
exclusiveMaximum = { maximum }
maxItems =
    ne doit pas contenir plus de {$limit} {$limit ->
      [one] élément
      *[other] éléments
    }
maxLength =
    ne doit pas dépasser {$limit} {$limit ->
        [one] caractère
       *[other] caractères
    }
maxProperties =
    ne doit pas contenir plus de {$limit} {$limit ->
        [one] propriété
       *[other] propriétés
    }
minimum = { -comparison-limit }
exclusiveMinimum = { minimum }
minItems =
    ne doit pas contenir moins de {$limit} {$limit ->
        [one] élément
       *[other] éléments
    }
minLength =
    ne doit pas faire moins de {$limit} {$limit ->
        [one] caractère
       *[other] caractères
    }
minProperties =
    ne doit pas contenir moins de {$limit} {$limit ->
        [one] propriété
       *[other] propriétés
    }
multipleOf = doit être un multiple de {$multipleOf}
not = est invalide selon le schéma « not »
oneOf = doit correspondre à exactement un schéma de « oneOf »
pattern = doit correspondre au format « {$pattern} »
patternRequired = la propriété doit correspondre au format « {$missingPattern} »
propertyNames = le nom de propriété est invalide
required = requiert la propriété {$missingProperty}
type =
    doit être de type {$type}{$nullable -> 
        [true] /null
       *[default] {""}
    }
unevaluatedItems =
    ne doit pas contenir plus de {$len} {$len ->
        [one] élément
       *[other] éléments
    }
unevaluatedProperties = ne doit pas avoir de propriétés non évaluées
uniqueItems = ne doit pas contenir de doublons (les éléments ## {$j} et {$i} sont identiques)

# errorMessages


## logic

error-ActivityType-ResultAnalyticalMethod = Requires LaboratoryName and ResultAnalyticalMethod columns when ActivityType starts with 'Sample'
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

qc-ActivityType-ResultSampleFraction = ResultSampleFraction may not be relevant for selected ActivityType
# qc-CharacteristicName-Deprecated = CharacteristicName has been deprecated. Review most up to date template for alternate or contact us.
qc-CharacteristicName-MethodSpeciation = MethodSpeciation may not be relevant for selected CharacteristicName
qc-MonitoringLocationCoordinate-BoundingBox = Monitoring Location Latitude/Longitude is outside DataStream boundary
qc-ResultDetectionQuantitationLimitMinimumMeasure-Minimum = ResultDetectionQuantitationLimitMeasure should not be below zero for the selected ResultDetectionQuantitationLimitUnit
# qc-MonitoringLocationType-ActivityDepthHeightMeasure-Minimum = Depth should not exceed the maximum depth associated with the selected MonitoringLocationType (i.e. River/stream, Lake/pond)
qc-ResultDetectionQuantitationLimitUnit-None = The unit for the CharacteristicName should be None
qc-ResultDetectionQuantitationLimitUnit-NoValue = ResultDetectionQuantitationLimitUnit is not needed when ResultDetectionQuantitationLimitMeasure is not populated
qc-ResultUnit-Elevation = The unit for the CharacteristicName should be an elevation. ** TODO: MASL not a unit, needs to be added to QC rule lists
qc-ResultUnit-None = The unit for the CharacteristicName should be None
qc-ResultUnit-NoValue = ResultUnit is not needed when ResultValue is not populated
qc-ResultUnit-Percent = The unit for the CharacteristicName is typically expressed as a %
# qc-ResultValue-Depth-Maximum = Depth is outside an expected range (<0).
qc-ResultValue-DissolvedOxygen-Unit = The unit for Dissolved oxygen (DO) should not be %
qc-ResultValue-DOSaturation-Minimum = The selected CharacteristicName should not have a measure below zero
qc-ResultValue-Minimum = ResultValue should not be below zero for the selected ResultUnit
qc-ResultValue-pH-Range = pH ResultValue is outside the accepted allowed range (0 to 14)
qc-ResultValue-Temperature-Range = Temperature is outside an expected range (-100 to 100).
qc-WhiteSpace = Leading or trailing white space detected in character string

## quality-control (code)

qc-ActivityStartDate-Future = Contains date in the future
qc-ActivityEndDate-Future = Contains date in the future
qc-AnalysisStartDate-Future = Contains date in the future
qc-MonitoringLocationCoordinate-Duplicate = Multiple MonitoringLocation coordinates (Latitude, Longitude) are used with the same MonitoringLocationID
qc-MonitoringLocationName-Duplicate = Multiple MonitoringLocationNames are used with the same MonitoringLocationID
qc-MonitoringLocationType-Duplicate = Multiple MonitoringLocationTypes are used with the same MonitoringLocationID
