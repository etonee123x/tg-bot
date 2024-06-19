import { bot } from '@/bot';

import { cutMessage } from '@/utils/cutMessage';
import { dateLog } from '@/utils/dateLog';

import type { Message, SendMessageOptions } from 'node-telegram-bot-api';

export const sendMessage = async (
  messageToReply: Message,
  text: string,
  options: SendMessageOptions = { reply_to_message_id: messageToReply.message_id },
) => {
  const chunks = text.match(/[\s\S]{1,4000}/g) ?? [];

  for (const chunk of chunks) {
    await bot
      .sendMessage(messageToReply.chat.id, chunk, options)
      .then((m) => dateLog(`Message "${cutMessage(chunk)}" successfully delivered to chat ${m.chat.id}`));
  }
};
