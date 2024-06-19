import { format } from 'date-fns';

export const dateLog = (text: string | Error) => console.log(`${format(new Date(), 'yyyy-MM-dd/HH:mm:ss')}: ${text}`);
