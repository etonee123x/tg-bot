import TelegramBot from 'node-telegram-bot-api';

export const bot = new TelegramBot(String(process.env.TOKEN), { polling: true });

console.info('Bot is started!');
