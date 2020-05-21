/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET-Core/blob/master/LICENSE.md
 */

import {Primitive} from '@tsdotnet/common-interfaces';
import InvalidOperationException from '@tsdotnet/exceptions/dist/InvalidOperationException';
import type from '@tsdotnet/type';
import Serializable from './Serializable';

export {Serializable};

const EMPTY = '', TRUE = 'true', FALSE = 'false';

/**
 * Returns null for null.
 * @param {null} value
 * @param {string} defaultForUnknown
 * @return {null}
 */
export function toString (value: null, defaultForUnknown?: string): null;

/**
 * Returns undefined for undefined.
 * @param {undefined} value
 * @param {string} defaultForUnknown
 * @return {undefined}
 */
export function toString (value: undefined, defaultForUnknown?: string): undefined;

/**
 * Serializes the specified value to a string.
 * @throws if unable to serialize unknown.
 * @param {Primitive | Serializable} value
 * @return {string | undefined}
 */
export function toString (value: Primitive | Serializable): string;

/**
 * Serializes the specified value to a string.
 * @throws if unable to serialize unknown.
 * @param {Primitive | Serializable | undefined | null} value
 * @param {string} defaultForUnknown
 * @return {string | null | undefined}
 */
export function toString (
	value: Primitive | Serializable | null | undefined,
	defaultForUnknown?: string): string | null | undefined | never
{
	if(value==null)
		return value;

	switch(typeof value)
	{
		case 'string':
			return value;
		case 'boolean':
			return value ? TRUE : FALSE;
		case 'number':
			return EMPTY + value;
		default:
			if(isSerializable(value))
				return value.serialize();
			else if(defaultForUnknown)
				return defaultForUnknown;

			throw new InvalidOperationException('Attempting to serialize unidentifiable type.');

	}

}

export function isSerializable (instance: any): instance is Serializable
{
	return type.hasMemberOfType<Serializable>(instance, 'serialize', 'function');
}

export function toPrimitive (
	value: string,
	caseInsensitive?: boolean,
	unknownHandler?: (v: string) => string): Primitive | null | undefined
{

	if(value)
	{
		if(caseInsensitive) value = value.toLowerCase();

		switch(value)
		{
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
				if(cleaned)
				{

					if(/^\d+$/g.test(cleaned))
					{
						const int = parseInt(cleaned);
						if(!isNaN(int)) return int;
					}
					else
					{
						const number = parseFloat(value);
						if(!isNaN(number)) return number;
					}

				}

				// Handle Dates...  Possibly JSON?

				// Instead of throwing we allow for handling...
				if(unknownHandler) value = unknownHandler(value);

				break;
			}
		}

	}

	return value;

}
