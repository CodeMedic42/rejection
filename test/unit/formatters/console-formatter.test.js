/* global it, describe, beforeEach */

import Chai from 'chai';
import DirtyChai from 'dirty-chai';
import _ from 'lodash';
import ConsoleFormatter from '../../../src/formatters/console-formatter';
import Rejection from '../../../src/models/rejection';

Chai.use(DirtyChai);

const expect = Chai.expect;

function add(message, text) {
    let _message = message;

    if (_message.length > 0) {
        _message += '\n';
    }

    return _message + text;
}

const _messageColor = '\u001b[31m';
const _baseColor = '\u001b[90m';
const _stackColor = '\u001b[36m';
const _dataColorStart = '\u001b[37m\u001b[32m';
const _dataColorEnd = '\u001b[37m';
const _baseColorEnd = '\u001b[39m';

function buildExpectedRej(rej, withMessage, withData, stackSize, padding, withColor, newStackColor) {
    let baseColor = '';
    let stackColor = '';
    let dataColorStart = '';
    let dataColorEnd = '';
    let messageColor = '';

    if (withColor) {
        messageColor = _messageColor;
        baseColor = _baseColor;
        stackColor = newStackColor || _stackColor;
        dataColorStart = _dataColorStart;
        dataColorEnd = _dataColorEnd;
    }

    let message = '';
    const pad = _.repeat(' ', padding);

    if (withMessage) {
        const messageValue = rej.message || null;

        message = add(message, `${pad}| Message: ${messageColor}${messageValue}${baseColor}`);
    }

    if (withData) {
        const dataValue = _.isNil(rej.data) ? null : `'${rej.data}'`;

        message = add(message, `${pad}| Data: ${dataColorStart}${dataValue}${dataColorEnd}${baseColor}`);
    }

    if (stackSize > 0) {
        message = add(message, `${pad}| Stack: ${stackColor}${rej.stack[0]}${baseColor}`);

        for (let counter = 1; counter < stackSize; counter += 1) {
            message = add(message, `${pad}|        ${stackColor}${rej.stack[counter]}${baseColor}`);
        }
    }

    return message;
}

