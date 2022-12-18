"use strict";
/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET-Core/blob/master/LICENSE.md
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.toPrimitive = exports.isSerializable = exports.toString = void 0;
const tslib_1 = require("tslib");
const InvalidOperationException_1 = tslib_1.__importDefault(require("@tsdotnet/exceptions/dist/InvalidOperationException"));
const type_1 = tslib_1.__importDefault(require("@tsdotnet/type"));
const EMPTY = '', TRUE = 'true', FALSE = 'false';
/**
 * Serializes the specified value to a string.
 * @throws if unable to serialize unknown.
 * @param {Primitive | Serializable | undefined | null} value
 * @param {string} defaultForUnknown
 * @return {string | null | undefined}
 */
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
            throw new InvalidOperationException_1.default('Attempting to serialize unidentifiable type.');
    }
}
exports.toString = toString;
function isSerializable(instance) {
    return type_1.default.hasMemberOfType(instance, 'serialize', 'function');
}
exports.isSerializable = isSerializable;
function toPrimitive(value, caseInsensitive, unknownHandler) {
    if (value) {
        if (caseInsensitive)
            value = value.toLowerCase();
        switch (value) {
            case 'null':
                return null;
            case 'undefined':
                return void (0);
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
                    // Handle Dates...  Possibly JSON?
                    // Instead of throwing we allow for handling...
                    if (unknownHandler)
                        value = unknownHandler(value);
                    break;
                }
        }
    }
    return value;
}
exports.toPrimitive = toPrimitive;
//# sourceMappingURL=Serialize.js.map