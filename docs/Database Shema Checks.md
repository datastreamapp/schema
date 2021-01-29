# Database Schema Checks

## v2.0
All SQL should return `0`.

```sql
-- Required: MonitoringLocationID 
-- 638148 on 2020-05-14
SELECT count(*) FROM "datastream"."observations" WHERE monitoring_location_id IS NULL;
```

```sql
-- Required: ResultValue or ResultDetectionCondition 
-- 0 on 2020-05-14
SELECT count(*) FROM "datastream"."observations" WHERE (result_value IS NULL AND result_detection_condition IS NULL) OR (result_value IS NOT NULL AND result_detection_condition IS NOT NULL);
```

```sql
-- Required: MethodSpeciation
-- 0 on 2020-05-14
SELECT count(*) FROM "datastream"."observations" WHERE characteristic_name in ( 'Ammonia',
          'Ammonia and ammonium',
          'Ammonia-nitrogen',
          'Ammonium',
          'Ammonium nitrate',
          'Calcium',
          'Inorganic nitrogen (ammonia, nitrate and nitrite)',
          'Inorganic nitrogen (nitrate and nitrite)',
          'Inorganic nitrogen (NO2, NO3, & NH3)',
          'Kjeldahl nitrogen',
          'Magnesium',
          'Nitrate',
          'Nitrate + Nitrite',
          'Nitrite',
          'Nitrogen',
          'Nitrogen, mixed forms (NH3), (NH4), organic, (NO2) and (NO3)',
          'Nutrient-nitrogen',
          'Organic Nitrogen',
          'Organic phosphorus',
          'Orthophosphate',
          'Phosphate-phosphorus',
          'Phosphorus',
          'Phosphorus, hydrolyzable',
          'Phosphorus, Particulate Organic',
          'Polyphosphate',
          'Radium',
          'Soluble Reactive Phosphorus (SRP)',
          'Total Kjeldahl nitrogen',
          'Total Kjeldahl nitrogen (Organic N & NH3)',
          'Total Nitrogen, mixed forms',
          'Total Nitrogen, mixed forms (NH3), (NH4), organic, (NO2) and (NO3)',
          'Total Particulate Phosphorus',
          'Total Phosphorus, mixed forms') AND method_speciation IS NULL;
-- Pass if returns `0`
```

```sql
-- Required: ResultSampleFraction
-- 
SELECT count(*) FROM "datastream"."observations" WHERE characteristic_name in ( '(+)-cis-Permethrin',
         ...
          'Zirconium/Niobium-95'
AND sample_fraction IS NULL;
```

```sql
-- Required: ResultDetectionQuantitationLimit
-- 453 on 2020-05-14
SELECT count(*) FROM "datastream"."observations" WHERE result_detection_condition in ( 
  'Not Detected',
          'Present Above Quantification Limit',
          'Present Below Quantification Limit',
          'Above Detection/Quantification Limit',
          'Below Detection/Quantification Limit') AND (result_detection_quantitation_limit_type IS NULL OR result_detection_quantitation_limit_measure IS NULL OR result_detection_quantitation_limit_unit IS NULL);
-- Pass if returns `0`
```
