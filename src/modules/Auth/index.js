import { Module } from '#src/core/Module.js';
import { CommandAuth } from './commands/CommandAuth.js';
import { AdminPolicy } from './utils/AdminPolicy.js';

export default class ModuleAuth extends Module {
  init() {
    const adminChatId = process.env.ADMIN_CHAT_ID;
    if (!adminChatId) {
      throw new Error('ADMIN_CHAT_ID is not set in the environment variables.');
    }

    const adminPolicy = new AdminPolicy(adminChatId);

    const jwtSecretKey = process.env.JWT_SECRET_KEY;
    if (!jwtSecretKey) {
      throw new Error('JWT_SECRET_KEY is not set in the environment variables.');
    }

    const authPattern = process.env.AUTH_PATTERN || '<code>{jwt}</code>';

    this.bot.registerCommand(new CommandAuth(adminPolicy, jwtSecretKey, authPattern));
  }
}
