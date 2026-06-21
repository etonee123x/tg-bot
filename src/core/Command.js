export class Command {
  constructor() {
    if (new.target === Command) {
      throw new TypeError('Cannot construct Command instances directly');
    }
  }

  /**
   * @returns {RegExp}
   */
  get pattern() {
    if (!this.constructor.pattern) {
      throw new Error('Pattern must be defined in the subclass');
    }

    if (Object.prototype.toString.call(this.constructor.pattern) !== '[object RegExp]') {
      throw new Error('Pattern must be a RegExp');
    }

    return this.constructor.pattern;
  }

  /**
   * @abstract
   */
  handler() {
    throw new Error('Handler method must be implemented in the subclass');
  }
}
