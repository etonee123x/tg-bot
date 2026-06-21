export class Message {
  #_;

  /**
   * @param {import('node-telegram-bot-api').Message} message
   */
  constructor(message) {
    this.#_ = message;
  }

  get id() {
    return this.#_.message_id;
  }

  get chatId() {
    return this.#_.chat.id;
  }
}
