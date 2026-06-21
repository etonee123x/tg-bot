export class AdminPolicy {
  #adminChatId;

  /**
   * @param {string} adminChatId
   */
  constructor(adminChatId) {
    this.#adminChatId = adminChatId;
  }

  /**
   * @param {import('#src/core/Message.js').Message} message
   */
  isAdminChat(message) {
    return message.chatId.toString() === this.#adminChatId;
  }
}
