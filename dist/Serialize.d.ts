/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET-Core/blob/master/LICENSE.md
 */
import { Primitive } from '@tsdotnet/common-interfaces';
import Serializable from './Serializable';
export { Serializable };
/**
 * Returns null for null.
 * @param {null} value
 * @param {string} defaultForUnknown
 * @return {null}
 */
export declare function toString(value: null, defaultForUnknown?: string): null;
/**
 * Returns undefined for undefined.
 * @param {undefined} value
 * @param {string} defaultForUnknown
 * @return {undefined}
 */
export declare function toString(value: undefined, defaultForUnknown?: string): undefined;
/**
 * Serializes the specified value to a string.
 * @throws if unable to serialize unknown.
 * @param {Primitive | Serializable} value
 * @return {string | undefined}
 */
export declare function toString(value: Primitive | Serializable): string;
export declare function isSerializable(instance: unknown): instance is Serializable;
export declare function toPrimitive(value: string, caseInsensitive?: boolean, unknownHandler?: (v: string) => string): Primitive | null | undefined;