describe('ConsoleFormatter Tests', () => {
    beforeEach(function setup() {
        const inner = Rejection('faz', 'baz');
        inner.stack = ['faz0', 'faz1', 'faz2', 'faz3', 'faz4', 'faz5', 'faz6', 'faz7', 'faz8', 'faz9'];

        const rej = Rejection('foo', 'bar', inner);
        rej.stack = ['foo0', 'foo1', 'foo2', 'foo3', 'foo4', 'foo5', 'foo6', 'foo7', 'foo8', 'foo9'];

        this.rej = rej;
    });

    describe('ConsoleFormatter Construction Tests', () => {
        it('Construct with new; no options', () => {
            const formatter = new ConsoleFormatter();

            expect(formatter).to.exist();
        });

        it('Construct; no options', () => {
            const formatter = ConsoleFormatter();

            expect(formatter).to.exist();
        });
    });

    describe('ConsoleFormatter Formatting Tests', () => {
        it('Call format for non Rejection type', () => {
            let threw = false;

            try {
                const formatter = new ConsoleFormatter();

                formatter.format({});
            } catch (err) {
                threw = true;

                expect(err.message).to.equal('Must be of type Rejection.');
            }

            expect(threw).to.be.true();
        });

        describe('Default options', () => {
            describe('Single Rejection', () => {
                beforeEach(function removeInner() {
                    this.rej.innerRejection = null;
                });

                it('Mesage: true; Data:true: Stack: 10', function defOpts() {
                    const formatter = new ConsoleFormatter();

                    const ret = formatter.format(this.rej);

                    const expected = buildExpectedRej(this.rej, true, true, 10, 0);

                    expect(ret).to.equal(expected);
                });

                it('Mesage: false; Data:true: Stack: 10', function defOpts() {
                    const formatter = new ConsoleFormatter();

                    this.rej.message = null;

                    const ret = formatter.format(this.rej);

                    const expected = buildExpectedRej(this.rej, false, true, 10, 0);

                    expect(ret).to.equal(expected);
                });

                it('Mesage: true; Data:false: Stack: 10', function defOpts() {
                    const formatter = new ConsoleFormatter();

                    this.rej.data = null;

                    const ret = formatter.format(this.rej);

                    const expected = buildExpectedRej(this.rej, true, false, 10, 0);

                    expect(ret).to.equal(expected);
                });

                it('Mesage: false; Data:false: Stack: 10', function defOpts() {
                    const formatter = new ConsoleFormatter();

                    this.rej.message = null;
                    this.rej.data = null;

                    const ret = formatter.format(this.rej);

                    const expected = buildExpectedRej(this.rej, false, false, 10, 0);

                    expect(ret).to.equal(expected);
                });

                it('Mesage: false; Data:false: Stack: 5', function defOpts() {
                    const formatter = new ConsoleFormatter();

                    this.rej.message = null;
                    this.rej.data = null;
                    this.rej.stack = _.dropRight(this.rej.stack, 5);

                    const ret = formatter.format(this.rej);

                    const expected = buildExpectedRej(this.rej, false, false, 5, 0);

                    expect(ret).to.equal(expected);
                });
            });

            describe('With Inner Rejection', () => {
                it('Mesage: true; Data:true: Stack: 10', function defOpts() {
                    const formatter = new ConsoleFormatter();

                    const ret = formatter.format(this.rej);

                    let expected = buildExpectedRej(this.rej, true, true, 10, 0);
                    expected = add(expected, '| Inner Exception:');
                    expected = add(expected, buildExpectedRej(this.rej.innerRejection, true, true, 10, 5));

                    expect(ret).to.equal(expected);
                });

                it('Mesage: false; Data:true: Stack: 10', function defOpts() {
                    const formatter = new ConsoleFormatter();

                    this.rej.innerRejection.message = null;

                    const ret = formatter.format(this.rej);

                    let expected = buildExpectedRej(this.rej, true, true, 10, 0);
                    expected = add(expected, '| Inner Exception:');
                    expected = add(expected, buildExpectedRej(this.rej.innerRejection, false, true, 10, 5));

                    expect(ret).to.equal(expected);
                });

                it('Mesage: true; Data:false: Stack: 10', function defOpts() {
                    const formatter = new ConsoleFormatter();

                    this.rej.innerRejection.data = null;

                    const ret = formatter.format(this.rej);

                    let expected = buildExpectedRej(this.rej, true, true, 10, 0);
                    expected = add(expected, '| Inner Exception:');
                    expected = add(expected, buildExpectedRej(this.rej.innerRejection, true, false, 10, 5));

                    expect(ret).to.equal(expected);
                });

                it('Mesage: false; Data:false: Stack: 10', function defOpts() {
                    const formatter = new ConsoleFormatter();

                    this.rej.innerRejection.message = null;
                    this.rej.innerRejection.data = null;

                    const ret = formatter.format(this.rej);

                    let expected = buildExpectedRej(this.rej, true, true, 10, 0);
                    expected = add(expected, '| Inner Exception:');
                    expected = add(expected, buildExpectedRej(this.rej.innerRejection, false, false, 10, 5));

                    expect(ret).to.equal(expected);
                });

                it('Mesage: false; Data:false: Stack: 5', function defOpts() {
                    const formatter = new ConsoleFormatter();

                    this.rej.innerRejection.message = null;
                    this.rej.innerRejection.data = null;
                    this.rej.innerRejection.stack = _.dropRight(this.rej.stack, 5, 0);

                    const ret = formatter.format(this.rej);

                    let expected = buildExpectedRej(this.rej, true, true, 10, 0);
                    expected = add(expected, '| Inner Exception:');
                    expected = add(expected, buildExpectedRej(this.rej.innerRejection, false, false, 5, 5));

                    expect(ret).to.equal(expected);
                });
            });
        });

        describe('Stack Trace Limit', () => {
            describe('Single Rejection', () => {
                beforeEach(function removeInner() {
                    this.rej.innerRejection = null;
                });

                it('Mesage: true; Data:true: Stack: 10', function defOpts() {
                    const formatter = new ConsoleFormatter({ stackTraceLimit: 5 });

                    const ret = formatter.format(this.rej);

                    const expected = buildExpectedRej(this.rej, true, true, 5, 0);

                    expect(ret).to.equal(expected);
                });

                it('Mesage: false; Data:true: Stack: 10', function defOpts() {
                    const formatter = new ConsoleFormatter({ stackTraceLimit: 5 });

                    this.rej.message = null;

                    const ret = formatter.format(this.rej);

                    const expected = buildExpectedRej(this.rej, false, true, 5, 0);

                    expect(ret).to.equal(expected);
                });

                it('Mesage: true; Data:false: Stack: 10', function defOpts() {
                    const formatter = new ConsoleFormatter({ stackTraceLimit: 5 });

                    this.rej.data = null;

                    const ret = formatter.format(this.rej);

                    const expected = buildExpectedRej(this.rej, true, false, 5, 0);

                    expect(ret).to.equal(expected);
                });

                it('Mesage: false; Data:false: Stack: 10', function defOpts() {
                    const formatter = new ConsoleFormatter({ stackTraceLimit: 5 });

                    this.rej.message = null;
                    this.rej.data = null;

                    const ret = formatter.format(this.rej);

                    const expected = buildExpectedRej(this.rej, false, false, 5, 0);

                    expect(ret).to.equal(expected);
                });

                it('Mesage: false; Data:false: Stack: 5', function defOpts() {
                    const formatter = new ConsoleFormatter({ stackTraceLimit: 5 });

                    this.rej.message = null;
                    this.rej.data = null;
                    this.rej.stack = _.dropRight(this.rej.stack, 5);

                    const ret = formatter.format(this.rej);

                    const expected = buildExpectedRej(this.rej, false, false, 5, 0);

                    expect(ret).to.equal(expected);
                });
            });

            describe('With Inner Rejection', () => {
                it('Mesage: true; Data:true: Stack: 10', function defOpts() {
                    const formatter = new ConsoleFormatter({ stackTraceLimit: 5 });

                    const ret = formatter.format(this.rej);

                    let expected = buildExpectedRej(this.rej, true, true, 5, 0);
                    expected = add(expected, '| Inner Exception:');
                    expected = add(expected, buildExpectedRej(this.rej.innerRejection, true, true, 5, 5));

                    expect(ret).to.equal(expected);
                });

                it('Mesage: false; Data:true: Stack: 10', function defOpts() {
                    const formatter = new ConsoleFormatter({ stackTraceLimit: 5 });

                    this.rej.innerRejection.message = null;

                    const ret = formatter.format(this.rej);

                    let expected = buildExpectedRej(this.rej, true, true, 5, 0);
                    expected = add(expected, '| Inner Exception:');
                    expected = add(expected, buildExpectedRej(this.rej.innerRejection, false, true, 5, 5));

                    expect(ret).to.equal(expected);
                });

                it('Mesage: true; Data:false: Stack: 10', function defOpts() {
                    const formatter = new ConsoleFormatter({ stackTraceLimit: 5 });

                    this.rej.innerRejection.data = null;

                    const ret = formatter.format(this.rej);

                    let expected = buildExpectedRej(this.rej, true, true, 5, 0);
                    expected = add(expected, '| Inner Exception:');
                    expected = add(expected, buildExpectedRej(this.rej.innerRejection, true, false, 5, 5));

                    expect(ret).to.equal(expected);
                });

                it('Mesage: false; Data:false: Stack: 10', function defOpts() {
                    const formatter = new ConsoleFormatter({ stackTraceLimit: 5 });

                    this.rej.innerRejection.message = null;
                    this.rej.innerRejection.data = null;

                    const ret = formatter.format(this.rej);

                    let expected = buildExpectedRej(this.rej, true, true, 5, 0);
                    expected = add(expected, '| Inner Exception:');
                    expected = add(expected, buildExpectedRej(this.rej.innerRejection, false, false, 5, 5));

                    expect(ret).to.equal(expected);
                });

                it('Mesage: false; Data:false: Stack: 5', function defOpts() {
                    const formatter = new ConsoleFormatter({ stackTraceLimit: 5 });

                    this.rej.innerRejection.message = null;
                    this.rej.innerRejection.data = null;
                    this.rej.innerRejection.stack = _.dropRight(this.rej.stack, 5, 0);

                    const ret = formatter.format(this.rej);

                    let expected = buildExpectedRej(this.rej, true, true, 5, 0);
                    expected = add(expected, '| Inner Exception:');
                    expected = add(expected, buildExpectedRej(this.rej.innerRejection, false, false, 5, 5));

                    expect(ret).to.equal(expected);
                });

                it('Mesage: false; Data:false: Stack: 5', function defOpts() {
                    const formatter = new ConsoleFormatter({ stackTraceLimit: 0 });

                    this.rej.innerRejection.message = null;
                    this.rej.innerRejection.data = null;
                    this.rej.innerRejection.stack = _.dropRight(this.rej.stack, 5, 0);

                    const ret = formatter.format(this.rej);

                    let expected = buildExpectedRej(this.rej, true, true, 0, 0);
                    expected = add(expected, '| Inner Exception:');
                    expected = add(expected, buildExpectedRej(this.rej.innerRejection, false, false, 0, 5));

                    expect(ret).to.equal(_.trim(expected));
                });
            });
        });

        describe('Change padding', () => {
            describe('Single Rejection', () => {
                beforeEach(function removeInner() {
                    this.rej.innerRejection = null;
                });

                it('Mesage: true; Data:true: Stack: 10', function defOpts() {
                    const formatter = new ConsoleFormatter({ padding: 5 });

                    const ret = formatter.format(this.rej);

                    const expected = buildExpectedRej(this.rej, true, true, 10, 5);

                    expect(ret).to.equal(expected);
                });

                it('Mesage: false; Data:true: Stack: 10', function defOpts() {
                    const formatter = new ConsoleFormatter({ padding: 5 });

                    this.rej.message = null;

                    const ret = formatter.format(this.rej);

                    const expected = buildExpectedRej(this.rej, false, true, 10, 5);

                    expect(ret).to.equal(expected);
                });

                it('Mesage: true; Data:false: Stack: 10', function defOpts() {
                    const formatter = new ConsoleFormatter({ padding: 5 });

                    this.rej.data = null;

                    const ret = formatter.format(this.rej);

                    const expected = buildExpectedRej(this.rej, true, false, 10, 5);

                    expect(ret).to.equal(expected);
                });

                it('Mesage: false; Data:false: Stack: 10', function defOpts() {
                    const formatter = new ConsoleFormatter({ padding: 5 });

                    this.rej.message = null;
                    this.rej.data = null;

                    const ret = formatter.format(this.rej);

                    const expected = buildExpectedRej(this.rej, false, false, 10, 5);

                    expect(ret).to.equal(expected);
                });

                it('Mesage: false; Data:false: Stack: 5', function defOpts() {
                    const formatter = new ConsoleFormatter({ padding: 5 });

                    this.rej.message = null;
                    this.rej.data = null;
                    this.rej.stack = _.dropRight(this.rej.stack, 5);

                    const ret = formatter.format(this.rej);

                    const expected = buildExpectedRej(this.rej, false, false, 5, 5);

                    expect(ret).to.equal(expected);
                });
            });

            describe('With Inner Rejection', () => {
                it('Mesage: true; Data:true: Stack: 10', function defOpts() {
                    const formatter = new ConsoleFormatter({ padding: 5 });

                    const ret = formatter.format(this.rej);

                    let expected = buildExpectedRej(this.rej, true, true, 10, 5);
                    expected = add(expected, '     | Inner Exception:');
                    expected = add(expected, buildExpectedRej(this.rej.innerRejection, true, true, 10, 10));

                    expect(ret).to.equal(expected);
                });

                it('Mesage: false; Data:true: Stack: 10', function defOpts() {
                    const formatter = new ConsoleFormatter({ padding: 5 });

                    this.rej.innerRejection.message = null;

                    const ret = formatter.format(this.rej);

                    let expected = buildExpectedRej(this.rej, true, true, 10, 5);
                    expected = add(expected, '     | Inner Exception:');
                    expected = add(expected, buildExpectedRej(this.rej.innerRejection, false, true, 10, 10));

                    expect(ret).to.equal(expected);
                });

                it('Mesage: true; Data:false: Stack: 10', function defOpts() {
                    const formatter = new ConsoleFormatter({ padding: 5 });

                    this.rej.innerRejection.data = null;

                    const ret = formatter.format(this.rej);

                    let expected = buildExpectedRej(this.rej, true, true, 10, 5);
                    expected = add(expected, '     | Inner Exception:');
                    expected = add(expected, buildExpectedRej(this.rej.innerRejection, true, false, 10, 10));

                    expect(ret).to.equal(expected);
                });

                it('Mesage: false; Data:false: Stack: 10', function defOpts() {
                    const formatter = new ConsoleFormatter({ padding: 5 });

                    this.rej.innerRejection.message = null;
                    this.rej.innerRejection.data = null;

                    const ret = formatter.format(this.rej);

                    let expected = buildExpectedRej(this.rej, true, true, 10, 5);
                    expected = add(expected, '     | Inner Exception:');
                    expected = add(expected, buildExpectedRej(this.rej.innerRejection, false, false, 10, 10));

                    expect(ret).to.equal(expected);
                });

                it('Mesage: false; Data:false: Stack: 5', function defOpts() {
                    const formatter = new ConsoleFormatter({ padding: 5 });

                    this.rej.innerRejection.message = null;
                    this.rej.innerRejection.data = null;
                    this.rej.innerRejection.stack = _.dropRight(this.rej.stack, 5);

                    const ret = formatter.format(this.rej);

                    let expected = buildExpectedRej(this.rej, true, true, 10, 5);
                    expected = add(expected, '     | Inner Exception:');
                    expected = add(expected, buildExpectedRej(this.rej.innerRejection, false, false, 5, 10));

                    expect(ret).to.equal(expected);
                });
            });
        });

        describe('Show Nil', () => {
            describe('Single Rejection', () => {
                beforeEach(function removeInner() {
                    this.rej.innerRejection = null;
                });

                it('Mesage: true; Data:true: Stack: 10', function defOpts() {
                    const formatter = new ConsoleFormatter({ showNil: true });

                    const ret = formatter.format(this.rej);

                    const expected = buildExpectedRej(this.rej, true, true, 10, 0);

                    expect(ret).to.equal(expected);
                });

                it('Mesage: false; Data:true: Stack: 10', function defOpts() {
                    const formatter = new ConsoleFormatter({ showNil: true });

                    this.rej.message = null;

                    const ret = formatter.format(this.rej);

                    const expected = buildExpectedRej(this.rej, true, true, 10, 0);

                    expect(ret).to.equal(expected);
                });

                it('Mesage: true; Data:false: Stack: 10', function defOpts() {
                    const formatter = new ConsoleFormatter({ showNil: true });

                    this.rej.data = null;

                    const ret = formatter.format(this.rej);

                    const expected = buildExpectedRej(this.rej, true, true, 10, 0);

                    expect(ret).to.equal(expected);
                });

                it('Mesage: false; Data:false: Stack: 10', function defOpts() {
                    const formatter = new ConsoleFormatter({ showNil: true });

                    this.rej.message = null;
                    this.rej.data = null;

                    const ret = formatter.format(this.rej);

                    const expected = buildExpectedRej(this.rej, true, true, 10, 0);

                    expect(ret).to.equal(expected);
                });

                it('Mesage: false; Data:false: Stack: 5', function defOpts() {
                    const formatter = new ConsoleFormatter({ showNil: true });

                    this.rej.message = null;
                    this.rej.data = null;
                    this.rej.stack = _.dropRight(this.rej.stack, 5);

                    const ret = formatter.format(this.rej);

                    const expected = buildExpectedRej(this.rej, true, true, 5, 0);

                    expect(ret).to.equal(expected);
                });
            });

            describe('With Inner Rejection', () => {
                it('Mesage: true; Data:true: Stack: 10', function defOpts() {
                    const formatter = new ConsoleFormatter({ showNil: true });

                    const ret = formatter.format(this.rej);

                    let expected = buildExpectedRej(this.rej, true, true, 10, 0);
                    expected = add(expected, '| Inner Exception:');
                    expected = add(expected, buildExpectedRej(this.rej.innerRejection, true, true, 10, 5));

                    expect(ret).to.equal(expected);
                });

                it('Mesage: false; Data:true: Stack: 10', function defOpts() {
                    const formatter = new ConsoleFormatter({ showNil: true });

                    this.rej.innerRejection.message = null;

                    const ret = formatter.format(this.rej);

                    let expected = buildExpectedRej(this.rej, true, true, 10, 0);
                    expected = add(expected, '| Inner Exception:');
                    expected = add(expected, buildExpectedRej(this.rej.innerRejection, true, true, 10, 5));

                    expect(ret).to.equal(expected);
                });

                it('Mesage: true; Data:false: Stack: 10', function defOpts() {
                    const formatter = new ConsoleFormatter({ showNil: true });

                    this.rej.innerRejection.data = null;

                    const ret = formatter.format(this.rej);

                    let expected = buildExpectedRej(this.rej, true, true, 10, 0);
                    expected = add(expected, '| Inner Exception:');
                    expected = add(expected, buildExpectedRej(this.rej.innerRejection, true, true, 10, 5));

                    expect(ret).to.equal(expected);
                });

                it('Mesage: false; Data:false: Stack: 10', function defOpts() {
                    const formatter = new ConsoleFormatter({ showNil: true });

                    this.rej.innerRejection.message = null;
                    this.rej.innerRejection.data = null;

                    const ret = formatter.format(this.rej);

                    let expected = buildExpectedRej(this.rej, true, true, 10, 0);
                    expected = add(expected, '| Inner Exception:');
                    expected = add(expected, buildExpectedRej(this.rej.innerRejection, true, true, 10, 5));

                    expect(ret).to.equal(expected);
                });

                it('Mesage: false; Data:false: Stack: 5', function defOpts() {
                    const formatter = new ConsoleFormatter({ showNil: true });

                    this.rej.innerRejection.message = null;
                    this.rej.innerRejection.data = null;
                    this.rej.innerRejection.stack = _.dropRight(this.rej.stack, 5);

                    const ret = formatter.format(this.rej);

                    let expected = buildExpectedRej(this.rej, true, true, 10, 0);
                    expected = add(expected, '| Inner Exception:');
                    expected = add(expected, buildExpectedRej(this.rej.innerRejection, true, true, 5, 5));

                    expect(ret).to.equal(expected);
                });
            });
        });

        describe('Inner Padding Increment', () => {
            describe('Single Rejection', () => {
                beforeEach(function removeInner() {
                    this.rej.innerRejection = null;
                });

                it('Mesage: true; Data:true: Stack: 10', function defOpts() {
                    const formatter = new ConsoleFormatter({ innerPaddingIncrement: 2 });

                    const ret = formatter.format(this.rej);

                    const expected = buildExpectedRej(this.rej, true, true, 10, 0);

                    expect(ret).to.equal(expected);
                });

                it('Mesage: false; Data:true: Stack: 10', function defOpts() {
                    const formatter = new ConsoleFormatter({ innerPaddingIncrement: 2 });

                    this.rej.message = null;

                    const ret = formatter.format(this.rej);

                    const expected = buildExpectedRej(this.rej, false, true, 10, 0);

                    expect(ret).to.equal(expected);
                });

                it('Mesage: true; Data:false: Stack: 10', function defOpts() {
                    const formatter = new ConsoleFormatter({ innerPaddingIncrement: 2 });

                    this.rej.data = null;

                    const ret = formatter.format(this.rej);

                    const expected = buildExpectedRej(this.rej, true, false, 10, 0);

                    expect(ret).to.equal(expected);
                });

                it('Mesage: false; Data:false: Stack: 10', function defOpts() {
                    const formatter = new ConsoleFormatter({ innerPaddingIncrement: 2 });

                    this.rej.message = null;
                    this.rej.data = null;

                    const ret = formatter.format(this.rej);

                    const expected = buildExpectedRej(this.rej, false, false, 10, 0);

                    expect(ret).to.equal(expected);
                });

                it('Mesage: false; Data:false: Stack: 5', function defOpts() {
                    const formatter = new ConsoleFormatter({ innerPaddingIncrement: 2 });

                    this.rej.message = null;
                    this.rej.data = null;
                    this.rej.stack = _.dropRight(this.rej.stack, 5);

                    const ret = formatter.format(this.rej);

                    const expected = buildExpectedRej(this.rej, false, false, 5, 0);

                    expect(ret).to.equal(expected);
                });
            });

            describe('With Inner Rejection', () => {
                it('Mesage: true; Data:true: Stack: 10', function defOpts() {
                    const formatter = new ConsoleFormatter({ innerPaddingIncrement: 2 });

                    const ret = formatter.format(this.rej);

                    let expected = buildExpectedRej(this.rej, true, true, 10, 0);
                    expected = add(expected, '| Inner Exception:');
                    expected = add(expected, buildExpectedRej(this.rej.innerRejection, true, true, 10, 2));

                    expect(ret).to.equal(expected);
                });

                it('Mesage: false; Data:true: Stack: 10', function defOpts() {
                    const formatter = new ConsoleFormatter({ innerPaddingIncrement: 2 });

                    this.rej.innerRejection.message = null;

                    const ret = formatter.format(this.rej);

                    let expected = buildExpectedRej(this.rej, true, true, 10, 0);
                    expected = add(expected, '| Inner Exception:');
                    expected = add(expected, buildExpectedRej(this.rej.innerRejection, false, true, 10, 2));

                    expect(ret).to.equal(expected);
                });

                it('Mesage: true; Data:false: Stack: 10', function defOpts() {
                    const formatter = new ConsoleFormatter({ innerPaddingIncrement: 2 });

                    this.rej.innerRejection.data = null;

                    const ret = formatter.format(this.rej);

                    let expected = buildExpectedRej(this.rej, true, true, 10, 0);
                    expected = add(expected, '| Inner Exception:');
                    expected = add(expected, buildExpectedRej(this.rej.innerRejection, true, false, 10, 2));

                    expect(ret).to.equal(expected);
                });

                it('Mesage: false; Data:false: Stack: 10', function defOpts() {
                    const formatter = new ConsoleFormatter({ innerPaddingIncrement: 2 });

                    this.rej.innerRejection.message = null;
                    this.rej.innerRejection.data = null;

                    const ret = formatter.format(this.rej);

                    let expected = buildExpectedRej(this.rej, true, true, 10, 0);
                    expected = add(expected, '| Inner Exception:');
                    expected = add(expected, buildExpectedRej(this.rej.innerRejection, false, false, 10, 2));

                    expect(ret).to.equal(expected);
                });

                it('Mesage: false; Data:false: Stack: 5', function defOpts() {
                    const formatter = new ConsoleFormatter({ innerPaddingIncrement: 2 });

                    this.rej.innerRejection.message = null;
                    this.rej.innerRejection.data = null;
                    this.rej.innerRejection.stack = _.dropRight(this.rej.stack, 5);

                    const ret = formatter.format(this.rej);

                    let expected = buildExpectedRej(this.rej, true, true, 10, 0);
                    expected = add(expected, '| Inner Exception:');
                    expected = add(expected, buildExpectedRej(this.rej.innerRejection, false, false, 5, 2));

                    expect(ret).to.equal(expected);
                });
            });
        });

        describe('Use Colors', () => {
            describe('Single Rejection', () => {
                beforeEach(function removeInner() {
                    this.rej.innerRejection = null;
                });

                it('Mesage: true; Data:true: Stack: 10', function defOpts() {
                    const formatter = new ConsoleFormatter({ useColors: true });

                    const ret = formatter.format(this.rej);

                    const expected = _baseColor + buildExpectedRej(this.rej, true, true, 10, 0, true) + _baseColorEnd;

                    expect(ret).to.equal(expected);
                });

                it('Mesage: false; Data:true: Stack: 10', function defOpts() {
                    const formatter = new ConsoleFormatter({ useColors: true });

                    this.rej.message = null;

                    const ret = formatter.format(this.rej);

                    const expected = _baseColor + buildExpectedRej(this.rej, false, true, 10, 0, true) + _baseColorEnd;

                    expect(ret).to.equal(expected);
                });

                it('Mesage: true; Data:false: Stack: 10', function defOpts() {
                    const formatter = new ConsoleFormatter({ useColors: true });

                    this.rej.data = null;

                    const ret = formatter.format(this.rej);

                    const expected = _baseColor + buildExpectedRej(this.rej, true, false, 10, 0, true) + _baseColorEnd;

                    expect(ret).to.equal(expected);
                });

                it('Mesage: false; Data:false: Stack: 10', function defOpts() {
                    const formatter = new ConsoleFormatter({ useColors: true });

                    this.rej.message = null;
                    this.rej.data = null;

                    const ret = formatter.format(this.rej);

                    const expected = _baseColor + buildExpectedRej(this.rej, false, false, 10, 0, true) + _baseColorEnd;

                    expect(ret).to.equal(expected);
                });

                it('Mesage: false; Data:false: Stack: 5', function defOpts() {
                    const formatter = new ConsoleFormatter({ useColors: true });

                    this.rej.message = null;
                    this.rej.data = null;
                    this.rej.stack = _.dropRight(this.rej.stack, 5);

                    const ret = formatter.format(this.rej);

                    const expected = _baseColor + buildExpectedRej(this.rej, false, false, 5, 0, true) + _baseColorEnd;

                    expect(ret).to.equal(expected);
                });
            });

            describe('With Inner Rejection', () => {
                it('Mesage: true; Data:true: Stack: 10', function defOpts() {
                    const formatter = new ConsoleFormatter({ useColors: true });

                    const ret = formatter.format(this.rej);

                    let expected = _baseColor + buildExpectedRej(this.rej, true, true, 10, 0, true);
                    expected = add(expected, '| Inner Exception:');
                    expected = add(expected, buildExpectedRej(this.rej.innerRejection, true, true, 10, 5, true)) + _baseColorEnd;

                    expect(ret).to.equal(expected);
                });

                it('Mesage: true; Data:true: Stack: 10, wrong color', function defOpts() {
                    const formatter = new ConsoleFormatter({
                        useColors: true,
                        colors: {
                            stack: 'magenta'
                        }
                    });

                    const ret = formatter.format(this.rej);

                    let expected = _baseColor + buildExpectedRej(this.rej, true, true, 10, 0, true, '\u001b[35m');
                    expected = add(expected, '| Inner Exception:');
                    expected = add(expected, buildExpectedRej(this.rej.innerRejection, true, true, 10, 5, true, '\u001b[35m')) + _baseColorEnd;

                    expect(ret).to.equal(expected);
                });

                it('Mesage: false; Data:true: Stack: 10', function defOpts() {
                    const formatter = new ConsoleFormatter({ useColors: true });

                    this.rej.innerRejection.message = null;

                    const ret = formatter.format(this.rej);

                    let expected = _baseColor + buildExpectedRej(this.rej, true, true, 10, 0, true);
                    expected = add(expected, '| Inner Exception:');
                    expected = add(expected, buildExpectedRej(this.rej.innerRejection, false, true, 10, 5, true)) + _baseColorEnd;

                    expect(ret).to.equal(expected);
                });

                it('Mesage: true; Data:false: Stack: 10', function defOpts() {
                    const formatter = new ConsoleFormatter({ useColors: true });

                    this.rej.innerRejection.data = null;

                    const ret = formatter.format(this.rej);

                    let expected = _baseColor + buildExpectedRej(this.rej, true, true, 10, 0, true);
                    expected = add(expected, '| Inner Exception:');
                    expected = add(expected, buildExpectedRej(this.rej.innerRejection, true, false, 10, 5, true)) + _baseColorEnd;

                    expect(ret).to.equal(expected);
                });

                it('Mesage: false; Data:false: Stack: 10', function defOpts() {
                    const formatter = new ConsoleFormatter({ useColors: true });

                    this.rej.innerRejection.message = null;
                    this.rej.innerRejection.data = null;

                    const ret = formatter.format(this.rej);

                    let expected = _baseColor + buildExpectedRej(this.rej, true, true, 10, 0, true);
                    expected = add(expected, '| Inner Exception:');
                    expected = add(expected, buildExpectedRej(this.rej.innerRejection, false, false, 10, 5, true)) + _baseColorEnd;

                    expect(ret).to.equal(expected);
                });

                it('Mesage: false; Data:false: Stack: 5', function defOpts() {
                    const formatter = new ConsoleFormatter({ useColors: true });

                    this.rej.innerRejection.message = null;
                    this.rej.innerRejection.data = null;
                    this.rej.innerRejection.stack = _.dropRight(this.rej.stack, 5);

                    const ret = formatter.format(this.rej);

                    let expected = _baseColor + buildExpectedRej(this.rej, true, true, 10, 0, true);
                    expected = add(expected, '| Inner Exception:');
                    expected = add(expected, buildExpectedRej(this.rej.innerRejection, false, false, 5, 5, true)) + _baseColorEnd;

                    expect(ret).to.equal(expected);
                });
            });
        });

        describe('Use Colors', () => {
            describe('Single Rejection', () => {
                beforeEach(function removeInner() {
                    this.rej.innerRejection = null;
                });

                it('Mesage: true; Data:true: Stack: 10', function defOpts() {
                    const formatter = new ConsoleFormatter({
                        data: {
                            showHidden: true,
                            depth: 10,
                            customInspect: false,
                            showProxy: true,
                            maxArrayLength: 50,
                            breakLength: 30
                        }
                    });

                    const ret = formatter.format(this.rej);

                    const expected = buildExpectedRej(this.rej, true, true, 10, 0);

                    expect(ret).to.equal(expected);
                });
            });
        });
    });
});
