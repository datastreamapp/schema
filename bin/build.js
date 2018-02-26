const util = require('util');
const path = require('path');
const fs = require('fs');

const glob = util.promisify(require('glob'));
const $RefParser = require('json-schema-ref-parser');
const writeFile = util.promisify(fs.writeFile);

console.log('Building JSON Schema & JSON Table Schema & CSV Template');

const srcGlob = __dirname+'/../src/*.json';    // Note files starting w/ `definitions.` will be skipped in code
const csvFile = __dirname+'/../dist/csv/template.csv';
const jsonSchemaDir = __dirname+'/../dist/json-schema';
//const jsonTableSchemaDir = __dirname+'/../dist/json-table-schema';

glob(srcGlob)
    .then((files) => {
        const arr = [];
        files.forEach((filePath) => {
            const parts = path.parse(filePath);
            const file = parts.base;
            if (file.indexOf('definitions.') === 0) { return; }    // skip definitions files

            console.log('Processing:', file);



            const jsonSchemaFile = jsonSchemaDir + '/' + file;
            //const jsonTableSchemaFile = jsonTableSchemaDir +'/' + file;

            const deref = $RefParser.dereference(filePath)
                .then((schemaJSON) => {
                    //console.log(schemaFile, schemaJSON);

                    let csv = `"`+Object.keys(schemaJSON.properties).join(`","`)+`"`+"\r\n";

                    return Promise.all([
                        writeFile(csvFile, csv, {encoding:'utf8'}),
                        writeFile(jsonSchemaFile, JSON.stringify(schemaJSON, null, 2), {encoding:'utf8'}),
                        //writeFile(jsonTableSchemaFile, JSON.stringify(defaultJSON, null, 2), {encoding:'utf8'})
                    ]);
                })
                .catch((err) => {
                    console.error('Error: deref', filePath, err);
                });
            arr.push(deref);
        });
        return Promise.all(arr);
    })
    .then(() => {
        console.log('Done!');
    })
    .catch((err) => {
        console.error('Error: glob', err);
    });

console.log('Copy package.json');
const npm = require(__dirname+'/../package.json');

delete npm.scripts;
delete npm.devDependencies;

fs.writeFileSync(__dirname+'/../dist/package.json', JSON.stringify(npm, null, 2), {encoding:'utf8'});

console.log('Done!');
