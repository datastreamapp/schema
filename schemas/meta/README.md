<h1 align="center">
  <img src="https://raw.githubusercontent.com/gordonfn/schema/main/docs/images/datastream.svg?sanitize=true" alt="DataStream Logo" width="400">
  <br/>
  DataStream Metadata
  <br/>
  <br/>
</h1>


## DataStream

DataStream ([DataStream.org](https://datastream.org)) is an online open-access platform for sharing water quality data. Data is uploaded, stored and shared in DataStream’s Open Data Schema -- a model based on the WQX standard for the Exchange of Water Quality Data. DataStream is free to use and allows users to query, visualize, and download data in this standardized format. 

DataStream was developed by [The Gordon Foundation](https://gordonfoundation.ca) and is carried out in collaboration with regional partners and monitoring networks. Data contributors maintain ownership of their data which are published under open data licences.

## Dataset Metadata (v2)
In addition to the observation-level information in DS-WQX, Datasets published on DataStream are accompanied by comprehensive metadata (information about the dataset). See DataStream's Learning Centre for a summary of [Metadata fields and their descriptions](https://datastream.org/en-ca/documentation/dataset-metadata) .


### Metadata Standards Mapping (v2)
DataStream                    | EPA                        | DataCite                         | W3C DCAT                   | ISO 19115-2
------------------------------|----------------------------|----------------------------------|----------------------------|-------------------------------------------------------------------------------------------------------
Dataset ID                    | (None)                     | id                               | @id                        | fileIdentifier
Dataset Name                  | Title                      | titles                           | name                       | identificationInfo.MD_DataIdentification.citation.CI_Citation.title
Abstract                      | Description                | descriptions (Abstract)          | description                | identificationInfo.MD_DataIdentification.abstract
Citation                      | (None)                     | (None)                           | citation                   | identificationInfo.MD_DataIdentification.citation.identifier.MD_identifier.authority.CI_Citation.title
Data Upload Organization      | Publishing Organization    | creators (Organizational)        | creator.name               | identificationInfo.MD_DataIdentification.citation.CI_Citation.citedResponsibleParty.CI_ResponsibleParty.organisationName (author)
Data Steward Email            | Publisher Email            | (None)                           | creator.contactPoint.email | contact.CI_ResponsibleParty.contactInfo.address.CI_Address.electronicMailAddress (pointOfContact)
Data Collection Organization  | (None)                     | contributors (Organizational)    | author                     | identificationInfo.MD_DataIdentification.citation.CI_Citation.citedResponsibleParty.CI_ResponsibleParty.organisationName (contributor)
Data Collection Information   | (None)                     | descriptions (Methods)           | measurementTechnique       | (None)
Data Processing               | (None)                     | descriptions (Methods)           | (None)                     | (None)
Funding Sources               | (None)                     | (None)                           | (None)                     | (None)
Other Data Sources            | (None)                     | (None)                           | (None)                     | (None)
Topic Category                | Tags (ISO)                 | (None)                           | (None)                     | identificationInfo.MD_DataIdentification.topicCategory.MD_TopicCategoryCode
Keywords                      | Tags (General)             | (None)                           | keywords                   | identificationInfo.MD_DataIdentification.descriptiveKeywords.MD_Keywords.keyword
Licencing & Attribution       | Data License               | (None)                           | license                    | identificationInfo.MD_DataIdentification.resourceConstraints.MD_LegalConstraints.useLimitation
Data Disclaimer               | General Use Limitations    | (None)                           | (None)                     | identificationInfo.MD_DataIdentification.resourceConstraints.MD_LegalConstraints.useLimitation
Date Published                | (None)                     | dates (Submitted)                | datePublished              | identificationInfo.MD_DataIdentification.citation.CI_Citation.date (publication)
Date Modified                 | Last Update                | dates (Update)                   | dateModified               | identificationInfo.MD_DataIdentification.citation.CI_Citation.date (revision)
Version                       | version                    | version                          | (None)                     | (None)
DOI                           | Identifier                 | id                               | identifier                 | identificationInfo.MD_DataIdentification.citation.CI_Citation.identifier.MD_Identifier.code
Spatial Extent                | Spatial Extent             | geoLocations.geoLocationBox      | spatialCoverage.box        | identificationInfo.MD_DataIdentification.extent.EX_Extent.geographicElement.EX_GeographicBoundingBox
Temporal Extent               | Temporal Extent            | dates (Collected)                | temporalCoverage           | identificationInfo.MD_DataIdentification.extent.EX_Extent.temporalElement.EX_TemporalExtent
Vertical Extent               | (None)                     | (None)                           | (None)                     | identificationInfo.MD_DataIdentification.extent.EX_Extent.verticalElement.EX_VerticalExtent
(None)                        | (Unknown)                     | (Unknown)                           | variableMeasured.{propertyID,minValue,maxValue,unitText,unitCode,measurementTechnique} | (Unknown)
URL                           | Distribution URL           | (None)                           | url                        | (None)
Observations                  | (None)                     | (None)                           | (None)                     | (None)
Filesize                      | (None)                     | sizes                            | (None)                     | (None)
Download                      | (None)                     | formats                          | distribution (csv)         | (None)
DataStream                    | (None)                     | publisher                        | publisher                  | (None)

## References
- [ISO 19115-1:2014](https://www.iso.org/standard/53798.html)
- [ISO 19115-2:2019](https://www.iso.org/standard/67039.html)
- [ISO 19115-3:2016](https://www.iso.org/standard/32579.html)
- [ISO 19115-3 Breakdown](https://github.com/icsm-au/metadata-working-group)
- [ISO 19115 Standard Explorer](https://geonetwork-opensource.org/manuals/trunk/eng/users/annexes/standards/iso19115-3.2018.html)
- [ISO 19139 Code List](https://data.noaa.gov/resources/iso19139/schema/resources/Codelist/gmxCodelists.xml#gmd:CI_RoleCode)
- [ISO 19115 Topic categories](https://www.ngdc.noaa.gov/wiki/index.php/ISO_Topic_Categories)
- [EPA Metadata](https://www.epa.gov/geospatial/epa-metadata-technical-specification)
- [DataCite Metadata Schema](https://schema.datacite.org)
- [CodeMeta](https://codemeta.github.io/index.html)
- [CodeMeta Mapping](https://peerj.com/articles/cs-174.pdf)
- [W3C DCAT Spec](https://www.w3.org/TR/vocab-dcat-2)
- [W3C Microdata](https://www.w3.org/TR/microdata/)
- [Google Datasets](https://developers.google.com/search/docs/data-types/dataset)

<div align="center">
  <a href="http://gordonfoundation.ca"><img src="https://raw.githubusercontent.com/gordonfn/metadata/main/docs/images/the-gordon-foundation.svg?sanitize=true" alt="The Gordon Foundation Logo" width="200"></a>
</div>
