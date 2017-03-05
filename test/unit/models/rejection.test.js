/* global it, describe */

import Chai from 'chai';
import DirtyChai from 'dirty-chai';
import Rejection from '../../../src/models/rejection';

Chai.use(DirtyChai);

const expect = Chai.expect;

describe('Rejection Tests', () => {
    it('Construct with no parameters', () => {
        const rej = new Rejection();

        expect(rej.message, 'Message should be null').to.be.null();
        expect(rej.data, 'Data should be null').to.be.null();
        expect(rej.innerRejection, 'InnerRejection should be null').to.be.null();
        expect(rej.stack, 'Stack should be an array').to.be.instanceof(Array);
        expect(rej.stack.length, 'Stack length should be 12').to.equal(12);
    });

    it('Construct with just message as empty string', () => {
        const rej = new Rejection('');

        expect(rej.message, 'Message should be empty').to.equal('');
        expect(rej.data, 'Data should be null').to.be.null();
        expect(rej.innerRejection, 'InnerRejection should be null').to.be.null();
        expect(rej.stack, 'Stack should be an array').to.be.instanceof(Array);
        expect(rej.stack.length, 'Stack length should be 12').to.equal(12);
    });

    it('Construct with just message as "foo"', () => {
        const rej = new Rejection('foo');

        expect(rej.message, 'Message should be "foo"').to.equal('foo');
        expect(rej.data, 'Data should be original').to.be.null();
        expect(rej.innerRejection, 'InnerRejection should be null').to.be.null();
        expect(rej.stack, 'Stack should be an array').to.be.instanceof(Array);
        expect(rej.stack.length, 'Stack length should be 12').to.equal(12);
    });

    it('Construct with just message as an Error', () => {
        const error = new Error('foo');

        error.stack = '   at Context.<anonymous> (C:/Users/cmicle/Desktop/rejection-develop/test/unit/models/rejection.test.js:43:23)\n' +
                      '   at callFn (C:\\Users\\cmicle\\Desktop\\rejection-develop\\node_modules\\mocha\\lib\\runnable.js:345:21)\n' +
                      '   at Test.Runnable.run (C:\\Users\\cmicle\\Desktop\\rejection-develop\\node_modules\\mocha\\lib\\runnable.js:337:7)\n' +
                      '   at Runner.runTest (C:\\Users\\cmicle\\Desktop\\rejection-develop\\node_modules\\mocha\\lib\\runner.js:444:10)\n' +
                      '   at C:\\Users\\cmicle\\Desktop\\rejection-develop\\node_modules\\mocha\\lib\\runner.js:550:12\n' +
                      '   at next (C:\\Users\\cmicle\\Desktop\\rejection-develop\\node_modules\\mocha\\lib\\runner.js:361:14)\n' +
                      '   at C:\\Users\\cmicle\\Desktop\\rejection-develop\\node_modules\\mocha\\lib\\runner.js:371:7\n' +
                      '   at next (C:\\Users\\cmicle\\Desktop\\rejection-develop\\node_modules\\mocha\\lib\\runner.js:295:14)\n' +
                      '   at Immediate.<anonymous> (C:\\Users\\cmicle\\Desktop\\rejection-develop\\node_modules\\mocha\\lib\\runner.js:339:5)\n' +
                      '   at runCallback (timers.js:666:20)';

        const expected = ['at Context.<anonymous> (C:/Users/cmicle/Desktop/rejection-develop/test/unit/models/rejection.test.js:43:23)',
            'at callFn (C:\\Users\\cmicle\\Desktop\\rejection-develop\\node_modules\\mocha\\lib\\runnable.js:345:21)',
            'at Test.Runnable.run (C:\\Users\\cmicle\\Desktop\\rejection-develop\\node_modules\\mocha\\lib\\runnable.js:337:7)',
            'at Runner.runTest (C:\\Users\\cmicle\\Desktop\\rejection-develop\\node_modules\\mocha\\lib\\runner.js:444:10)',
            'at C:\\Users\\cmicle\\Desktop\\rejection-develop\\node_modules\\mocha\\lib\\runner.js:550:12',
            'at next (C:\\Users\\cmicle\\Desktop\\rejection-develop\\node_modules\\mocha\\lib\\runner.js:361:14)',
            'at C:\\Users\\cmicle\\Desktop\\rejection-develop\\node_modules\\mocha\\lib\\runner.js:371:7',
            'at next (C:\\Users\\cmicle\\Desktop\\rejection-develop\\node_modules\\mocha\\lib\\runner.js:295:14)',
            'at Immediate.<anonymous> (C:\\Users\\cmicle\\Desktop\\rejection-develop\\node_modules\\mocha\\lib\\runner.js:339:5)',
            'at runCallback (timers.js:666:20)'];

        const rej = new Rejection(error);

        expect(rej.message, 'Message should be "foo"').to.equal('foo');
        expect(rej.data, 'Data should be null').to.be.null();
        expect(rej.innerRejection, 'InnerRejection should be null').to.be.null();
        expect(rej.stack, 'Stack should be an array').to.be.instanceof(Array);
        expect(rej.stack.length, 'Stack length should be 10').to.equal(10);
        expect(rej.stack, 'Stack should be equal to the Error').to.deep.equal(expected);
    });

    it('Construct with just data', () => {
        const data = { foo: 'bar' };
        const rej = new Rejection(undefined, data);

        data.foo = 'baz';

        expect(rej.message, 'Message should be null').to.be.null();
        expect(rej.data, 'Data should be the original').to.equal(data);
        expect(rej.innerRejection, 'InnerRejection should be null').to.be.null();
        expect(rej.stack, 'Stack should be an array').to.be.instanceof(Array);
        expect(rej.stack.length, 'Stack length should be 12').to.equal(12);
    });

    it('Construct with just inner rejection of type rejection.', () => {
        const inner = new Rejection('foo');
        const rej = new Rejection(undefined, undefined, inner);

        expect(rej.message, 'Message should be null').to.be.null();
        expect(rej.data, 'Data should be null').to.be.null();
        expect(rej.innerRejection, 'InnerRejection should be original').to.equal(inner);
        expect(rej.stack, 'Stack should be an array').to.be.instanceof(Array);
        expect(rej.stack.length, 'Stack length should be 12').to.equal(12);

        expect(rej.innerRejection.message, 'InnerRejection message should be "foo"').to.equal('foo');
    });

    it('Construct with just inner rejection of type Error.', () => {
        const inner = new Error('foo');

        inner.stack = '   at Context.<anonymous> (C:/Users/cmicle/Desktop/rejection-develop/test/unit/models/rejection.test.js:43:23)\n' +
                      '   at callFn (C:\\Users\\cmicle\\Desktop\\rejection-develop\\node_modules\\mocha\\lib\\runnable.js:345:21)\n' +
                      '   at Test.Runnable.run (C:\\Users\\cmicle\\Desktop\\rejection-develop\\node_modules\\mocha\\lib\\runnable.js:337:7)\n' +
                      '   at Runner.runTest (C:\\Users\\cmicle\\Desktop\\rejection-develop\\node_modules\\mocha\\lib\\runner.js:444:10)\n' +
                      '   at C:\\Users\\cmicle\\Desktop\\rejection-develop\\node_modules\\mocha\\lib\\runner.js:550:12\n' +
                      '   at next (C:\\Users\\cmicle\\Desktop\\rejection-develop\\node_modules\\mocha\\lib\\runner.js:361:14)\n' +
                      '   at C:\\Users\\cmicle\\Desktop\\rejection-develop\\node_modules\\mocha\\lib\\runner.js:371:7\n' +
                      '   at next (C:\\Users\\cmicle\\Desktop\\rejection-develop\\node_modules\\mocha\\lib\\runner.js:295:14)\n' +
                      '   at Immediate.<anonymous> (C:\\Users\\cmicle\\Desktop\\rejection-develop\\node_modules\\mocha\\lib\\runner.js:339:5)\n' +
                      '   at runCallback (timers.js:666:20)';

        const expected = ['at Context.<anonymous> (C:/Users/cmicle/Desktop/rejection-develop/test/unit/models/rejection.test.js:43:23)',
            'at callFn (C:\\Users\\cmicle\\Desktop\\rejection-develop\\node_modules\\mocha\\lib\\runnable.js:345:21)',
            'at Test.Runnable.run (C:\\Users\\cmicle\\Desktop\\rejection-develop\\node_modules\\mocha\\lib\\runnable.js:337:7)',
            'at Runner.runTest (C:\\Users\\cmicle\\Desktop\\rejection-develop\\node_modules\\mocha\\lib\\runner.js:444:10)',
            'at C:\\Users\\cmicle\\Desktop\\rejection-develop\\node_modules\\mocha\\lib\\runner.js:550:12',
            'at next (C:\\Users\\cmicle\\Desktop\\rejection-develop\\node_modules\\mocha\\lib\\runner.js:361:14)',
            'at C:\\Users\\cmicle\\Desktop\\rejection-develop\\node_modules\\mocha\\lib\\runner.js:371:7',
            'at next (C:\\Users\\cmicle\\Desktop\\rejection-develop\\node_modules\\mocha\\lib\\runner.js:295:14)',
            'at Immediate.<anonymous> (C:\\Users\\cmicle\\Desktop\\rejection-develop\\node_modules\\mocha\\lib\\runner.js:339:5)',
            'at runCallback (timers.js:666:20)'];

        const rej = new Rejection(undefined, undefined, inner);

        expect(rej.message, 'Message should be null').to.be.null();
        expect(rej.data, 'Data should be null').to.be.null();

        expect(rej.innerRejection, 'InnerRejection should be a Rejection instance').to.instanceof(Rejection);

        expect(rej.stack, 'Stack should be an array').to.be.instanceof(Array);
        expect(rej.stack.length, 'Stack length should be 12').to.equal(12);

        expect(rej.innerRejection.message, 'InnerRejection message should be "foo"').to.equal('foo');
        expect(rej.innerRejection.stack, 'InnerRejection stack should be equal to the Error').to.deep.equal(expected);
    });

    it('Construct with just inner rejection of type other.', () => {
        const inner = { foo: 'bar' };
        const rej = new Rejection(undefined, undefined, inner);

        expect(rej.message, 'Message should be null').to.be.null();
        expect(rej.data, 'Data should be null').to.be.null();
        expect(rej.innerRejection, 'InnerRejection should be a Rejection instance').to.instanceof(Rejection);
        expect(rej.stack, 'Stack should be an array').to.be.instanceof(Array);
        expect(rej.stack.length, 'Stack length should be 12').to.equal(12);

        expect(rej.innerRejection.message, 'InnerRejection message should be null').to.be.null();
        expect(rej.innerRejection.data, 'InnerRejection data should be original').to.equal(inner);
    });
});
