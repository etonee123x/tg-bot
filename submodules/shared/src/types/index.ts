/* eslint-disable @typescript-eslint/no-explicit-any */

import { isNotNil } from '../utils';

export * from './modules';

export type Id = (string | number) & { readonly Id: unique symbol };

export interface WithId {
  id: Id;
}

export const toId = (id: Omit<Id, 'Id'>): Id => id as Id;

export const areIdsEqual = (id1: Id | Nil, id2: Id | Nil) =>
  isNotNil(id1) && isNotNil(id2) && String(id1) === String(id2);

export type NotEmptyArray<T> = [T, ...Array<T>];

export type Nil = null | undefined;

export type Falsy = false | Nil | '' | 0 | 0n;

export type Primitive = Nil | boolean | number | bigint | string | symbol;

export type PromiseOrNot<T> = T | Promise<T>;

export type FunctionType<Return = any> = (...args: Array<any>) => Return;

export type FunctionCallback = FunctionType<PromiseOrNot<void>>;

export type ObjectType = Array<unknown> | Record<string, unknown> | FunctionType;
