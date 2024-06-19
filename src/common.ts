import { format } from 'date-fns';
import botInstance from '@/bot';

import type { Message, SendMessageOptions } from 'node-telegram-bot-api';

export const dateLog = (text: string | Error) => console.log(`${format(new Date(), 'yyyy-MM-dd/HH:mm:ss')}: ${text}`);

export const cutMessage = (message: string) => {
  const MAX_LENGTH = 80;

  let result = message.replace(/[\s]+/g, ' ');
  if (result.length > MAX_LENGTH) {
    result = result.slice(0, MAX_LENGTH - 3) + '...';
  }
  return result;
};

export const sendMessage = async (
  messageToReply: Message,
  text: string,
  options: SendMessageOptions = { reply_to_message_id: messageToReply.message_id },
) => {
  const chunks = text.match(/[\s\S]{1,4000}/g) ?? [];
  for (const chunk of chunks) {
    await botInstance.sendMessage(messageToReply.chat.id, chunk, options)
      .then(m => dateLog(`Message "${cutMessage(chunk)}" successfully delivered to chat ${m.chat.id}`));
  }
};
