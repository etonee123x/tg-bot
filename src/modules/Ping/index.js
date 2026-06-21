import { Module } from '#src/core/Module.js';
import { CommandPing } from './commands/CommandPing.js';

export default class ModulePing extends Module {
  /**
   * @param {import('#src/core/Bot.js').Bot} bot
   */
  init() {
    this.bot.registerCommand(new CommandPing());
  }
}
