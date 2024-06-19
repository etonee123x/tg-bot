import type { WithId } from '..';

export interface WithCreatedAt {
  createdAt: number;
}

export interface WithUpdatedAt {
  updatedAt: number;
}

export interface WithDatabaseFields extends WithId, WithCreatedAt, WithUpdatedAt {}

export type ForPost<T extends WithDatabaseFields> = Omit<T, 'id' | 'createdAt' | 'updatedAt'>;

export type ForPut<T extends WithDatabaseFields> = Omit<T, 'updatedAt'>;

export type ForPatch<T extends WithDatabaseFields> = Partial<Omit<T, 'updatedAt'>> & WithId & WithCreatedAt;

export interface PaginationMeta {
  perPage: number;
  page: number;
}

export interface WithIsEnd {
  isEnd: boolean;
}

export interface WithMeta<Meta> {
  meta: Meta;
}
