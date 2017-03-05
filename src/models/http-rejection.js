import Util from 'util';
import SingleSpace from 'single-space';
import Rejection from './rejection';

export default SingleSpace('rejection-js.httpRejection', () => {
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
