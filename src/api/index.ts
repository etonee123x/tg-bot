import KnownError from '@/helpers/KnownError';
import { ERRORS_MESSAGES } from '@/types';
import { ofetch } from 'ofetch';

export const client = ofetch.create({
  baseURL: String(process.env.API_URL),

  onResponseError() {
    throw new KnownError(ERRORS_MESSAGES.FETCHING_ERROR());
  },
});

export const getFileByPath = (path: string) =>
  client<Blob>(`https://api.telegram.org/file/bot${process.env.TOKEN}/${path}`).then(async (fileBlob) =>
    Buffer.from(await fileBlob.arrayBuffer()),
  );

export default client;
