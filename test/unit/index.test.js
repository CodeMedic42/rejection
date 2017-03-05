/* global it, describe */

import Chai from 'chai';
import DirtyChai from 'dirty-chai';
import RejectionJS from '../../src/index';
import Rejection from '../../src/models/rejection';
import HttpRejection from '../../src/models/http-rejection';
import ConsoleFormatter from '../../src/formatters/console-formatter';

Chai.use(DirtyChai);

const expect = Chai.expect;

describe('HttpRejection Tests', () => {
    it('Has correct items', () => {
        expect(RejectionJS).to.exist();
        expect(RejectionJS.Rejection).to.equal(Rejection);
        expect(RejectionJS.HttpRejection).to.equal(HttpRejection);
        expect(RejectionJS.ConsoleFormatter).to.equal(ConsoleFormatter);
    });
});
