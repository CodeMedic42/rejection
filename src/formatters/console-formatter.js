import _repeat from 'lodash/repeat';
import _isNil from 'lodash/isNil';
import _trimStart from 'lodash/trim';
import _forOwn from 'lodash/forOwn';
import _get from 'lodash/get';
import Util from 'util';
import Colors from 'colors';
import Rejection from '../models/rejection';

/**
 * Formats the passed rejection object.
 *
 * @param  {Rejection} rejection The rejection object to format.
 * @param  {FormatOptions} options   The options to use when formating.
 * @param  {[type]} padCount  The the current padding to add to the beginning of each line.
 *
 * @return {string}           The formated string
 */
function _format(rejection, options, padCount) {
    const useColors = options.useColors;
    const numStack = options.stackTraceLimit;
    const showNil = options.showNil;

    const pad = _repeat(' ', padCount);

    let message = '';

    let messageLine = rejection.message;

    if ((!_isNil(messageLine) && messageLine.length > 0) || showNil) {
        if (useColors) {
            messageLine = options.colors.message(messageLine);
        }

        message = `${pad}| Message: ${messageLine}`;
    }

    _forOwn(rejection.customProps, (propName, propLabel) => {
        let propLine = rejection[propName];

        if (_isNil(propLine) && !showNil) {
            return;
        }

        propLine = Util.inspect(propLine, options.data);

        if (useColors) {
            propLine = Colors.white(propLine);
        }

        message = `${message}\n${pad}| ${propLabel}: ${propLine}`;
    });

    if (numStack > 0 && rejection.stack.length > 0) {
        let stackLine = rejection.stack[0];

        if (useColors) {
            stackLine = options.colors.stack(stackLine);
        }

        message = `${message}\n${pad}| Stack: ${stackLine}`;

        const stackPad = _repeat(' ', 8);

        let counter = 1;

        for (counter; counter < numStack && counter < rejection.stack.length; counter += 1) {
            stackLine = rejection.stack[counter];

            if (useColors) {
                stackLine = options.colors.stack(stackLine);
            }

            message = `${message}\n${pad}|${stackPad}${stackLine}`;
        }
    }

    if (!_isNil(rejection.innerRejection)) {
        const innerMessage = _format(rejection.innerRejection, options, padCount + options.innerPaddingIncrement);

        message = `${message}\n${pad}| Inner Exception:\n${innerMessage}`;
    }

    return _trimStart(message, '\n');
}

/**
 * Gets the appropriate color function from Colors.
 *
 * @param  {string} color        The color to lookup
 * @param  {string} defaultColor The default color to use if the first does not exist.
 *
 * @return {function}            The function to use to format a string for console output.
 */
function getColor(color, defaultColor) {
    const colorFunc = _get(Colors, color);

    if (!_isNil(colorFunc)) {
        return colorFunc;
    }

    return _get(Colors, defaultColor);
}

/**
 * Takes in the values defined by the user and adds default values where needed for colors.
 *
 * @param {[type]} colors The colors information to add defaults to.
 *
 * @return {function}     The color configuration information.
 */
function setColors(colors) {
    const _colors = _isNil(colors) ? {} : colors;

    _colors.stack = getColor(_colors.stack, 'cyan');
    _colors.message = getColor(_colors.message, 'red');
    _colors.label = getColor(_colors.label, 'grey');

    return _colors;
}

/**
 * Takes in the values defined by the user and adds default values where needed for data properties.
 *
 * @param {[type]} colors The colors information to add defaults to.
 *
 * @return {function}     The color configuration information.
 */
function setData(data) {
    const _data = _isNil(data) ? {} : data;

    _data.showHidden = _isNil(_data.showHidden) ? false : _data.showHidden;
    _data.depth = _isNil(_data.depth) ? 2 : _data.depth;
    _data.customInspect = _isNil(_data.customInspect) ? true : _data.customInspect;
    _data.showProxy = _isNil(_data.showProxy) ? false : _data.showProxy;
    _data.maxArrayLength = _isNil(_data.maxArrayLength) ? 100 : _data.maxArrayLength;
    _data.breakLength = _isNil(_data.breakLength) ? 60 : _data.breakLength;

    return _data;
}

/**
 * cleans up the passed in options object and adds default values to it.
 *
 * @param  {FormatOptions} options The options passed in by the user.
 *
 * @return {FormatOptions}         The options to use when formatting.
 */
function cleanOptions(options) {
    const _options = _isNil(options) ? {} : options;

    _options.colors = setColors(_options.colors);
    _options.data = setData(_options.data);

    _options.stackTraceLimit = _isNil(_options.stackTraceLimit) ? Infinity : _options.stackTraceLimit;
    _options.innerPaddingIncrement = _isNil(_options.innerPaddingIncrement) ? 5 : _options.innerPaddingIncrement;
    _options.padding = _isNil(_options.padding) ? 0 : _options.padding;
    _options.useColors = _options.data.colors = _isNil(_options.useColors) ? false : _options.useColors;
    _options.showNil = _isNil(_options.showNil) ? false : _options.showNil;

    return _options;
}

/**
 * A constructor which will build an object which can format a Rejection object for outout to the console.
 *
 * @param {FormatOptions} options The options to use when formatting.
 */
function ConsoleFormatter(options) {
    if (!(this instanceof ConsoleFormatter)) {
        return new ConsoleFormatter(options);
    }

    this.options = cleanOptions(options);
}

/**
 * Formats the passed rejection object for output to the console.
 *
 * @param  {Rejection} rejection The rejection object to format.
 *
 * @return {string}           The formated string.
 */
ConsoleFormatter.prototype.format = function format(rejection) {
    if (!(rejection instanceof Rejection)) {
        throw new Error('Must be of type Rejection.');
    }

    let message = _format(rejection, this.options, this.options.padding);

    if (this.options.useColors) {
        message = this.options.colors.label(message);
    }

    return message;
};

export default ConsoleFormatter;
