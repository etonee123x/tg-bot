import { client } from '@/api';

export const getFunnyAnimals = () => client<Blob>('/funny-animals')
  .then(async funnyAnimalsBlob => Buffer.from(await funnyAnimalsBlob.arrayBuffer()));
