const Chai = require('chai');
const DirtyChai = require('dirty-chai');
const _ = require('lodash');
const HttpRejection = require('../../src/models/httpRejection.js');

Chai.use(DirtyChai);

const expect = Chai.expect;

describe('HttpRejection Tests', function mainTest() {
    it('Construct', () => {
        const httpRej = HttpRejection('testMessage', 'testCode', 'testData', null);

        expect(httpRej.message).to.equal('testMessage');
        expect(httpRej.code).to.equal('testCode');
        expect(httpRej.data).to.equal('testData');
        expect(httpRej.innerRejection).to.be.null();
    });
});
