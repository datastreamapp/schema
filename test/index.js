const expect = require('chai').expect;

//const istanbul = require('istanbul');
const Ajv = require('ajv');
//const ajvIstanbul = require('ajv-istanbul');
const schema = require('../dist/json-schema');

const ajv = new Ajv({
    v5: true,
    format:'full',
    coerceTypes: true,
    allErrors: true,
    useDefaults: true
});
//ajvIstanbul(ajv);
const validate = ajv.compile(schema);

const checkMissingProperty = (errors, keyword, property) => {
    for(let i = errors.length; i--; i) {
        const error = validate.errors[i];
        if (error.keyword !== keyword) continue;
        if (error.params.missingProperty === property) return true;
    }
    return false;
};

describe('DataStream Schema', function () {

    it('Should set defaults', function (done) {
        let data = {};
        const valid = validate(data);
        expect(valid).to.equal(false);

        expect(data.MonitoringLocationHorizontalCoordinateReferenceSystem).to.equal('UNKWN');
        expect(data.ActivityMediaName).to.equal('Surface Water');
        expect(Object.keys(data).length).to.equal(2);

        done();
    });

    it('Should require properties', function (done) {
        const valid = validate({});
        expect(valid).to.equal(false);

        // check required error out
        schema.required.forEach((property) => {
            if (property === 'MonitoringLocationHorizontalCoordinateReferenceSystem') return;
            if (property === 'ActivityMediaName') return;
            expect(checkMissingProperty(validate.errors, 'required', property)).to.equal(true);
        });

        done();
    });

    describe('Should enforce conditional required', function() {
        it('ResultValue & ResultDetectionCondition', function (done) {
            const valid = validate({});
            expect(valid).to.equal(false);
            expect(checkMissingProperty(validate.errors, 'required', 'ResultValue')).to.equal(true);
            expect(checkMissingProperty(validate.errors, 'required', 'ResultDetectionCondition')).to.equal(true);
            done();
        });

        it('ResultValue', function (done) {
            const valid = validate({
                "ResultValue":true
            });
            expect(valid).to.equal(false);
            expect(checkMissingProperty(validate.errors, 'required', 'ResultDetectionCondition')).to.equal(false);
            done();
        });

        it('ResultDetectionCondition', function (done) {
            const valid = validate({
                "ResultDetectionCondition":true
            });
            expect(valid).to.equal(false);
            expect(checkMissingProperty(validate.errors, 'required', 'ResultValue')).to.equal(false);
            done();
        });
    });

    describe('Should require dependencies', function() {
        it('ActivityDepthHeightMeasure', function (done) {
            const valid = validate({
                "ActivityDepthHeightMeasure":true
            });
            expect(valid).to.equal(false);
            expect(checkMissingProperty(validate.errors, 'dependencies', 'ActivityDepthHeightUnit')).to.equal(true);
            done();
        });

        it('ResultValue', function (done) {
            const valid = validate({
                "ResultValue":true
            });
            expect(valid).to.equal(false);
            expect(checkMissingProperty(validate.errors, 'dependencies', 'ResultUnit')).to.equal(true);
            done();
        });

        it('ResultDetectionCondition', function (done) {
            const valid = validate({
                "ResultDetectionCondition":true
            });
            expect(valid).to.equal(false);
            expect(checkMissingProperty(validate.errors, 'dependencies', 'ResultDetectionQuantitationLimitMeasure')).to.equal(true);
            done();
        });

        it('ResultDetectionQuantitationLimitMeasure', function (done) {
            const valid = validate({
                "ResultDetectionQuantitationLimitMeasure":true
            });
            expect(valid).to.equal(false);
            expect(checkMissingProperty(validate.errors, 'dependencies', 'ResultDetectionQuantitationLimitUnit')).to.equal(true);
            expect(checkMissingProperty(validate.errors, 'dependencies', 'ResultDetectionQuantitationLimitType')).to.equal(true);
            done();
        });

        it('ResultAnalyticalMethodID', function (done) {
            const valid = validate({
                "ResultAnalyticalMethodID":true
            });
            expect(valid).to.equal(false);
            expect(checkMissingProperty(validate.errors, 'dependencies', 'ResultAnalyticalMethodContext')).to.equal(true);
            expect(checkMissingProperty(validate.errors, 'dependencies', 'ResultAnalyticalMethodName')).to.equal(true);
            done();
        });
    });

});


// Print out coverage report
// const collector = new istanbul.Collector();
// const reporter = new istanbul.Reporter();
// const sync = true;
//
// collector.add(global.__coverage__);
//
// reporter.add('text');
// reporter.addAll([ 'lcov', 'html' ]);
//
// const oldLog = console.log;
// let logged;
// console.log = (str) => {
//     logged = str;
// };
//
// reporter.write(collector, sync, function () {
//     console.log = oldLog;
//     console.log('Coverage Report');
//     console.log(logged);
// });


