import 'dotenv/config';

import fsPromises from 'node:fs/promises';

import { Bot } from '#src/core/Bot.js';
import { App } from '#src/core/App.js';

const bot = new Bot(process.env.TOKEN);
const app = new App(bot);

const globEntries = fsPromises.glob('./src/modules/*/index.js', { eager: true, import: 'default' });

for await (const entry of globEntries) {
  const module = await import(`#${entry}`);

  app.use(new module.default(bot));
}

app.init();
