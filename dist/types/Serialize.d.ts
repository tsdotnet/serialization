/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET-Core/blob/master/LICENSE.md
 */
import { Primitive } from '@tsdotnet/common-interfaces';
import type Serializable from './Serializable';
export { Serializable };
export declare function toString(value: null, defaultForUnknown?: string): null;
export declare function toString(value: undefined, defaultForUnknown?: string): undefined;
export declare function toString(value: Primitive | Serializable): string;
export declare function isSerializable(instance: unknown): instance is Serializable;
export declare function toPrimitive(value: string, caseInsensitive?: boolean, unknownHandler?: (v: string) => string): Primitive | null | undefined;
