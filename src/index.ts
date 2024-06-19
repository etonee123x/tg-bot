import 'dotenv/config';

import { bot } from '@/bot';
import { commands } from '@/commands';
import { isCommandTitle } from '@/types';

import { KnownError } from '@/helpers/KnownError';
import { sendMessage } from '@/helpers/sendMessage';

import { cutMessage } from '@/utils/cutMessage';
import { dateLog } from '@/utils/dateLog';

import { GENERAL_MESSAGE } from '@/constants/generalMessage';

bot.on('message', async (message) => {
  const maybeMessageContent = message.text ?? message.caption;

  if (message.from?.is_bot || !maybeMessageContent?.startsWith(String(process.env.COMMAND_SYMBOL))) {
    return;
  }

  dateLog(
    [
      `New message "${cutMessage(maybeMessageContent)}"`,
      `from chat ${message.chat.id}`,
      ...(message.from ? [`(${message.from.first_name})`] : []),
    ].join(' '),
  );

  const commandBody = maybeMessageContent.split(' ').slice(1).join(' ');
  const commandTitle = String(maybeMessageContent.match(/(?<=\/)[^\s]+/)?.[0]);

  try {
    isCommandTitle(commandTitle)
      ? await commands[commandTitle](message, commandBody)
      : await sendMessage(message, GENERAL_MESSAGE);
  } catch (e) {
    const onKnownError = (e: KnownError) => sendMessage(message, 'Error: ' + e.message);

    const onUnknownError = () =>
      sendMessage(message, 'Unknown  error occurred during processing request :(', {
        reply_to_message_id: message.message_id,
      });

    console.error(e);

    return e instanceof KnownError ? onKnownError(e) : onUnknownError();
  }
});
