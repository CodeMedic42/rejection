import Util from 'util';
import SingleSpace from 'single-space';
import Rejection from './rejection';

export default SingleSpace('rejection-js.httpRejection', () => {
    /**
     * A rejection object to use when defining http issues.
     *
     * @param  {string | Error | null | undefined} issue The issue which has occured.
     * @param  {number | null | undefined} code The http code which is relavent to this issue.
     * @param  {any} data Data which is important to give the rejection context.
     * @param  {Rejection | Error | any} innerRejection A rejection object which is important to this rejection object.
     */
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
