import { sendMessage } from '@/common';
import botInstance from '@/bot';
import { COMMAND_TITLE, ERRORS_MESSAGES } from '@/types';

import DiceGame from '@commands/DiceGame';
import Weather from '@commands/Weather';
import { Ascii, PixelArt } from '@commands/Pixel';
import { Cypher, Decypher } from '@commands/Crypting';
import Help from '@commands/Help';
import KnownError from '@/helpers/KnownError';
import Auth from '@commands/Auth';

import type { Message } from 'node-telegram-bot-api';
import generalMessage from '@/commands/Help/generalMessage';
import { getFunnyAnimals } from '@/commands/FunnyAnimals/api';
import { getHappyNorming } from '@/commands/HappyNorming/api';

type Commands = {
  [commandTitle in COMMAND_TITLE]: (message: Message, commandBody: string, ...args: unknown[]) => Promise<void>
}

const commands: Commands = {
  async [COMMAND_TITLE.ECHO] (msg, commandBody) {
    await sendMessage(msg, commandBody || 'echoing!');
  },

  async [COMMAND_TITLE.ROLL] (msg, commandBody) {
    await sendMessage(msg, new DiceGame(commandBody).getResult());
  },

  async [COMMAND_TITLE.WEATHER] (msg, commandBody) {
    const result = await new Weather(commandBody).getResult();
    await sendMessage(msg, result);
  },

  async [COMMAND_TITLE.PIXEL] (msg, commandBody) {
    if (!msg.photo) {
      throw new KnownError(ERRORS_MESSAGES.NO_REQUIRED_PHOTO());
    }

    const filePath = await botInstance
      .getFile(msg.photo[msg.photo.length - 1].file_id)
      .then(p => String(p.file_path));
    const { bufferedImage, caption } = await new PixelArt(filePath, commandBody).getResult();
    await botInstance.sendPhoto(msg.chat.id, bufferedImage, {
      reply_to_message_id: msg.message_id,
      caption,
    });
  },

  async [COMMAND_TITLE.ASCII] (msg, commandBody) {
    if (!msg.photo) {
      throw new KnownError(ERRORS_MESSAGES.NO_REQUIRED_PHOTO());
    }

    const filePath = await botInstance
      .getFile(msg.photo[msg.photo.length - 1].file_id)
      .then(p => String(p.file_path));
    const result = await new Ascii(filePath, commandBody).getResult();
    await sendMessage(msg, result, {
      reply_to_message_id: msg.message_id,
      parse_mode: 'Markdown',
    });
  },

  async [COMMAND_TITLE.CYPHER] (msg, commandBody) {
    sendMessage(msg, new Cypher(commandBody).getResult(), {
      reply_to_message_id: msg.message_id,
      parse_mode: 'Markdown',
    });
  },

  async [COMMAND_TITLE.DECYPHER] (msg, commandBody) {
    sendMessage(msg, new Decypher(commandBody).getResult(), {
      reply_to_message_id: msg.message_id,
      parse_mode: 'Markdown',
    });
  },

  async [COMMAND_TITLE.HAPPY_NORMING] (msg) {
    const happyNorming = await getHappyNorming();

    await botInstance.sendPhoto(msg.chat.id, happyNorming, {
      reply_to_message_id: msg.message_id,
    });
  },

  async [COMMAND_TITLE.FUNNY_ANIMALS] (msg) {
    const funnyAnimals = await getFunnyAnimals();

    await botInstance.sendPhoto(msg.chat.id, funnyAnimals, {
      reply_to_message_id: msg.message_id,
    });
  },

  async [COMMAND_TITLE.HELP] (msg, commandBody) {
    const { result, shouldUseMd } = new Help(commandBody).getResult();
    await sendMessage(msg, result, {
      reply_to_message_id: msg.message_id,
      parse_mode: shouldUseMd
        ? 'Markdown'
        : undefined,
    });
  },

  async [COMMAND_TITLE.AUTH] (msg, commandBody) {
    msg.chat.id === Number(process.env.ADMIN_CHAT_ID)
      ? await sendMessage(msg, new Auth(commandBody).getResult(), { parse_mode: 'HTML' })
      : await sendMessage(msg, generalMessage);
  },
};

export default commands;
