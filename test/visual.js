const RejectionJS = require('../lib');

const HttpRejection = RejectionJS.HttpRejection;
const consoleFormatter = RejectionJS.ConsoleFormatter({
    useColors: true,
    stackTraceLimit: 5,
    showUndefined: true
});

const rejF = new HttpRejection('testMessgeB', 406, { foo: 43, bar: () => {} });
const rejE = new HttpRejection('testMessgeB', 406, { foo: 43, bar: () => {} }, rejF);
const rejD = new HttpRejection('testMessgeB', null, null, rejE);
const rejC = new HttpRejection('testMessgeB', null, { foo: 43, bar: () => {} }, rejD);
const rejB = new HttpRejection('testMessgeB', 406, null, rejC);
const rejA = new HttpRejection('testMessgeA', 405, { foo: 42 }, rejB);

console.log(consoleFormatter.format(rejA));

// look at pollyfills
