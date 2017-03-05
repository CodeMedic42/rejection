import Util from 'util';
import _isString from 'lodash/isString';
import _isNil from 'lodash/isNil';
import _merge from 'lodash/merge';
import SingleSpace from 'single-space';

export default SingleSpace('rejection-js.rejection', () => {
    let _Rejection;

    // Private Functions
    // -------------------------------------------------------------------------

    /**
     * Parses and cleans the passed in stack information.
     *
     * @param  {string} stack The stack string to parse.
     *
     * @return {array}       The array of stack information.
     */
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

    /**
     * Takes in the innerRejection which was given to the constructor and creates a Rejection object if neccecary.
     *
     * @param  {any} inner The object to become the innerRejection.
     *
     * @return {Reejection} The rejection object which will be the innerRejection for the Rejection being built.
     */
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

    /**
     * The base rejection object.
     *
     * @param  {string | Error | null | undefined} issue The issue which has occured.
     * @param  {any} data Data which is important to give the rejection context.
     * @param  {Rejection | Error | any} innerRejection A rejection object which is important to this rejection object.
     */
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
        this.customProps = {
            Data: 'data'
        };
    };

    Util.inherits(_Rejection, Error);

    // Static Functions
    // -------------------------------------------------------------------------

    /**
     * Adds the data nececary to the object ot make it a Rejection object.
     *
     * @param  {Rejection} subClass The rejection object to setup.
     * @param  {string | Error | null | undefined} issue The issue which has occured.
     * @param  {any} data Data which is important to give the rejection context.
     * @param  {Rejection | Error | any} innerRejection A rejection object which is important to this rejection object.
     * @param  {object} additionalProperties The property inforamtion which is being added to the object.
     */
    _Rejection.inherit = function inherit(subClass, message, data, innerRejection, additionalProperties) {
        _Rejection.call(subClass, message, data, innerRejection);

        _merge(subClass.customProps, additionalProperties);
    };

    return _Rejection;
});
