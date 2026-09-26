import { Module } from '#src/core/Module.js';
import { CommandAuth } from './commands/CommandAuth.js';
import { AuthLinkService } from './services/AuthLinkService.js';
import { AdminPolicy } from './utils/AdminPolicy.js';

export default class ModuleAuth extends Module {
  init() {
    const adminChatId = process.env.ADMIN_CHAT_ID;
    if (!adminChatId) {
      throw new Error('ADMIN_CHAT_ID is not set in the environment variables.');
    }

    const adminPolicy = new AdminPolicy(adminChatId);

    const apiBaseUrl = process.env.API_BASE_URL;
    if (!apiBaseUrl) {
      throw new Error('API_BASE_URL is not set in the environment variables.');
    }

    const oneTimeTokenSecret = process.env.ONE_TIME_TOKEN_SECRET;
    if (!oneTimeTokenSecret) {
      throw new Error('ONE_TIME_TOKEN_SECRET is not set in the environment variables.');
    }

    const authPattern = process.env.AUTH_PATTERN;
    if (!authPattern) {
      throw new Error('AUTH_PATTERN is not set in the environment variables.');
    }

    const authLinkService = new AuthLinkService(apiBaseUrl, oneTimeTokenSecret, authPattern);
    this.bot.registerCommand(new CommandAuth(adminPolicy, authLinkService));
  }
}
