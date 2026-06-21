import TelegramBot from 'node-telegram-bot-api';
import { Message } from '#src/core/Message.js';

export class Bot {
  #_;
  /**
   * @param {string} token
   */
  constructor(token) {
    this.#_ = new TelegramBot(token, { polling: true });
  }

  /**
   * @param {import('#src/core/Command.js').Command} command
   */
  registerCommand(command) {
    this.#_.onText(command.pattern, (message) => {
      command.handler(this, new Message(message));
    });
  }

  /**
   * @param {Message} message
   * @param {string} text
   */
  reply(message, text) {
    this.#_.sendMessage(message.chatId, text, { reply_parameters: { message_id: message.id }, parse_mode: 'HTML' });
  }
}
