import { type Falsy, type FunctionType, type Nil, type NotEmptyArray, type ObjectType, type Primitive } from '../types';

export const envVarToBoolean = (envVar: unknown): boolean => ['true', 'TRUE'].includes(String(envVar));

export const isNil = <T>(argument: T | Nil): argument is Nil => argument == null;

export const isNotNil = <T>(argument: T | null | undefined): argument is T => !isNil(argument);

export const isFunction = <T>(argument: T | FunctionType): argument is FunctionType => typeof argument === 'function';

export const isBoolean = <T>(argument: T | boolean): argument is boolean => typeof argument === 'boolean';

export const isNumber = <T>(argument: T | number): argument is number => typeof argument === 'number';

export const isBigint = <T>(argument: T | bigint): argument is bigint => typeof argument === 'bigint';

export const isString = <T>(argument: T | string): argument is string => typeof argument === 'string';

export const isSymbol = <T>(argument: T | symbol): argument is symbol => typeof argument === 'symbol';

export const isArray = <T>(argument: unknown | Array<T>): argument is Array<T> => Array.isArray(argument);

export const isObject = <T>(argument: T | object): argument is object => typeof argument === 'object';

export const isRealObject = <T>(argument: T | Record<string, unknown>): argument is Record<string, unknown> =>
  Boolean(argument && isObject(argument) && !isArray(argument));

export const isNotEmptyObject = <T>(argument: T | Record<string, unknown>): argument is Record<string, unknown> =>
  isRealObject(argument) && isNotEmptyArray(Object.values(argument));

export const isPrimitive = <T>(argument: T | Primitive): argument is Primitive =>
  [isNil, isBoolean, isNumber, isBigint, isString, isSymbol].some((func) => func(argument));

export const isObjectType = <T>(argument: T | ObjectType): argument is ObjectType =>
  [isRealObject, isArray, isFunction].some((func) => func(argument));

export const isTruthy = <T>(argument: T): argument is Exclude<T, Falsy> => Boolean(argument);

export const stringToLowerCase = <T extends string>(_string: T): Lowercase<T> => _string.toLowerCase() as Lowercase<T>;
export const stringToUpperCase = <T extends string>(_string: T): Uppercase<T> => _string.toUpperCase() as Uppercase<T>;

export const jsonParse = <T>(argument: string): T => JSON.parse(argument) as T;

export const omit = <TObject extends object, Key extends keyof TObject>(
  object: TObject,
  keys: Array<Key>,
): Omit<TObject, Key> => {
  const _keys = keys.map(String);

  return Object.fromEntries(Object.entries(object).filter(([key]) => !_keys.includes(key))) as Omit<TObject, Key>;
};

export const pick = <TObject extends object, Key extends keyof TObject>(
  object: TObject,
  keys: Array<Key>,
): Pick<TObject, Key> => {
  const _keys = keys.map(String);

  return Object.fromEntries(Object.entries(object).filter(([key]) => _keys.includes(key))) as Pick<TObject, Key>;
};

export const pickFn =
  <TObject extends object, Key extends keyof TObject>(keys: Array<Key>) =>
  (object: TObject) =>
    pick(object, keys);

export const omitFn =
  <TObject extends object, Key extends keyof TObject>(keys: Array<Key>) =>
  (object: TObject) =>
    omit(object, keys);

export const isNotEmptyArray = <T>(argument: unknown | Array<T>): argument is NotEmptyArray<T> =>
  Boolean(isArray(argument) && argument.length);

export const prop = <TObject extends object, Prop extends keyof TObject>(object: TObject, _prop: Prop): TObject[Prop] =>
  object[_prop];

export const propFn =
  <TObject extends object, Prop extends keyof TObject>(_prop: Prop) =>
  (object: TObject) =>
    prop(object, _prop);

export const checkExhaustive = (value: never) => console.log('Добавьте обработчик для:', value);

export const arrayToSpliced = <T1, T2>(
  array: Array<T1>,
  start: number,
  deleteCount: number,
  ...items: Array<T2>
): Array<T1 | T2> =>
  array.reduce<Array<T1 | T2>>((acc, curr, index) => {
    if (index < start || index >= start + deleteCount) {
      acc.push(curr);
    }

    if (index === start) {
      acc.push(...items);
    }

    return acc;
  }, []);
