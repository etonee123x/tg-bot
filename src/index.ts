import 'dotenv/config';

import botInstance from '@/bot';
import commandsHandler from '@/commands-handler';

botInstance.on('message', async (message) => {
  const messageContent =  String(message.text ?? message.caption)
  if (message.from?.is_bot || !messageContent.startsWith(String(process.env.COMMAND_SYMBOL))) return;

  await commandsHandler(message, messageContent)
});
