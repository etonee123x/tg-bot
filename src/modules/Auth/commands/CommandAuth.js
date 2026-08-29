import Jsonwebtoken from 'jsonwebtoken';

import { Command } from '#src/core/Command.js';

export class CommandAuth extends Command {
  static pattern = /^\/auth$/;

  #adminPolicy;
  #jwtSecretKey;
  #authPattern;

  /**
   * @param {import('../utils/AdminPolicy.js').AdminPolicy} adminPolicy
   * @param {string} jwtSecretKey
   * @param {string} authPattern
   */
  constructor(adminPolicy, jwtSecretKey, authPattern) {
    super();
    this.#adminPolicy = adminPolicy;
    this.#jwtSecretKey = jwtSecretKey;
    this.#authPattern = authPattern;
  }

  /**
   * @param {import('#src/core/Bot.js').Bot} bot
   * @param {import('#src/core/Message.js').Message} message
   */
  handler(bot, message) {
    if (!this.#adminPolicy.isAdminChat(message)) {
      return;
    }

    bot.reply(
      message,
      this.#authPattern.replace('{jwt}', () =>
        Jsonwebtoken.sign({ isAdmin: true }, this.#jwtSecretKey, { expiresIn: '10m' }),
      ),
    );
  }
}
