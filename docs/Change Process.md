# Change Process

## Remove Column
- Can this be inferred by another column?

## Add new column
- Does is add necessary information?
- What conditions need to be applied to it?
- Is the default value safe to use with existing data?

## Remove allowed value
- Search existing data to see if currently used.
- If No, it can be safely removed without issues.
- If Yes, 
  - How many organizations are using it? 
  - Are they using it correctly? If not, reach out to correct data.

## Add new allowed value
Safe to do in all cases as long as teh new value has been well thought out and the reason why it is being added is documented.

## Checklist
- New column
  - Add to import records table
  - Add to normalized table w/ ukey
  - Add to ukey in records
  - Add to public API SQL
  - Add to dataset container SQL
  - Build migrations script
  - Re-build all latest datasets
- UI
  - Update `v2` app dependencies
  - Update/Check `v2` links to templates
  - Upload template files to s3
  - Update prismic link on resource page (en,fr)
- Infra
  - Update `schema` version in `normalize` package
  - Update `normalize` version in `import` container
  - Update `schema` version in `dataset` container
  - Update `schema` version in `schema` lambda
  - Update `schema` version in `etl` Dockerfile. Re-run all on QA
  - `tf apply`
  - Re-import allowed values into DB `wqx` schema
  - Check maxlength limits in DB
- update links in README
