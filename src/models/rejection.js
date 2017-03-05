import Util from 'util';
import _isString from 'lodash/isString';
import _isNil from 'lodash/isNil';
import SingleSpace from 'single-space';

export default SingleSpace('rejection-js.rejection', () => {
    let _Rejection;

    // Private Functions
    // -------------------------------------------------------------------------

    function cleanStack(stack) {
        const pattern = /^\s*(at\s*.*.*)$/gm;

        const stackArray = [];
        let match;

        // eslint-disable-next-line
        while (!_isNil(match = pattern.exec(stack))) {
            stackArray.push(match[1]);
        }

        return stackArray;
    }

    function cleanInner(inner) {
        if (inner instanceof _Rejection) {
            return inner;
        }

        if (inner instanceof Error) {
            return _Rejection(inner);
        }

        if (!_isNil(inner)) {
            return _Rejection(null, inner);
        }

        return null;
    }

    // Constructor Definition
    // -------------------------------------------------------------------------

    _Rejection = function Rejection(issue, data, innerRejection) {
        if (!(this instanceof Rejection)) {
            return new Rejection(issue, data, innerRejection);
        }

        if (issue instanceof Error) {
            this.message = issue.message;

            this.stack = issue.stack;
        } else {
            Error.captureStackTrace(this, this.constructor);

            this.message = _isString(issue) ? issue : null;
        }

        this.name = this.constructor.name;

        this.innerRejection = cleanInner(innerRejection);
        this.data = _isNil(data) ? null : data;
        this.stack = cleanStack(this.stack);
        this.customProps = [{ label: 'Data', name: 'data' }];
    };

    Util.inherits(_Rejection, Error);

    // Static Functions
    // -------------------------------------------------------------------------

    _Rejection.inherit = function inherit(subClass, message, data, innerRejection) {
        _Rejection.call(subClass, message, data, innerRejection);

        return {
            register: (label, name) => {
                subClass.customProps.push({ label, name });
            }
        };
    };

    return _Rejection;
});
