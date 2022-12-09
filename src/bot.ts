import 'dotenv-flow/config.js';

import TelegramBot from 'node-telegram-bot-api';

export default new TelegramBot(String(process.env.TOKEN), { polling: true });
