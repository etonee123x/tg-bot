import { type WithDatabaseFields } from '../';

export interface PostData {
  text: string;
  filesUrls: Array<string>;
}

export interface Post extends PostData, WithDatabaseFields {}
