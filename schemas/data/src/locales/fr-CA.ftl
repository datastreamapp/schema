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

# errorMessages
error-additional-columns = Le fichier contient des colonnes qui ne sont pas dans le schéma de DataStream ou dans le Modéle de téléversement. Il faut les enlever, ou corriger le nom de la colonne s'il est mal écrit. Voir le Modèle de téléversement pour les colonnes attendues.

## format
error-date-format = Les dates doivent être au format AAAA-MM-JJ (e.g., 2020-09-23). Consultez l'onglet Trucs et astuces du Modèle de téléversement (section Dates et heures) pour des questions relatives au formatage dans Excel ou Google Sheets.
error-time-loose-pattern = Les heures doivent être indiquées au format 24 heures HH:MM:SS (e.g., 14:30:30). Ajoutez un zéro devant les heures inférieures à 10 (e.g., 04:30:30). Consultez l'onglet Trucs et astuces du Modèle de téléversement (section Dates et heures) pour les questions relatives au formatage dans Excel ou Google Sheets.
error-time-strict-pattern = Les heures doivent être indiquées au format 24 heures HH:MM:SS (e.g., 14:30:30). Ajoutez un zéro devant les heures inférieures à 10 (e.g., 04:30:30). Consultez l'onglet Trucs et astuces du Modèle de téléversement (section Dates et heures) pour les questions relatives au formatage dans Excel ou Google Sheets.
error-timezone-loose-pattern = Les fuseaux horaires doivent être indiqués au format décalage UTC (e.g., -06:00). Voir l'onglet « TimeZone LOOKUP » du Modèle de téléversement.
error-timezone-strict-pattern = Les fuseaux horaires doivent être indiqués au format décalage UTC (e.g., -06:00). Voir l'onglet « TimeZone LOOKUP » du Modèle de téléversement.
error-string-pattern = Les valeurs saisies dans ResultComment (commentaire sur le résultat) doivent contenir seulement des lettres, chiffres, ponctuation, symboles et espaces. Supprimez tous les retours à la ligne ou sauts de ligne.
error-string-multiline-pattern = Les valeurs saisies dans ResultComment (commentaire sur le résultat) doivent contenir seulement des lettres, chiffres, ponctuation, symboles, espaces et des retours à la ligne (ou sauts de ligne). Supprimez tout autre caractère.

