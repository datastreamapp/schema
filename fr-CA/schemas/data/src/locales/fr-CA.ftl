const __locales = ["en-CA","en"]

const __formatNumber = (value, options) => {
	return new Intl.NumberFormat(__locales, options).format(value)
}

const __formatVariable = (value) => {
  if (typeof value === 'string') return value
  const decimal =  Number.parseFloat(value)
  const number = Number.isInteger(decimal) ? Number.parseInt(value) : decimal
  return __formatNumber(number)
}

const __select = (value, cases, fallback, options) => {
	const pluralRules = new Intl.PluralRules(__locales, options)
	const rule = pluralRules.select(value)
	return cases[value] ?? cases[rule] ?? fallback
}

const defaultMessage = (params) => `must pass "${params?.keyword}" keyword validation`
const comparisonLimit = (params) => `must be ${params?.comparison} ${params?.limit}`
export const items = (params) => `must not have more than ${__formatVariable(params?.limit)} ${__select(
    params?.limit,
    {
      'one': `item`
    },
    `items`
  )}`
export const additionalItems = (params) => `${items(params)}`
export const additionalProperties = `must not have additional properties`
export const anyOf = `must match a schema in "anyOf"`
export const _const = `must be equal to constant`
export const contains = `must contain a valid item`
export const dependencies = (params) => `must have ${__select(
    params?.depsCount,
    {
      'one': `property`
    },
    `properties`
  )} ${__formatVariable(params?.deps)} when property ${__formatVariable(params?.property)} is present`
export const dependentRequired = (params) => `${dependencies(params)}`
export const _enum = `must be equal to one of the allowed values`
export const falseSchema = `boolean schema is false`
export const format = (params) => `must match format "${__formatVariable(params?.format)}"`
export const formatMaximum = (params) => `${comparisonLimit(params)}`
export const formatExclusiveMaximum = (params) => `${comparisonLimit(params)}`
export const formatMinimum = (params) => `${comparisonLimit(params)}`
export const formatExclusiveMinimum = (params) => `${comparisonLimit(params)}`
export const _if = (params) => `must match "${__formatVariable(params?.failingKeyword)}" schema`
export const maximum = (params) => `${comparisonLimit(params)}`
export const exclusiveMaximum = (params) => `${maximum(params)}`
export const maxItems = (params) => `must not have more than ${__formatVariable(params?.limit)} ${__select(
    params?.limit,
    {
      'one': `item`
    },
    `items`
  )}`
export const maxLength = (params) => `must not be longer than ${__formatVariable(params?.limit)} ${__select(
    params?.limit,
    {
      'one': `character`
    },
    `characters`
  )}`
export const maxProperties = (params) => `must not have more than ${__formatVariable(params?.limit)} ${__select(
    params?.limit,
    {
      'one': `property`
    },
    `properties`
  )}`
export const minimum = (params) => `${comparisonLimit(params)}`
export const exclusiveMinimum = (params) => `${minimum(params)}`
export const minItems = (params) => `must not have less than ${__formatVariable(params?.limit)} ${__select(
    params?.limit,
    {
      'one': `item`
    },
    `items`
  )}`
export const minLength = (params) => `must not be shorter than ${__formatVariable(params?.limit)} ${__select(
    params?.limit,
    {
      'one': `character`
    },
    `characters`
  )}`
export const minProperties = (params) => `must not have less than ${__formatVariable(params?.limit)} ${__select(
    params?.limit,
    {
      'one': `property`
    },
    `properties`
  )}`
export const multipleOf = (params) => `must be a multiple of ${__formatVariable(params?.multipleOf)}`
export const not = `must not be valid according to schema in "not"`
export const oneOf = `must match exactly one schema in "oneOf"`
export const pattern = (params) => `must match pattern "${__formatVariable(params?.pattern)}"`
export const patternRequired = (params) => `must have property matching pattern "${__formatVariable(params?.missingPattern)}"`
export const propertyNames = `property name is invalid`
export const required = (params) => `must have required property ${__formatVariable(params?.missingProperty)}`
export const type = (params) => `must be ${__formatVariable(params?.type)}${__select(
    params?.nullable,
    {
      'true': `/null`
    },
    `${""}`
  )}`
