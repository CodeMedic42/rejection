/* global it, describe */

import Chai from 'chai';
import DirtyChai from 'dirty-chai';
import HttpRejection from '../../../src/models/http-rejection';

Chai.use(DirtyChai);

const expect = Chai.expect;

describe('HttpRejection Tests', () => {
    it('Construct with new', () => {
        const httpRej = new HttpRejection('testMessage', 'testCode', 'testData', null);

        expect(httpRej.message).to.equal('testMessage');
        expect(httpRej.code).to.equal('testCode');
        expect(httpRej.data).to.equal('testData');
        expect(httpRej.innerRejection).to.be.null();
    });

    it('Construct', () => {
        const httpRej = HttpRejection('testMessage', 'testCode', 'testData', null);

        expect(httpRej.message).to.equal('testMessage');
        expect(httpRej.code).to.equal('testCode');
        expect(httpRej.data).to.equal('testData');
        expect(httpRej.innerRejection).to.be.null();
    });
});
