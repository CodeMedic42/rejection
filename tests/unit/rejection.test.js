const Chai = require('chai');
const DirtyChai = require('dirty-chai');
const _ = require('lodash');
const Rejection = require('../../src/models/rejection.js');

Chai.use(DirtyChai);

const expect = Chai.expect;

describe('Rejection Tests', function mainTest() {
    it('Construct', () => {
        const httpRej = Rejection('testMessage', 'testData', null);

        expect(httpRej.message).to.equal('testMessage');
        expect(httpRej.data).to.equal('testData');
        expect(httpRej.innerRejection).to.be.null();
    });
});
