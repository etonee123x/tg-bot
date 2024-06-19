import { ERRORS_MESSAGES } from '@/constants/errorMessages';
import { ofetch } from 'ofetch';
import { createErrorServer } from '@shared/src/types';

export const client = ofetch.create({
  baseURL: String(process.env.API_URL),

  onResponseError() {
    throw createErrorServer(ERRORS_MESSAGES.FETCHING_ERROR());
  },
});

export const getFileByPath = (path: string) =>
  client<Blob>(`https://api.telegram.org/file/bot${process.env.TOKEN}/${path}`).then(async (fileBlob) =>
    Buffer.from(await fileBlob.arrayBuffer()),
  );

export default client;
