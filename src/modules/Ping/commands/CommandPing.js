import { Command } from '#src/core/Command.js';

export class CommandPing extends Command {
  static pattern = /^\/ping$/;

  /**
   * @param {import('#src/core/Bot.js').Bot} bot
   * @param {import('#src/core/Message.js').Message} message
   */
  handler(bot, message) {
    bot.reply(message, 'pong');
  }
}
