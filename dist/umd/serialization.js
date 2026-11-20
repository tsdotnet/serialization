(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@tsdotnet/exceptions'), require('@tsdotnet/type')) :
    typeof define === 'function' && define.amd ? define(['exports', '@tsdotnet/exceptions', '@tsdotnet/type'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory((global.tsdotnet = global.tsdotnet || {}, global.tsdotnet.serialization = global.tsdotnet.serialization || {}), global.tsdotnet.exceptions, global.tsdotnet.type));
})(this, (function (exports, exceptions, type) { 'use strict';

    /*!
     * @author electricessence / https://github.com/electricessence/
     * Licensing: MIT https://github.com/electricessence/TypeScript.NET-Core/blob/master/LICENSE.md
     */
    const EMPTY = '', TRUE = 'true', FALSE = 'false';
    function toString(value, defaultForUnknown) {
        if (value == null)
            return value;
        switch (typeof value) {
            case 'string':
                return value;
            case 'boolean':
                return value ? TRUE : FALSE;
            case 'number':
                return EMPTY + value;
            default:
                if (isSerializable(value))
                    return value.serialize();
                else if (defaultForUnknown)
                    return defaultForUnknown;
                throw new exceptions.InvalidOperationException('Attempting to serialize unidentifiable type.');
        }
    }
    function isSerializable(instance) {
        return type.hasMemberOfType(instance, 'serialize', 'function');
    }
    function toPrimitive(value, caseInsensitive, unknownHandler) {
        if (value) {
            if (caseInsensitive)
                value = value.toLowerCase();
            switch (value) {
                case 'null':
                    return null;
                case 'undefined':
                    return void 0;
                case TRUE:
                    return true;
                case FALSE:
                    return false;
                default:
                    {
                        const cleaned = value.replace(/^\s+|,|\s+$/g, EMPTY);
                        if (cleaned) {
                            if (/^\d+$/g.test(cleaned)) {
                                const int = parseInt(cleaned);
                                if (!isNaN(int))
                                    return int;
                            }
                            else {
                                const number = parseFloat(value);
                                if (!isNaN(number))
                                    return number;
                            }
                        }
                        if (unknownHandler)
                            value = unknownHandler(value);
                        break;
                    }
            }
        }
        return value;
    }

    exports.isSerializable = isSerializable;
    exports.toPrimitive = toPrimitive;
    exports.toString = toString;

}));
//# sourceMappingURL=serialization.js.map
