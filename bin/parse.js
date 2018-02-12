const fs = require('fs');
const convert = require('xml-js');

console.log('Parsing WQX All Domain Values XML ...');

// download and unzip http://cdx.epa.gov/wqx/download/DomainValues/All.zip
// parse xml for allowed values schemas
var xml = require('fs').readFileSync(__dirname+'/All Domain Values.xml', 'utf8');
const values = JSON.parse(convert.xml2json(xml, {compact: true}));
//console.log(JSON.stringify(values.WQXDomainValueList.WQXElement[0].WQXElementRow[0], null, 2));

const test = {};

const jsonSchema = {
    title:'Allowed Values',
    description:'WQX Allowed Values Definitions',
    // Missing from file
    AreaMeasurementUnit: {
        title: 'Area Measurement Unit',
        description: '',
        type: 'string',
        enum: ['cm3','in3','ft3', 'm3']
    },
    DistanceMeasurementUnit: {
        title: 'Distance Measurement Unit',
        description: '',
        type: 'string',
        enum: ['cm','in','ft', 'm', 'km']
    },
    TimeMeasurementUnit: {
        title: 'Time Measurement Unit',
        description: '',
        type: 'string',
        enum: ['seconds','minutes','hours','weeks','months','years']
    },
    SpeedMeasurementUnit: {
        title: 'Speed Measurement Unit',
        description: '',
        type: 'string',
        enum: ['cm/sec','ft/sec','m/sec','km/sec','km/hr']
    },
    MassMeasurementUnit: {
        title: 'Mass Measurement Unit',
        description: '',
        type: 'string',
        enum: ['g','oz','lb','kg']
    }
};
for (let e in values.WQXDomainValueList.WQXElement) {
    const field = values.WQXDomainValueList.WQXElement[e].WQXElementName._text.replace('\n', '').trim();
    const element = values.WQXDomainValueList.WQXElement[e].WQXElementRow;

    jsonSchema[field] = {
        title: field,
        description:'',
        type:'string',
        enum:[]
    };
    for (let r in element) {
        const row = element[r].WQXElementRowColumn;
        const rowObj = {};

        // re-org
        for (let c in row) {
            const col = row[c]._attributes;
            rowObj[col.colname] = col.value;
        }

        //if (field === 'TimeZone' || field === 'County') console.log(rowObj, Object.keys(rowObj));

        let value = '';
        if (Object.keys(rowObj).indexOf('ID') !== -1) {
            value = rowObj['ID'];
        } else if (Object.keys(rowObj).indexOf('Code') !== -1) {
            value = rowObj['Code'];
        } else if (Object.keys(rowObj).indexOf('CountyFIPSCode') !== -1) {
            value = rowObj['CountyName']+', '+rowObj['StateCode'];
        } else {
            value = rowObj['Name'];
        }

        // meta data for docs
        // name = rowObj['Name'].replace(/( ?[A-Z])/g, ' $1');
        // description = rowObj['Description']

        jsonSchema[field].enum.push(value);
    }
}
fs.writeFileSync('./src/definitions.wqx.values.json', JSON.stringify(jsonSchema, null, 2), 'utf8');
console.log('Done!');

//console.log('Parsing WQX All Domain Values XML ...');
//console.log(JSON.stringify(test, null, 2));

// dowload and unzip http://www.exchangenetwork.net/data-exchange/wqx/#
// use xsd2json to make json schema

// const xsd2json = require('xsd2json');
// const filename = 'WQX_Schema_v2.1/index.xsd';
//
// xsd2json(filename)
//     .pipe(process.stdout);

//console.log('Done!');
