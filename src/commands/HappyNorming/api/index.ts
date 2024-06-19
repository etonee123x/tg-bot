import { client } from '@/api';

export const getHappyNorming = (dotw = new Date().getDay()) =>
  client<Blob>('/happy-norming', { query: { dotw } }).then(async (happyNormingBlob) =>
    Buffer.from(await happyNormingBlob.arrayBuffer()),
  );
