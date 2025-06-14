import { format } from 'date-fns';

export const dateLog = (text: string | Error) => console.info(`${format(new Date(), 'yyyy-MM-dd/HH:mm:ss')}: ${text}`);
