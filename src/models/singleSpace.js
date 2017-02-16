const _ = require('lodash');

function SingleSpace(namespace, cb) {
    // create a unique, global symbol name
    // -----------------------------------

    const moduleInstanceKey = Symbol.for(namespace);

    // check if the global object has this symbol
    // add it if it does not have the symbol, yet
    // ------------------------------------------

    const globalSymbols = Object.getOwnPropertySymbols(global);

    if (_.isFunction(cb)) {
        const hasInstance = (globalSymbols.indexOf(moduleInstanceKey) > -1);

        if (!hasInstance) {
            global[moduleInstanceKey] = cb();
        }
    }

    // define the singleton API
    // ------------------------

    const singleton = {};

    Object.defineProperty(singleton, 'instance', {
        get: () => {
            return global[moduleInstanceKey];
        }
    });

    // ensure the API is never changed
    // -------------------------------

    Object.freeze(singleton);

    // export the singleton API only
    // -----------------------------

    // export default singleton.instance;

    return singleton.instance;
}

module.exports = SingleSpace;


/*
const chai = require('chai');
const dirtyChai = require('dirty-chai');
const _ = require('lodash');
const SingleSpace = require('../../src/singleSpace.js');

chai.use(dirtyChai);

const expect = chai.expect;

describe('Single-Space', function mainTest() {
    it('Correctly defines and returns value', () => {
        const ret = SingleSpace('test1.foo.bar', () => {
            return 42;
        });

        expect(ret).to.equal(42);
    });

    it('Call without function before defined', () => {
        const ret = SingleSpace('test2.foo.bar');

        expect(ret).to.not.exist();
    });

    it('Call without function after defined', () => {
        const ret = SingleSpace('test3.foo.bar', () => {
            return 42;
        });

        expect(ret).to.equal(42);

        const ret2 = SingleSpace('test3.foo.bar');

        expect(ret2).to.equal(42);
    });


    it('Will not redefine the value', () => {
        const ret = SingleSpace('test4.foo.bar', () => {
            return 42;
        });

        expect(ret).to.equal(42);

        let called = false;

        const ret2 = SingleSpace('test4.foo.bar', () => {
            called = true;

            return 43;
        });

        expect(ret2).to.equal(42);
        expect(called).to.be.false();
    });
});

 */
