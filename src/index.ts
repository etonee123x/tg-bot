import 'dotenv/config';

import { bot } from '@/bot';
import { commands } from '@/commands';
import { isCommandTitle } from '@/types';

import { sendMessage } from '@/helpers/sendMessage';

import { cutMessage } from '@/utils/cutMessage';
import { dateLog } from '@/utils/dateLog';

import { GENERAL_MESSAGE } from '@/constants/generalMessage';
import { type CustomError, isCustomError } from '@etonee123x/shared/helpers/error';

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
    if (isCommandTitle(commandTitle)) {
      await commands[commandTitle](message, commandBody);
    } else {
      await sendMessage(message, GENERAL_MESSAGE);
    }
  } catch (e) {
    const onCustomError = (error: CustomError) => sendMessage(message, ['Error:', error.data].join(' '));

    const onUnknownError = () =>
      sendMessage(message, 'Unknown error occurred during processing request :(', {
        reply_to_message_id: message.message_id,
      });

    return isCustomError(e) ? onCustomError(e) : onUnknownError();
  }
});
