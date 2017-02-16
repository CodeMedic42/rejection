const Util = require('util');
const _ = require('lodash');
const SingleSpace = require('./singleSpace.js');

module.exports = SingleSpace('rejection.rejection', () => {
    function cleanStack(stack) {
        const pattern = /^\s*(at\s*.*\(.*\))$/gm;

        const stackArray = [];
        let match;

        // eslint-disable-next-line
        while (!_.isNil(match = pattern.exec(stack))) {
            stackArray.push(match[1]);
        }

        return stackArray;
    }

    function convert(err) {
        if (err instanceof Error) {
            // eslint-disable-next-line
            const exc = Exception(err.message);

            exc.stack = cleanStack(err.stack);

            return exc;
        }

        return err;
    }

    function Rejection(message, data, innerRejection) {
        if (!(this instanceof Rejection)) {
            return new Rejection(message, data, innerRejection);
        }

        Error.captureStackTrace(this, Rejection);
        this.name = this.constructor.name;
        this.message = message;

        this.innerRejection = convert(innerRejection);
        this.data = data;
        this.stack = cleanStack(this.stack);
        this.customProps = [];
    }

    Rejection.fromError = function fromError(err) {
        return convert(err);
    };

    Rejection.inherit = function inherit(subClass, message, data, innerRejection) {
        Rejection.call(subClass, message, data, innerRejection);

        return {
            register: (label, name) => {
                subClass.customProps.push({ label, name });
            }
        };
    };

    Util.inherits(Rejection, Error);

    Rejection.prototype.toString = function toString(paddingCount, numStack) {
        const padCount = _.isNumber(paddingCount) && paddingCount > 0 ? paddingCount : 0;

        const pad = _.repeat(' ', padCount);
        let message = `${pad}| Message: ${this.message}`;

        _.forEach(this.customProps, (prop) => {
            message = `${message}\n${pad}| ${prop.label}: ${this[prop.name]}`;
        });

        if (numStack > 0) {
            message = `${message}\n${pad}| Stack: ${this.stack[0]}`;

            const stackPad = _.repeat(' ', 8);

            let counter = 1;

            for (counter; counter < numStack && counter < this.stack.length; counter += 1) {
                message = `${message}\n${pad}|${stackPad}${this.stack[counter]}`;
            }
        }

        if (!_.isNil(this.innerException)) {
            message = `${message}\n${pad}\` Inner Exception: \n${this.innerException.toString(padCount + 5, numStack)}`;
        }

        return message;
    };

    return Rejection;
});
