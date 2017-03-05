# rejection
A module which contains better error objects.

[![npm version](https://badge.fury.io/js/rejection.svg)](https://www.npmjs.com/package/rejection)
[![Build Status](https://travis-ci.org/CodeMedic42/rejection.svg?branch=master)](https://travis-ci.org/CodeMedic42/rejection)
[![Coverage Status](https://coveralls.io/repos/github/CodeMedic42/rejection/badge.svg?branch=master)](https://coveralls.io/github/CodeMedic42/rejection?branch=master)

###Why does this module exist?

- I wanted to capture an error and then wrap it in another to better show what was going on through the stack.
- I wanted a clean output to the console.

###Install
```bash
npm install rejection-js
```

###Usage
Here is a simple example.
```js
const RejectionJs = require('rejection-js');
const formater = RejectionJs.ConsoleFormatter();

const message = 'foo';
const data = { bar: 'baz' };
const innerRejection = null;

try {
    throw new RejectionJs.Rejection(message, data, innerRejection);
} catch (rej) {
    console.log(formater.format(rej));
}
```

##Rejections

###Rejection

The rejection object is the base object for this module. It inherits from Error. There are many different ways to create an instance of this object. It takes three paramaters, all of which are required but nilable.

```js
const RejectionJs = require('rejection-js');

RejectionJs.Rejection( issue | null | undefined,
          data | null | undefined,
          innerRejection | null | undefined );
```

- issue: This property can take two types as values.
    - string: If a string is provided then the message property of the new rejection object will be set to this value.
    - Error: If an object of type Error is passed then the value of the message property of the passed Error instance will become the value of the message property of the new rejection object. Also the stack value of the Error object is used as well.
- data: This property can be any value. It's main purpose is to allow additional data to be defined for the rejection object.
- innerRejection: This can be any value, but the type passed will have different results.
    - Error: If an Error type is passed then a new Rejection object will be created using the passed Error object.
    - Rejection: If the object passed is an instance of Rejection then this object will be used without modification.
    - other: If any other type is passed then a new Rejection object will be created where the issue paramater is null and then data paramater gets the passed value.

Each instance of a rejection object not only provides the properties message, data, and innerRejection, it also has a stack propery. This property is an array of the current call stack. The size of the array can be affected by the value of Error.stackTraceLimit.

###HttpRejection

The HttpRejection object can be accessed the same way as Rejection and used exactly the same. The only difference is an additional propery has been added to allow the user to define the http code.

```js
const RejectionJs = require('rejection-js');

RejectionJs.HttpRejection( issue | null | undefined,
          code | null | undefined,
          data | null | undefined,
          innerRejection | null | undefined );
```

- code: This property can be any value. It's main purpose is to allow the used to define an http code with the rejections.

## Inheriting from Rejection

If you want to inherit from Rejection its real easy. This is the format I use.

```js
import Util from 'util';

function MyRejection(issue, myProperty, data, innerRejection) {
    if (!(this instanceof MyRejection)) {
        return new HttpRejection(issue, myProperty, data, innerRejection);
    }

    Rejection.inherit(this, issue, myProperty, data, innerRejection, {
        MyProperty: 'myProperty'
    });

    this.myProperty = myProperty;
}

Util.inherits(MyRejection, Rejection);

return MyRejection;
```

The main part to review here is "Rejection.inherit". This function replaces "Rejection.call". The reason is the last parameter pased is an object which defines additional properties which will are avaliable on the object. At the moment this is mainly used by the formatters so they know that these properties are are to be formated as output. The format of this property is

```js
const additionalProperties = {
    label: propertyName
};
```

##Formatters
Formatters will be used to convert an instance of rejection to a string for output to some log, file, or console.

###ConsoleFormatter
The console formatter is built to format a rejection object into a string for output to the console. Of course the string can be saved anywhere if desired.

```js
const RejectionJs = require('rejection-js');

const options = null;

const formater = RejectionJs.ConsoleFormatter(options);

const rej = new RejectionJs.Rejection();

console.log(formater.format(rej));
```

This formatter can take options which can change the format of the result.

- stackTraceLimit: Although the size of the stack property in a Rejection object can be affected by Error.stackTraceLimit, the stackTraceLimit can limit the number outputed to the formated string. The default value is Infinity.
- padding: This the number of spaces which is added to the front of every line so the output lines up. The default is 0.
- innerPaddingIncrement: This is the number of spaces added to the padding everytime an innerRejection is written to the output. The default is 5.
- showNil: Setting this to true will add any items with undefined or null values to the output. By default this is true.
- useColors: This will enable the console colors. The default is false.
- colors: These are the colors which will be used when outputting. The colors of data properties are affected by the values set by "util.inspect.styles".
    - label: This is color to use when writing the labels of each property. The default is "grey".
    - stack: This is color to use when writing the stack. The default is "cyan".
    - message: This is color to use when writing the message. The default is "red".
- data: This property has the same properties and default values as Util.inspect, which is used to output the value of the data property and any additional properties. The useColors property overides the color property so this does not need to be defined.
