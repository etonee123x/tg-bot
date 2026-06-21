export class Module {
  bot;

  /**
   * @param {import('#src/core/Bot.js').Bot} bot
   */
  constructor(bot) {
    this.bot = bot;
  }

  init() {
    throw new Error('Method "init" must be implemented in the subclass');
  }
}
