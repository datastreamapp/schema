-default-message = doit être valide selon le critère "{$keyword}"
-comparison-limit = doit être {$comparison} {$limit}

items = ne doit pas contenir plus de {$limit} {$limit ->
  [one] élémént
  *[other] éléménts
}
additionalItems = {items}
additionalProperties = ne doit pas contenir de propriétés additionnelles
anyOf = doit correspondre à un schéma de « anyOf »
const = doit être égal à la constante
contains = doit contenir un élément valide
dependencies = doit avoir la propriété {$deps} quand la propriété {$property} est présente
dependentRequired = {dependencies}
enum = doit être égal à une des valeurs prédéfinies
falseSchema = le schema est « false »
format = doit correspondre au format « {$format} »
formatMaximum = {-comparison-limit}
formatExclusiveMaximum = {-comparison-limit}
formatMinimum = {-comparison-limit}
formatExclusiveMinimum = {-comparison-limit}
if = doit correspondre au schéma « {$failingKeyword} »
maximum = {-comparison-limit}
exclusiveMaximum = {-comparison-limit}
maxItems = ne doit pas contenir plus de {$limit} {$limit ->
  [one] élément
  *[other] éléments
}
maxLength = ne doit pas dépasser {$limit} {$limit ->
  [one] caractère
  *[other] caractères
}
maxProperties = ne doit pas contenir plus de {$limit} {$limit ->
  [one] propriété
  *[other] propriétés
}
minimum = {-comparison-limit}
exclusiveMinimum = {-comparison-limit}
minItems = ne doit pas contenir moins de {$limit} {$limit ->
  [one] élément
  *[other] éléments
}
minLength = ne doit pas faire moins de {$limit} {$limit ->
  [one] caractère
  *[other] caractères
}
minProperties = ne doit pas contenir moins de {$limit} {$limit ->
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
type = doit être de type {$type}{$nullable ->
  [true] /null
  *[default] {""}
}
unevaluatedItems = ne doit pas contenir plus de {$len} {$len ->
  [one] élément
  *[other] éléments
}
unevaluatedProperties = ne doit pas avoir de propriété non évaluée « {$unevaluatedProperty} »
uniqueItems = ne doit pas contenir de doublons (les éléments ## {$j} et {$i} sont identiques)

# jtd
discriminator = {$error ->
    [tag] la balise « {$tag} » doit être une chaîne
    [mapping] la valeur de la balise « {$tag} » doit être dans le mappage
    *[default] {type}
  }
# enum = {enum}
properties = {$error ->
    [additional] ne doit pas contenir de propriétés additionnelles
    [missing] requiert la propriété {$missingProperty}
    *[default] {type}
  }
# type = {type}
elements = {type}
values = {type}
union = doit correspondre à un schéma de « union »