## errors
error-ActivityType-CTS-ActivityStartTime = ActivityStartTime (heure de début de l'activité) est requis pour les données de séries temporelles continues. Utiliser le format 24 heures HH:MM:SS (e.g., 14:30:00). Ajoutez un zéro devant les heures inférieures à 10 (e.g., 04:30:30).
error-ActivityType-ResultAnalyticalMethod = LaboratoryName (nom du laboratoire) et ResultAnalyticalMethod (méthode analytique du résultat) sont requis car le ActivityType (type d'activité) saisi contient la valeur « Sample » (échantillon), qui désigne des données relatives à des échantillons de laboratoire. Consultez le guide de DataStream sur comment entrer les méthodes d’analyse: hhttps://datastream.org/fr-ca/documentation/entrer-les-methodes-d-analyse. Si le résultat correspond en réalité à une mesure prise sur le terrain, remplacez ActivityType par la valeur appropriée commancant par « Field Msr/Obs » figurant dans la liste des valeurs autorisées du Modèle de téléversement (voir l’onglet Glossaire pour les descriptions).
error-CharacteristicName-Depth-ActivityDepthHeightMeasure = ActivityDepthHeightMeasure (mesure de la hauteur de la profondeur de l'activité) doit être vide lorsque CharacteristicName (nom de la caractéristique) and ResutValue (valeur du résultat) mesurent la profondeur.
error-CharacteristicName-MethodSpeciation = MethodSpeciation (méthode de spéciation) est requis pour ce CharacteristicName (nom de la caractéristique). Consultez les guides de DataStream concernant les données sur les nutriments ou les isotopes : https://datastream.org/fr-ca/documentation/guide-des-donnees-sur-les-nutriments ; https://datastream.org/fr-ca/documentation/guide-des-donnees-isotopiques
error-CharacteristicName-Nutrient-ResultSampleFraction = ResultSampleFraction (fraction d'échantillon du résultat) est manquante ou n'est pas valide pour ce CharacteristicName (nom de la caractéristique) de nutriment. Consultez le guide de DataStream sur les données relatives aux nutriments : https://datastream.org/fr-ca/documentation/guide-des-donnees-sur-les-nutriments
error-CharacteristicName-ResultSampleFraction = ResultSampleFraction (fraction d'échantillon du résultat) est requis pour ce CharacteristicName (nom de la caractéristique). Saisissez une valeur figurant dans l'onglet Valeurs autorisées du Modèle de téléversement (voir l'onglet Glossaire pour les descriptions). Pour obtenir de l'aide sur le choix de la valeur appropriée pour ResultSampleFraction, consultez le guide de DataStream concernant les données sur les nutriments, les métaux ou les isotopes : E.g., https://datastream.org/fr-ca/documentation/guide-des-donnees-sur-les-nutriments
error-CharacteristicName-StableIsotope-MethodSpeciation = MethodSpeciation (méthode de spéciation) est manquant ou n'est pas valide pour ce CharacteristicName (nom de la caractéristique) d'isotope. Consultez le guide de DataStream concernant les données isotopiques : https://datastream.org/fr-ca/documentation/guide-des-donnees-isotopiques
error-CSVInjection = La valeur saisie dans ce champ commence par un caractère non valide (e.g.:  `=`,`+`, `-`, `@`,  [tabulation], [retour à la ligne]). Supprimez ce caractère au début de la valeur saisie.
error-ResultDetectionCondition-ResultDetectionQuantitationLimit-above-below = ResultDetectionQuantitationLimitMeasure (mesure de la limite de détection/quantitation du résultat) et ResultDetectionQuantitationLimitUnit (unité de la limite de détection/quantitation du résultat) sont requis lorsque ResultDetectionCondition (condition de détection du résultat) indique un résultat au-dessus ou en dessous de la limite de détection.
error-ResultDetectionCondition-ResultDetectionQuantitationLimit-not-detect = ResultDetectionQuantitationLimitMeasure (mesure de la limite de détection/quantitation du résultat) et ResultDetectionQuantitationLimitUnit (unité de la limite de détection/quantitation du résultat) doivent rester vides lorsque ResultDetectionCondition (condition de détection du résultat) prend la valeur « Not Detected » (Non détecté) ou « Detected Not Quantified » (Détecté mais non quantifié). Voir l'onglet Glossaire du Modèle de téléversement pour obtenir la description des valeurs autorisées pour ResultDetectionCondition.
error-ResultDetectionCondition-ResultValue = Pour chaque résultat, il faut indiquer une valeur soit dans ResultValue (valeur du résultat), soit dans ResultDetectionCondition (condition de détection du résultat), mais pas les deux. Si le résultat correspond à une valeur numérique précise, saisissez la valeur dans ResultValue et laissez ResultDetectionCondition vide. Si le résultat n'a pas été détecté, n'a pas été quantifié ou se situe au-dessus ou en dessous d'une limite de détection, saisissez une valeur pour ResultDetectionCondition issue de la liste des valeurs autorisées figurant dans le Modèle de téléversement, et laissez ResultValue vide.
error-ResultDetectionQuantitationLimitUnit-Salinity = Le ResultDetectionQuantitationLimitUnit (unité de la limite de détection/quantitation du résultat) pour « Salinity » (salinité) doit être ppth (parties par million), ppm (parties par mille), PSU (unité pratique de salinité), mg/L (milligrammes par litre), or g/L (grammes par litre).
error-ResultUnit-Salinity = Le ResultUnit (unité du résultat) pour « Salinity » (salinité) doit être ppth (parties par million), ppm (parties par mille), PSU (unité pratique de salinité), mg/L (milligrammes par litre), or g/L (grammes par litre).
qc-ColumnCount = Le nombre de colonnes de cette ligne ne correspond pas à celui de la ligne d'en-tête. Vérifiez votre fichier .csv pour vous assurer que toutes les lignes comportent le même nombre de colonnes. Si vous avez créé ou modifié le fichier en dehors d'Excel, vérifiez que les valeurs contenant des virgules sont placées entre guillemets doubles.
qc-RowCount = Aucune ligne de données n'a été trouvée. Un jeu de données doit comporter au moins une ligne de données. Vérifiez que vous avez bien téléversé le bon fichier.

## errors - groundwater
error-ActivityDepthHeightMeasure-ActivityDepthAltitudeReferencePoint = ActivityDepthAltitudeReferencePoint (point de référence de l'altitude de profondeur de l'activité) est requis lorsque ActivityDepthHeightMeasure (mesure de la hauteur de la profondeur de l'activité) est rapporté. Saisissez une valeur figurant dans la liste des valeurs autorisées du Modèle de téléversement des données sur les eaux souterraines (voir l'onglet Glossaire pour les descriptions). Consultez le guide de DataStream sur les données relatives aux eaux souterraines.
error-ActivityMediaName-ActivityDepthHeightMeasure-Maximum = La valeur ActivityDepthHeightMeasure (mesure de la hauteur de la profondeur de l'activité) doit être négative. Saisissez la profondeur sous forme de nombre négatif (e.g., -5.0).
error-ActivityMediaName-Groundwater-DepthMeasure = Au moins un parmi ActivityDepthHeightMeasure (mesure de la hauteur de la profondeur de l'activité), BoreholeDepthMeasure (mesure de la profondeur du forage), WellDepthMeasure (mesure de la profondeur du puits), WellOpenIntervalTopMeasure (mesure du haut de l'intervalle ouvert du puits) ou WellOpenIntervalBottomMeasure (mesure du bas de l'intervalle ouvert du puits) doit être indiqué pour les eaux souterraines ou l'eau interstitielle. Consultez le guide de DataStream concernant les données sur les eaux souterraines.
error-CharacteristicName-WaterLevel-ActivityDepthAltitudeReferencePoint = ActivityDepthAltitudeReferencePoint (point de référence de l'altitude de profondeur de l'activité) est requis pour ce CharacteristicName (nom de la caractéristique) (« Water level in well, depth from a reference point », Niveau d'eau dans le puits, profondeur depuis un point de référence). Saisissez une valeur figurant dans la liste des valeurs autorisées du Modèle de téléversement des données sur les eaux souterraines.
error-GroundwaterFields-ActivityMediaName-Groundwater = ActivityMediaName (nom du milieu de l'activité) doit prendre la valeur « Groundwater » (eau souterraine) ou « Porewater » (eau interstitielle) lorsqu'un champ du schéma relatif aux eaux souterraines est déclaré. Vérifiez que vous utilisez le Modèle de téléversement adapté à votre type de données.
error-MonitoringLocationType-Well-SampleCondition = SampleCondition (condition de l'échantillon) est requis lorsque MonitoringLocationType (type de site de surveillance) correspond à un puits ou à un piézomètre. Consultez le guide de DataStream concernant les données sur les eaux souterraines.
error-MonitoringLocationType-Well-WellUseType = WellUseType (type d'usage du puits) est requis lorsque MonitoringLocationType (type de site de surveillance) est un puits ou un piézomètre. Entrez une valeur de la liste des valeurs autorisées dans le Modèle de téléversement pour les eaux souterraines (voir l'onglet Glossaire pour les descriptions).

## quality-control
# qc-CharacteristicName-Deprecated = 
# qc-MonitoringLocationType-ActivityDepthHeightMeasure-Minimum = La profondeur ne doit pas dépasser la profondeur maximale associée au type de site sélectionné (-65 m dans les rivières et -615 m dans les lacs au Canada).
# qc-ResultUnit-Elevation =
qc-ActivityMediaName-ActivityDepthHeightMeasure-Maximum = ActivityDepthHeightMeasure (mesure de la hauteur de la profondeur de l'activité) doit être une valeur négative. Saisissez la profondeur sous forme de nombre négatif (e.g., -5,0).
qc-ActivityType-CTS-ActivityStartTimeZone = ActivityStartTimeZone (fuseau horaire de l'heure de début de l'activité) doit être inclus pour les données de séries temporelles continues. Consultez le guide de DataStream des données sur les nutriments: https://datastream.org/fr-ca/documentation/guide-des-donnees-sur-les-nutriments
qc-ActivityType-CTS-ActivityStartTimeZone-UTC = Le fuseau horaire « +00:00 » (UTC/GMT) de l'ActivityStartTimeZone (fuseau horaire de l'heure de début de l'activité) ne correspond pas à l'Amérique du Nord. Convertissez-le dans le fuseau horaire local (voir l'onglet « TimeZone LOOKUP » dans le Modèle de téléversement), ou ajoutez une note dans les métadonnées de votre jeu de données pour indiquer que celles-ci sont exprimées en UTC/GMT.
qc-ActivityType-ResultSampleFraction = ResultSampleFraction (fraction d'échantillon du résultat) ne doit pas être inclus pour les mesures prises sur le terrain, et n'est pas recommandé pour ce CharacteristicName (nom de la caractéristique). Supprimez la valeur saisie dans ResultSampleFraction afin que ce résultat soit plus facilement comparable avec les autres données.
qc-AnalysisStartTime-AnalysisStartTimeZone = AnalysisStartTimeZone (fuseau horaire de l'heure de début de l'analyse) doit être inclus lorsqu'une valeur est fournie pour AnalysisStartTime (heure de début de l'analyse). Saisissez-le au format décalage horaire par rapport à l'UTC (e.g., -06:00). Voir l'onglet TimeZone LOOKUP du Modèle de téléversement.
qc-CharacteristicName-ActivityMediaName-AmbientAir = ActivityMediaName (nom du milieu de l'activité) doit être « Ambient Air » (air ambiant) pour cette caractéristique, car elle mesure des conditions atmosphériques (e.g., la température de l'air, la pression barométrique) plutôt que des caractéristiques liés à l'eau. Remplacez la valeur de ActivityMediaName par celle-ci.
qc-CharacteristicName-ActivityType-Surrogate = Un résultat exprimé en pourcentage pour cette caractéristique correspond généralement au pourcentage de récupération d'un étalon de substitution, qui s'agit d'un test de contrôle qualité de la méthode d'analyse du laboratoire plutôt que d'une mesure réelle de la qualité de l'eau. Si ce résultat concerne un étalon de substitution, remplacer la valeur de ActivityType (type d'activité) par « Quality Control Sample-Lab Surrogate Control Standard ».
qc-CharacteristicName-Ammonia = CharacteristicName (nom de la caractéristique) « Ammonia » (ammoniac) n'est plus une valeur autorisée. Si vous déclarez l'ammoniac total, utilisez « Ammonia and ammonium » (ammoniac et ammonium). Si vous déclarez l'azote ammoniacal ou l'ammoniac libre disponible, utilisez « Ammonia, un-ionized » (ammoniac, non-ionisé). Consultez le guide de DataStream concernant les données sur les nutriments : https://datastream.org/fr-ca/documentation/guide-des-donnees-sur-les-nutriments
qc-CharacteristicName-Metal-ResultSampleFraction = La ResultSampleFraction (fraction d'échantillon du résultat) saisie pour cette caractéristique métallique n'est peut-être pas appropriée. Consultez de guide de DataStream concernant les données sur les séries de métaux : https://datastream.org/fr-ca/documentation/guide-des-donnees-sur-les-series-de-metaux
qc-CharacteristicName-MethodSpeciation = MethodSpeciation (méthode de spéciation) n'est pas requis et peut ne pas être pertinente pour cette caractéristique. Si elle n'est pas applicable, supprimez la valeur saisie dans MethodSpeciation afin que ce résultat soit comparable aux autres données relatives à cette caractéristique.
qc-CharacteristicName-pH-ActivityType-Sample = Le ActivityType (type d'activité) comprend la valeur « Sample », qui désigne des données d'échantillons de laboratoire ; le CharacteristicName (nom de la caractéristique) doit donc être « pH, lab ». Si ce résultat de pH a été mesuré par un laboratoire, remplacez le CharacteristicName par « pH, lab ». S'il s'agit d'une mesure sur le terrain, remplacez le ActivityType par la valeur appropriée commençant par « Field Msr/Obs » figurant dans la liste des valeurs autorisées du Modèle de téléversement (voir l'onglet Glossaire pour les descriptions).
qc-CharacteristicName-pH-ResultDetectionQuantitationLimitUnit-None = L'unité pour cette caractéristique doit être saisie avec la valeur « None » (aucun). Mettre à jour le ResultDetectionQuantitationLimitUnit (unité de la limite de détection/quantitation du résultat) en lui attribuant la valeur « None ».
qc-CharacteristicName-pH-ResultUnit-None = L'unité pour cette caractéristique doit être saisie avec la valeur « None » (aucun). Mettre à jour le ResultUnit (unité du résultat) en lui attribuant la valeur « None ».
qc-CharacteristicName-Ratio-ResultDetectionQuantitationLimitUnit-None = L'unité pour cette caractéristique doit être saisie avec la valeur « None » (aucun). Mettre à jour le ResultDetectionQuantitationLimitUnit (unité de la limite de détection/quantitation du résultat) en lui attribuant la valeur « None ».
qc-CharacteristicName-Ratio-ResultUnit-None = L'unité pour cette caractéristique doit être saisie avec la valeur « None » (aucun). Mettre à jour le ResultUnit (unité du résultat) en lui attribuant la valeur « None ».
qc-CharacteristicName-ResultAnalyticalMethodName = ResultAnalyticalMethodName (nom de la méthode analytique du résultat) est requis pour les résultat sur la couverture de glace. Utilisez ce champ pour décrire comment sont définis les évènements de gel et/ou dégel (e.g. l'évènement de gel est défini comme étant la première journée avec 100% de couverture de glace).
qc-MonitoringLocationCoordinate-BoundingBox = Ce site de surveillance se trouve en dehors du Canada et des bassins versants transfrontaliers entre le Canada et les États-Unis. Vérifiez et mettez à jour les coordonnées du site de surveillance. La longitude doit être une valeur négative (e.g., -112,3832).
qc-ResultAnalyticalMethodContext-ActivityType = Ce ResultAnalyticalMethodContext (contexte de la méthode analytique du résultat) s'applique seulement aux mesures de terrain, mais le ActivityType (type d'activité) saisi inclu « Sample » (échantillon), ce qui indique des données issues d'échantillons de laboratoire. S'il s'agit d'une mesure de terrain, changez le ActivityType pour la valeur incluant « Field Msr/Obs » appropriée de la liste des valeurs autorisées du Modèle de téléversement (voir le Glossaire pour les descriptions). S'il s'agit de données de laboratoire, changez le ResultAnalyticalMethodContext pour la valeur qui reflète les méthodes du laboratoire. Consultez le guide de DataStream sur comment entrer les méthodes analytiques: https://datastream.org/fr-ca/documentation/entrer-les-methodes-d-analyse
qc-ResultDetectionQuantitationLimitMinimumMeasure-Minimum = ResultDetectionQuantitationLimitMeasure (mesure de la limite de détection/quantitation du résultat) ne devrait pas être en dessous de zero pour la valeur de ResultDetectionQuantitationLimitUnit (unité de la limite de détection/quantitation du résultat) saisie. Vériviez vos données sources ou le rapport de laboratoire pour confirmer la mesure et l'unité.
qc-ResultDetectionQuantitationLimitUnit-NoValue = Le champ ResultDetectionQuantitationLimitUnit (unité de la limite de détection/quantitation du résultat) doit être laissé vide lorsque le champ ResultDetectionQuantitationLimitMeasure (mesure de la limite de détection/quantitation du résultat) est vide. Supprimez l'unité ou saisissez la mesure.
qc-ResultDetectionQuantitationLimitUnit-Turbidity = L'unité entrée dans ResultDetectionQuantitationLimitUnit (unité de la limite de détection/quantitation du résultat) est spécifique à la turbidité, mais le CharacteristicName (nom de la caractéristique) n'est pas « Turbidity » (turbidité). Vérifiez l'unité dans vos données sources et modifiez ce champ ou, s'il s'agit d'un résultat de turbidité, modifiez le champ CharacteristicName.
qc-ResultSampleFraction-ActivityMediaName-Sediment = Le ResultSampleFraction (fraction d'échantillon du résultat) ne s'applique qu'aux résultats obtenus à l'aide d'une extraction séquentielle pour la mesure des métaux. Si vos données proviennent de ce type d'analyse effectuée sur la fraction particulaire d'un échantillon d'eau, utilisez la valeur « Suspended » dans le champ ResultSampleFraction et indiquez le terme de l'extraction séquentielle dans le champ ResultComment (commentaire sur le résultat). Consultez les recommandations de DataStream concernant les données sur les séries de métaux: https://datastream.org/fr-ca/documentation/guide-des-donnees-sur-les-series-de-metaux
qc-ResultSampleFraction-FreeAvailable = ResultSampleFraction (fraction d'échantillon du résultat) « Free available » (libre disponible) n'est pas approprié pour ce CharacteristicName (nom de la caractéristique). Saisissez une autre valeur de ResultSampleFraction figurant dans la liste des valeurs autorisées dans le Modèle de téléversement (voir l'onglet Glossaire pour les descriptions). Pour de l'aide avec la selection de la fraction d'échantillon appropriée pour les données sur les nutriments, séries de métaux ou isotopes, voir les guides DataStream pertinents: E.g., https://datastream.org/fr-ca/documentation/guide-des-donnees-sur-les-nutriments
qc-ResultStatusID-Deprecated = Les valeurs « Final » et « Accepted » (accepté) ne sont plus des valeurs autorisées pour ResultStatusID (identifiant du statut du résultat). Utilisez « Preliminary » (préliminaire), « Provisional » (provisoire), ou « Validated » (validé). Voir l'onglet Glossaire du Modèle de téléversement pour les descriptions de ces valeurs de ResultStatusID.
qc-ResultUnit-NoValue = ResultUnit (unité du résultat) devrait être vide lorsque ResultValue (valeur du résultat) est vide. Enlevez la valeur saisie pour ResultUnit, ou saisissez le ResultValue.
qc-ResultUnit-Percent = Ce CharacteristicName (nom de la caractéristique) est typiquement mesurée en pourcentage. Vérifiez l'unité dans vos données sources. Si le résultat est un pourcentage, changez le ResultUnit pour « % ».
qc-ResultUnit-Turbidity = Le ResultUnit (unité du résultat) est spécifique à la turbidité, mais le CharacteristicName (nom de la caractéristique) n'est pas « Turbidity » (turbidité). Vérifiez vos données sources. S'il ne s'agit pas d'un résultat de turbidité, changez la valeur de CharacteristicName pour « Turbidity ».
qc-ResultValue-DissolvedOxygen-Unit = Le ResultUnit (unité du résultat) « % » suggère qu'il s'agit de la saturation en oxygène dissous, plutôt qu'une concentration. Si c'est le cas, changez le CharacteristicName (nom de la caractéristique) pour « Dissolved oxygen saturation ». Si le résultat est une concentration, changez le ResultUnit pour une unité de concentration (e.g. mg/L.)
qc-ResultValue-DOSaturation-Minimum = La caractéristique « Dissolved oxygen saturation » (saturation en oxygène dissous) ne doit pas avoir un ResultValue (valeur du résultat) en dessous de zero. Vérifiez vos données sources pour des erreurs de signe ou des caractères de remplissage pour données manquantes.
qc-ResultValue-DOY-Range = Le ResultValue (valeur du résultat) pour « DOY (day of year) » (jour de l'année) doit être comprise entre 1 et 366 (366 uniquement pour les années bissextiles).
qc-ResultValue-Minimum = Le ResultValue (valeur du résultat) ne devrait pas être en dessous de zero. Vérifiez vos données sources pour des erreurs de signe ou des caractères de remplissage pour données manquantes.
qc-ResultValue-pH-Range = Le ResultValue (valeur du résultat) pour le pH en en-dehors de la plage attendue de 0 à 14. Vérifiez vos données sources et mettez à jour les valeurs erronées, ou utilisez le champ ResultComment (commentaire sur le résultat) pour fournir un contexte supplémentaire.
qc-ResultValue-Temperature-Range = La ResultValue (valeur du résultat) de la température se situe en dehors de la plage attendue, comprise entre -100 et 100 degrés Celsius. Vérifiez vos données sources et mettez à jour les valeurs erronées, ou utilisez le champ ResultComment (commentaire sur le résultat) pour fournir un contexte supplémentaire.
qc-WhiteSpace = La valeur saisie dans ce champ commence ou termine par un espace. Supprimez les espaces en début ou en fin de cette valeur.

## quality-control (code)
qc-ActivityEndDate-Future = {qc-Date-Future}
qc-ActivityStartDate-Future = {qc-Date-Future}
qc-ActivityTypeContinuous = Lorsque des observations du même type sont effectuées à une fréquence d'au moins une fois par heure, le ActivityType (type d'activité) doit être « Field Msr/Obs-Continuous Time Series ». Consultez le guide de DataStream concernant les données de séries temporelles continues : https://datastream.org/fr-ca/documentation/guide-sur-les-donnees-de-series-temporelles-continues
qc-AnalysisStartDate-Future = {qc-Date-Future}
qc-DatasetName = La valeur saisie dans la colonne DatasetName (nom du jeu de données) de ce fichier est différent du nom dans vos métadonnées du jeu de données. Le nom dans vos métadonnées est le nom officiel de votre jeu de données à travers DataStream. Nous recommandons de les rendre identiques: cela permet aux autres utilisateurs d’identifier plus facilement votre jeu de données et de voir que ce fichier en fait partie. Si vous téléversez le fichier tel quel, vos données publiées utiliseront le nom officiel. Votre fichier d’origine reste inchangé et accessible au public dans le journal des modifications du jeu de données.
qc-Date-Future = La date saisie pour ce résultat se situe dans le futur. Veuillez mettre à jour les champs « ActivityStartDate » (date de début de l'activité), « ActivityEndDate » (date de fin de l'activité) ou « AnalysisStartDate » (date de début de l'analysis) concernés.
qc-MonitoringLocationCoordinate-Duplicate = Ce MonitoringLocationID (identifiant de site de surveillance) est associé à plusieurs paires de coordonnées (latitude et longitude). Chaque MonitoringLocationID doit représenter un site de surveillance, donc choisissez une seule paire de coordonnées qui représente le mieux le site et utilisez-le pour tous les résultats relatifs à ce site. Sinon, ceux-ci apparaîtront comme des emplacements distincts dans DataStream. S'il s'agit effectivement de sites de surveillance différents, saisissez un MonitoringLocationID unique pour chacun d'entre eux.
qc-MonitoringLocationHorizontalCoordinateReferenceSystem-Duplicate = Ce MonitoringLocationID (identifiant de site de surveillance) est associé à plusieurs systèmes de référence de coordonnées. Si un système de référence a été saisi de manière erronée, mettez-le à jour afin que chaque identifiant n'en utilise qu'un seul; sinon, ils apparaîtront comme des emplacements distincts dans DataStream. S'il s'agit effectivement de sites de surveillance différents, saisissez un MonitoringLocationID unique pour chacun d'entre eux.
qc-MonitoringLocationName-Duplicate = Ce MonitoringLocationID (identifiant de site de surveillance) est associé à plusieurs MonitoringLocationName (nom du site de surveillance). Si le nom a été saisi de manière incohérente (e.g., en raison d'une différence d'orthographe, d'espacement ou de majuscule), mettez-le à jour afin que chaque identifiant ne soit associé qu'à un seul nom ; sinon, ces sites apparaîtront comme des emplacements distincts dans DataStream. S'il s'agit effectivement de sites de surveillance différents, saisissez un MonitoringLocationID unique pour chacun d'entre eux.
qc-MonitoringLocationType-Duplicate = Ce MonitoringLocationID (identifiant de site de surveillance) est associé à plusieurs MonitoringLocationType (type de site de surveillance). Si le type de site a été saisi de manière incohérente, mettez-le à jour afin que chaque identifiant ne soit associé qu'à un seul type; sinon, ces sites apparaîtront comme des emplacements distincts dans DataStream. S'il s'agit effectivement de sites de surveillance différents, saisissez un MonitoringLocationID unique pour chacun d'entre eux.

## errors (code)
error-ActivityMediaName-Groundwater-Mixed = Les données relatives aux eaux souterraines doivent être téléversées dans un jeu de données distinct de celui contenant les données relatives aux eaux de surface. Si la valeur de ActivityMediaName (nom du milieu de l'activité) est « Groundwater » (eau souterraine) ou « Porewater » (eau interstitielle) dans une ligne, le fichier ne doit pas contenir de valeurs correspondant aux eaux de surface dans ActivityMediaName.
error-ActivityType-Continuous-Mixed = Les données de séries temporelles continues doivent être téléversées dans un jeu de données distinct de celui contenant les données discrètes (mesures ponctuelles). Si le ActivityType (type d'activité) « Field Msr/Obs-Continuous Time Series » dans une ligne quelconque, le fichier ne peut pas contenir d'autres valeurs pour ActivityType.