export const unevaluatedItems = (params) => `must not have more than ${__formatVariable(params?.len)} ${__select(
    params?.len,
    {
      'one': `item`
    },
    `items`
  )}`
export const unevaluatedProperties = `must not have unevaluated properties`
export const uniqueItems = (params) => `must not have duplicate items (items ## ${__formatVariable(params?.j)} and ${__formatVariable(params?.i)} are identical)`
export const errorCsvInjection = `Invalid starting character. \`=\`, \`+\`, \`-\`, \`@\`, \`[space]\`, \`[tab]\`, \`[carriage return]\` are not valid characters for the beginning of text columns`
export const errorActivityTypeResultAnalyticalMethod = `Requires LaboratoryName and ResultAnalyticalMethod columns when ActivityType starts with 'Sample'`
export const errorCharacteristicNameMethodSpeciation = `MethodSpeciation required for selected CharacteristicName`
export const errorCharacteristicNameNutrientResultSampleFraction = `ResultSampleFractions for nutrients should follow guidance in Best Practices Guide for Nutrient Data (see resources page or contact us)`
export const errorCharacteristicNameResultSampleFraction = `ResultSampleFraction required for selected CharacteristicName`
export const errorResultDetectionConditionResultDetectionQuantitationLimitAboveBelow = `ResultDetectionQuantitationLimit fields are required when ResultDetectionCondition is above or below Detection/Quantification limits`
export const errorResultDetectionConditionResultDetectionQuantitationLimitNotDetect = `When ResultDetectionCondition is set to 'Not Detected' or 'Detected Not Quantified' the ResultDetectionQuantitationLimit fields should not be populated`
export const errorResultDetectionConditionResultValue = `Only one of ResultValue or ResultDetectionCondition should be populated`
export const errorResultDetectionQuantitationLimitUnitSalinity = `ResultDetectionQuantitationLimitUnit for CharacteristicName Salinity should be ppth (parts per thousand), ppm (parts per million) or PSU (practical salinity unit)`
export const errorResultUnitSalinity = `ResultUnit for CharacteristicName Salinity should be ppth (parts per thousand), ppm (parts per million) or PSU (practical salinity unit)`
export const qcActivityTypeResultSampleFraction = (params) => `ResultSampleFraction may not be relevant for selected ActivityType ${__formatVariable(params?.ActivityType)} ${__formatVariable(params?.ResultSampleFraction)}`
export const qcWhiteSpace = `Leading or trailing white space detected in character string`
export const qcResultDetectionQuantitationLimitMinimumMeasureMinimum = `ResultDetectionQuantitationLimitMeasure should not be below zero for the selected ResultDetectionQuantitationLimitUnit`
export const qcResultDetectionQuantitationLimitUnitNone = `The unit for the CharacteristicName should be None`
export const qcResultDetectionQuantitationLimitUnitNoValue = `ResultDetectionQuantitationLimitUnit is not needed when ResultDetectionQuantitationLimitMeasure is not populated`
export const qcResultUnitElevation = `The unit for the CharacteristicName should be an elevation. ** TODO: MASL not a unit, needs to be added to QC rule lists`
export const qcResultUnitPercent = `The unit for the CharacteristicName is typically expressed as a %`
export const qcResultUnitNone = `The unit for the CharacteristicName should be None`
export const qcResultUnitNoValue = `ResultUnit is not needed when ResultValue is not populated`
export const qcResultValueDepthMaximum = `Depth is outside an expected range (<0).`
export const qcResultValueDissolvedOxygenUnit = `The unit for Dissolved oxygen (DO) should not be %`
export const qcResultValueDoSaturationMinimum = `The selected CharacteristicName should not have a measure below zero`
export const qcResultValueMinimum = `ResultValue should not be below zero for the selected ResultUnit`
export const qcResultValuePHRange = `pH ResultValue is outside the accepted allowed range (0 to 14)`
export const qcResultValueTemperatureRange = `Temperature is outside an expected range (-100 to 100).`
export const qcDuplicateLocations = `__`
const __exports = {
  items,
  additionalItems,
  additionalProperties,
  anyOf,
  'const': _const,
  contains,
  dependencies,
  dependentRequired,
  'enum': _enum,
  falseSchema,
  format,
  formatMaximum,
  formatExclusiveMaximum,
  formatMinimum,
  formatExclusiveMinimum,
  'if': _if,
  maximum,
  exclusiveMaximum,
  maxItems,
  maxLength,
  maxProperties,
  minimum,
  exclusiveMinimum,
  minItems,
  minLength,
  minProperties,
  multipleOf,
  not,
  oneOf,
  pattern,
  patternRequired,
  propertyNames,
  required,
  type,
  unevaluatedItems,
  unevaluatedProperties,
  uniqueItems,
  'error-CSVInjection': errorCsvInjection,
  'error-ActivityType-ResultAnalyticalMethod': errorActivityTypeResultAnalyticalMethod,
  'error-CharacteristicName-MethodSpeciation': errorCharacteristicNameMethodSpeciation,
  'error-CharacteristicName-Nutrient-ResultSampleFraction': errorCharacteristicNameNutrientResultSampleFraction,
  'error-CharacteristicName-ResultSampleFraction': errorCharacteristicNameResultSampleFraction,
  'error-ResultDetectionCondition-ResultDetectionQuantitationLimit-above-below': errorResultDetectionConditionResultDetectionQuantitationLimitAboveBelow,
  'error-ResultDetectionCondition-ResultDetectionQuantitationLimit-not-detect': errorResultDetectionConditionResultDetectionQuantitationLimitNotDetect,
  'error-ResultDetectionCondition-ResultValue': errorResultDetectionConditionResultValue,
  'error-ResultDetectionQuantitationLimitUnit-Salinity': errorResultDetectionQuantitationLimitUnitSalinity,
  'error-ResultUnit-Salinity': errorResultUnitSalinity,
  'qc-ActivityType-ResultSampleFraction': qcActivityTypeResultSampleFraction,
  'qc-WhiteSpace': qcWhiteSpace,
  'qc-ResultDetectionQuantitationLimitMinimumMeasure-Minimum': qcResultDetectionQuantitationLimitMinimumMeasureMinimum,
  'qc-ResultDetectionQuantitationLimitUnit-None': qcResultDetectionQuantitationLimitUnitNone,
  'qc-ResultDetectionQuantitationLimitUnit-NoValue': qcResultDetectionQuantitationLimitUnitNoValue,
  'qc-ResultUnit-Elevation': qcResultUnitElevation,
  'qc-ResultUnit-Percent': qcResultUnitPercent,
  'qc-ResultUnit-None': qcResultUnitNone,
  'qc-ResultUnit-NoValue': qcResultUnitNoValue,
  'qc-ResultValue-Depth-Maximum': qcResultValueDepthMaximum,
  'qc-ResultValue-DissolvedOxygen-Unit': qcResultValueDissolvedOxygenUnit,
  'qc-ResultValue-DOSaturation-Minimum': qcResultValueDoSaturationMinimum,
  'qc-ResultValue-Minimum': qcResultValueMinimum,
  'qc-ResultValue-pH-Range': qcResultValuePHRange,
  'qc-ResultValue-Temperature-Range': qcResultValueTemperatureRange,
  'qc-duplicate-locations': qcDuplicateLocations
}
export default (errors) => {
  if (!errors?.length) return
  for (const e of errors) {
    let { keyword } = e
    if (keyword === 'false schema') keyword = 'falseSchema'
    let source = __exports[keyword] ?? __exports['_'+keyword]
    let values = {}
    if (keyword === 'errorMessage') {
      const [message, ...valuesPairs] = e.message.split(', ')
      valuesPairs.forEach(pair => {
        const [key, value] = pair.split(':')
        values[key] = value.replace(regExpJsonPointerQuote, '')
      })
      source ??= __exports[message] ?? __exports['_'+message] ?? e.message
    } else {
      source ??= __exports.defaultMessage
    }
    if (typeof source === 'function') {
      e.message = source({keyword:e.keyword, ...e.params, ...values})
    } else {
      e.message = source
    }
  }
}
const regExpJsonPointerQuote = /(^"|"$)/g
