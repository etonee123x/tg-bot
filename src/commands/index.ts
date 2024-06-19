import { bot } from '@/bot';
import { COMMAND_TITLE, ERRORS_MESSAGES } from '@/types';
import type { Message } from 'node-telegram-bot-api';

import DiceGame from './DiceGame';
import Weather from './Weather';
import { Ascii, PixelArt } from './Pixel';
import { Cypher, Decypher } from './Crypting';
import Help from './Help';
import Auth from './Auth';
import { getFunnyAnimals } from './FunnyAnimals/api';
import { getHappyNorming } from './HappyNorming/api';

import KnownError from '@/helpers/KnownError';

import generalMessage from './Help/generalMessage';
import { sendMessage } from '@/helpers/sendMessage';

const commands: Record<COMMAND_TITLE, (message: Message, commandBody: string) => Promise<void>> = {
  async [COMMAND_TITLE.ECHO](msg, commandBody) {
    await sendMessage(msg, commandBody || 'echoing!');
  },

  async [COMMAND_TITLE.ROLL](msg, commandBody) {
    await sendMessage(msg, new DiceGame(commandBody).getResult());
  },

  async [COMMAND_TITLE.WEATHER](msg, commandBody) {
    const result = await new Weather(commandBody).getResult();

    await sendMessage(msg, result);
  },

  async [COMMAND_TITLE.PIXEL](msg, commandBody) {
    if (!msg.photo) {
      throw new KnownError(ERRORS_MESSAGES.NO_REQUIRED_PHOTO());
    }

    const filePath = await bot.getFile(msg.photo[msg.photo.length - 1].file_id).then((p) => String(p.file_path));
    const { bufferedImage, caption } = await new PixelArt(filePath, commandBody).getResult();

    await bot.sendPhoto(msg.chat.id, bufferedImage, {
      reply_to_message_id: msg.message_id,
      caption,
    });
  },

  async [COMMAND_TITLE.ASCII](msg, commandBody) {
    if (!msg.photo) {
      throw new KnownError(ERRORS_MESSAGES.NO_REQUIRED_PHOTO());
    }

    const filePath = await bot.getFile(msg.photo[msg.photo.length - 1].file_id).then((p) => String(p.file_path));
    const result = await new Ascii(filePath, commandBody).getResult();

    await sendMessage(msg, result, {
      reply_to_message_id: msg.message_id,
      parse_mode: 'Markdown',
    });
  },

  async [COMMAND_TITLE.CYPHER](msg, commandBody) {
    sendMessage(msg, new Cypher(commandBody).getResult(), {
      reply_to_message_id: msg.message_id,
      parse_mode: 'Markdown',
    });
  },

  async [COMMAND_TITLE.DECYPHER](msg, commandBody) {
    sendMessage(msg, new Decypher(commandBody).getResult(), {
      reply_to_message_id: msg.message_id,
      parse_mode: 'Markdown',
    });
  },

  async [COMMAND_TITLE.HAPPY_NORMING](msg) {
    const happyNorming = await getHappyNorming();

    await bot.sendPhoto(msg.chat.id, happyNorming, {
      reply_to_message_id: msg.message_id,
    });
  },

  async [COMMAND_TITLE.FUNNY_ANIMALS](msg) {
    const funnyAnimals = await getFunnyAnimals();

    await bot.sendPhoto(msg.chat.id, funnyAnimals, {
      reply_to_message_id: msg.message_id,
    });
  },

  async [COMMAND_TITLE.HELP](msg, commandBody) {
    const { result, shouldUseMd } = new Help(commandBody).getResult();

    await sendMessage(msg, result, {
      reply_to_message_id: msg.message_id,
      ...(shouldUseMd ? { parse_mode: 'Markdown' } : {}),
    });
  },

  async [COMMAND_TITLE.AUTH](msg, commandBody) {
    msg.chat.id === Number(process.env.ADMIN_CHAT_ID)
      ? await sendMessage(msg, new Auth(commandBody).getResult(), { parse_mode: 'HTML' })
      : await sendMessage(msg, generalMessage);
  },
};

export default commands;
