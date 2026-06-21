export class App {
  #modules = [];
  #bot;

  constructor(bot) {
    this.#bot = bot;
  }

  use(module) {
    this.#modules.push(module);

    return this;
  }

  init() {
    for (const module of this.#modules) {
      module.init(this.#bot);
    }
  }
}
