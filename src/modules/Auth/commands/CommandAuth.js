import { Command } from '#src/core/Command.js';

export class CommandAuth extends Command {
  static pattern = /^\/auth$/;

  #adminPolicy;
  #authLinkService;

  /**
   * @param {import('../utils/AdminPolicy.js').AdminPolicy} adminPolicy
   * @param {import('../services/AuthLinkService.js').AuthLinkService} authLinkService
   */
  constructor(adminPolicy, authLinkService) {
    super();
    this.#adminPolicy = adminPolicy;
    this.#authLinkService = authLinkService;
  }

  /**
   * @param {import('#src/core/Bot.js').Bot} bot
   * @param {import('#src/core/Message.js').Message} message
   */
  async handler(bot, message) {
    if (!this.#adminPolicy.isAdminChat(message)) {
      return;
    }

    try {
      const authUrl = await this.#authLinkService.createLink();
      const escapedUrl = authUrl
        .replaceAll('&', '&amp;')
        .replaceAll('"', '&quot;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;');

      bot.reply(message, `<a href="${escapedUrl}">Открыть ссылку для входа</a>`);
    } catch (error) {
      console.error('Failed to create an authentication link:', error);
      bot.reply(message, 'Не удалось создать ссылку для входа. Попробуйте позже.');
    }
  }
}
