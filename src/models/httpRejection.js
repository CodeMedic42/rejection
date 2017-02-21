const Util = require('util');
const SingleSpace = require('single-space');
const Rejection = require('./rejection');

module.exports = SingleSpace('rejection.httpRejection', () => {
    function HttpRejection(message, code, data, innerRejection) {
        if (!(this instanceof HttpRejection)) {
            return new HttpRejection(message, code, data, innerRejection);
        }

        const prot = Rejection.inherit(this, message, data, innerRejection);

        prot.register('Code', 'code');

        this.code = code;
    }

    Util.inherits(HttpRejection, Rejection);

    return HttpRejection;
});
