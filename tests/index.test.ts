import { describe, it, expect, vi } from 'vitest';
import { toString, isSerializable, toPrimitive, type Serializable } from '../src/Serialize.js';
import { InvalidOperationException } from '@tsdotnet/exceptions';

describe('Serialization', () => {
	describe('toString', () => {
		describe('null and undefined handling', () => {
			it('should return null for null input', () => {
				expect(toString(null)).toBe(null);
			});

			it('should return undefined for undefined input', () => {
				expect(toString(undefined)).toBe(undefined);
			});

			it('should return null for null with defaultForUnknown', () => {
				expect(toString(null, 'default')).toBe(null);
			});

			it('should return undefined for undefined with defaultForUnknown', () => {
				expect(toString(undefined, 'default')).toBe(undefined);
			});
		});

		describe('primitive serialization', () => {
			it('should serialize strings unchanged', () => {
				expect(toString('hello')).toBe('hello');
				expect(toString('')).toBe('');
				expect(toString('with spaces')).toBe('with spaces');
			});

			it('should serialize boolean true as "true"', () => {
				expect(toString(true)).toBe('true');
			});

			it('should serialize boolean false as "false"', () => {
				expect(toString(false)).toBe('false');
			});

			it('should serialize numbers as strings', () => {
				expect(toString(42)).toBe('42');
				expect(toString(0)).toBe('0');
				expect(toString(-123)).toBe('-123');
				expect(toString(3.14159)).toBe('3.14159');
				expect(toString(NaN)).toBe('NaN');
				expect(toString(Infinity)).toBe('Infinity');
				expect(toString(-Infinity)).toBe('-Infinity');
			});
		});

		describe('Serializable object handling', () => {
			it('should call serialize method on Serializable objects', () => {
				const serializable: Serializable = {
					serialize: vi.fn().mockReturnValue('serialized-value')
				};

				const result = toString(serializable);
				
				expect(result).toBe('serialized-value');
				expect(serializable.serialize).toHaveBeenCalledOnce();
			});

			it('should handle complex serializable objects', () => {
				class TestSerializable implements Serializable {
					constructor(private value: string) {}
					
					serialize(): string {
						return `TestSerializable:${this.value}`;
					}
				}

				const obj = new TestSerializable('test-data');
				expect(toString(obj)).toBe('TestSerializable:test-data');
			});
		});

		describe('error handling', () => {
			it('should throw InvalidOperationException for unidentifiable types', () => {
				const unserializable = { notSerialize: () => 'nope' };
				
				expect(() => toString(unserializable as any)).toThrow(InvalidOperationException);
				expect(() => toString(unserializable as any)).toThrow('Attempting to serialize unidentifiable type.');
			});

			it('should use defaultForUnknown for unidentifiable types when provided', () => {
				const unserializable = { notSerialize: () => 'nope' };
				
				const result = toString(unserializable as any, 'fallback');
				expect(result).toBe('fallback');
			});

			it('should throw TypeError for symbols due to type checking limitations', () => {
				const sym = Symbol('test');
				// The isSerializable check fails with TypeError on symbols
				expect(() => toString(sym as any)).toThrow(TypeError);
				expect(() => toString(sym as any)).toThrow("Cannot use 'in' operator to search for 'serialize' in Symbol(test)");
			});

			it('should throw TypeError for symbols even with defaultForUnknown', () => {
				const sym = Symbol('test');
				// The error occurs before reaching the defaultForUnknown logic
				expect(() => toString(sym as any, 'symbol-fallback')).toThrow(TypeError);
			});
		});
	});

	describe('isSerializable', () => {
		it('should return true for objects with serialize function', () => {
			const serializable = {
				serialize: () => 'test'
			};
			
			expect(isSerializable(serializable)).toBe(true);
		});

		it('should return false for objects without serialize function', () => {
			const notSerializable = {
				toString: () => 'test'
			};
			
			expect(isSerializable(notSerializable)).toBe(false);
		});

		it('should return false for objects with non-function serialize', () => {
			const notSerializable = {
				serialize: 'not a function'
			};
			
			expect(isSerializable(notSerializable)).toBe(false);
		});

		it('should return false for primitives', () => {
			expect(isSerializable('string')).toBe(false);
			expect(isSerializable(42)).toBe(false);
			expect(isSerializable(true)).toBe(false);
			expect(isSerializable(null)).toBe(false);
			expect(isSerializable(undefined)).toBe(false);
		});

		it('should return false for null and undefined', () => {
			expect(isSerializable(null)).toBe(false);
			expect(isSerializable(undefined)).toBe(false);
		});
	});

	describe('toPrimitive', () => {
		describe('null and undefined handling', () => {
			it('should parse "null" to null', () => {
				expect(toPrimitive('null')).toBe(null);
			});

			it('should parse "undefined" to undefined', () => {
				expect(toPrimitive('undefined')).toBe(undefined);
			});
		});

		describe('boolean parsing', () => {
			it('should parse "true" to true', () => {
				expect(toPrimitive('true')).toBe(true);
			});

			it('should parse "false" to false', () => {
				expect(toPrimitive('false')).toBe(false);
			});

			it('should handle case sensitivity', () => {
				expect(toPrimitive('TRUE')).toBe('TRUE'); // case sensitive by default
				expect(toPrimitive('TRUE', true)).toBe(true); // case insensitive
				expect(toPrimitive('False', true)).toBe(false);
			});
		});

		describe('number parsing', () => {
			it('should parse integer strings to numbers', () => {
				expect(toPrimitive('42')).toBe(42);
				expect(toPrimitive('0')).toBe(0);
				expect(toPrimitive('123')).toBe(123);
			});

			it('should parse float strings to numbers', () => {
				expect(toPrimitive('3.14159')).toBe(3.14159);
				expect(toPrimitive('0.5')).toBe(0.5);
				expect(toPrimitive('-2.5')).toBe(-2.5);
			});

			it('should handle whitespace and commas', () => {
				expect(toPrimitive(' 42 ')).toBe(42);
				expect(toPrimitive('1,000')).toBe(1000); // comma removed
				expect(toPrimitive(' 3.14, ')).toBe(3.14);
			});
		});

		describe('unknown value handling', () => {
			it('should return original value for unrecognized strings', () => {
				expect(toPrimitive('hello')).toBe('hello');
				expect(toPrimitive('not-a-number')).toBe('not-a-number');
			});

			it('should use unknownHandler when provided', () => {
				const handler = vi.fn((v: string) => v.toUpperCase());
				const result = toPrimitive('hello', false, handler);
				
				expect(handler).toHaveBeenCalledWith('hello');
				expect(result).toBe('HELLO');
			});

			it('should handle empty strings', () => {
				expect(toPrimitive('')).toBe('');
			});
		});

		describe('edge cases', () => {
			it('should handle numbers with leading zeros', () => {
				expect(toPrimitive('007')).toBe(7);
				expect(toPrimitive('0042')).toBe(42);
			});

			it('should handle negative numbers', () => {
				expect(toPrimitive('-42')).toBe(-42);
				expect(toPrimitive('-3.14')).toBe(-3.14);
			});

			it('should handle scientific notation', () => {
				expect(toPrimitive('1e5')).toBe(100000);
				expect(toPrimitive('2.5e-2')).toBe(0.025);
			});

			it('should handle mixed whitespace and commas - limited by parseFloat behavior', () => {
				// The implementation strips whitespace/commas for integers but uses parseFloat for decimals
				// parseFloat(' 1,234.56 ') stops at the comma, returning 1
				expect(toPrimitive(' 1,234.56 ')).toBe(1);
				expect(toPrimitive(',123,')).toBe(123); // This becomes '123' after cleaning
				expect(toPrimitive(' 123.45 ')).toBe(123.45); // No comma, so parseFloat works
			});
		});
	});

	describe('integration tests', () => {
		it('should handle round-trip serialization for primitives', () => {
			// Test specific types individually due to strict overloads
			expect(toPrimitive(toString(42))).toBe(42);
			expect(toPrimitive(toString(true))).toBe(true);
			expect(toPrimitive(toString(false))).toBe(false);
			expect(toString(null)).toBe(null);
			expect(toString(undefined)).toBe(undefined);
			
			// String values should remain unchanged
			const testString = 'hello world';
			expect(toPrimitive(toString(testString))).toBe(testString);
		});

		it('should handle custom serializable objects', () => {
			class Person implements Serializable {
				constructor(
					public name: string, 
					public age: number
				) {}
				
				serialize(): string {
					return JSON.stringify({ name: this.name, age: this.age });
				}
			}

			const person = new Person('Alice', 30);
			const serialized = toString(person);
			expect(serialized).toBe('{"name":"Alice","age":30}');
			
			// Could be parsed back as JSON
			const parsed = JSON.parse(serialized);
			expect(parsed.name).toBe('Alice');
			expect(parsed.age).toBe(30);
		});
	});
});