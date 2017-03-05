import Util from 'util';
import SingleSpace from 'single-space';
import Rejection from './rejection';

export default SingleSpace('rejection-js.httpRejection', () => {
    function HttpRejection(issue, code, data, innerRejection) {
        if (!(this instanceof HttpRejection)) {
            return new HttpRejection(issue, code, data, innerRejection);
        }

        Rejection.inherit(this, issue, data, innerRejection, {
            Code: 'code'
        });

        this.code = code;
    }

    Util.inherits(HttpRejection, Rejection);

    return HttpRejection;
});
