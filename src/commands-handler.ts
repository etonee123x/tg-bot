import commands from '@commands';
import generalMessage from '@/commands/Help/generalMessage';
import { COMMAND_TITLE } from '@/types';
import KnownError from '@/helpers/KnownError';
import { cutMessage, dateLog, sendMessage } from '@/common';
import { joinStr } from '@/utils';

import type { Message } from 'node-telegram-bot-api';

const onError = async ({ message, e }: { message: Message; e: unknown }) => {
  const onKnownError = (e: KnownError) => {
    sendMessage(message, 'Error: ' + e.message);
  };
  const onUnknownError = () => {
    sendMessage(message, 'Unknown  error occurred during processing request :(', {
      reply_to_message_id: message.message_id,
    });
    // @TODO -- добавить отправку сообщений об ошибках мне
  };

  console.error(e);

  return e instanceof KnownError ? onKnownError(e) : onUnknownError();
};

export default async (message: Message, messageContent: string) => {
  dateLog(
    joinStr(
      `New message "${cutMessage(messageContent)}"`,
      `in chat ${message.chat.id}`,
      message.from && `(from ${message.from.first_name})`,
      ' ',
    ),
  );

  const commandBody = messageContent.split(' ').slice(1).join(' ');
  const commandTitle = String(messageContent.match(/(?<=\/)[^\s]+/)?.[0]);

  try {
    Object.values(COMMAND_TITLE).includes(commandTitle as COMMAND_TITLE)
      ? await commands[commandTitle as COMMAND_TITLE](message, commandBody)
      : await sendMessage(message, generalMessage);
  } catch (e) {
    onError({ message, e });
  }
};
