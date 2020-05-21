/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET-Core/blob/master/LICENSE.md
 */
import type from '@tsdotnet/compare/dist/type';
import InvalidOperationException from '@tsdotnet/exceptions/dist/InvalidOperationException';
const EMPTY = '', TRUE = 'true', FALSE = 'false';
/**
 * Serializes the specified value to a string.
 * @throws if unable to serialize unknown.
 * @param {Primitive | Serializable | undefined | null} value
 * @param {string} defaultForUnknown
 * @return {string | null | undefined}
 */
export function toString(value, defaultForUnknown) {
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
            throw new InvalidOperationException('Attempting to serialize unidentifiable type.');
    }
}
export function isSerializable(instance) {
    return type.hasMemberOfType(instance, 'serialize', 'function');
}
export function toPrimitive(value, caseInsensitive, unknownHandler) {
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
//# sourceMappingURL=Serialize.js.map