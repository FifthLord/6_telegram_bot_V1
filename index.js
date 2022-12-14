const TelegramApi = require('node-telegram-bot-api')
const { gameOptions, againOptions } = require('./options')
const token = '5611180970:AAHIblsTXNySzrfQodHf7PcGDNJ0gcHLjeo'

const bot = new TelegramApi(token, { polling: true })

const chats = {}


bot.setMyCommands([
   { command: '/start', description: 'Початкове привітання' },
   { command: '/info', description: 'Інформація про користувача' },
   { command: '/game', description: 'Вгадай число' }
])
const startGame = async (chatId) => {
   await bot.sendMessage(chatId, `♂️ Вгадай число від 0 до 9 ♂️`)
   const randomNumber = Math.floor(Math.random() * 10)
   chats[chatId] = randomNumber;
   await bot.sendMessage(chatId, '♂️Нумо, погнали!♂️', gameOptions)
}

const start = () => {
   bot.on('message', async msg => {
      const text = msg.text;
      const chatId = msg.chat.id;
      if (text === '/start') {
         await bot.sendSticker(chatId, `https://tlgrm.ru/_/stickers/fd8/a62/fd8a62f8-8335-4439-867d-cc88ddbfab50/4.webp`)
         return bot.sendMessage(chatId, `♂️Welcome to the club buddy♂️`)
      }
      if (text === '/info') {
         return bot.sendMessage(chatId, `Тебе звати ♂️${msg.from.first_name} ${msg.from.last_name}♂️`)
      }
      if (text === '/game') {
         return startGame(chatId);
      }
      return bot.sendMessage(chatId, `Ти написав мені ♂️${text}♂️`)
   })

   bot.on('callback_query', async msg => {
      const data = msg.data;
      const chatId = msg.message.chat.id;
      if (data === '/again') {
         return startGame(chatId);
      }
      await bot.sendMessage(chatId, `Ти обрав число ♂️${data}♂️`)
      if (data === chats[chatId]) {
         return await bot.sendMessage(chatId, `Вітаю, ти вгадав число ♂️${chats[chatId]}♂️`, againOptions)
      } else {
         return bot.sendMessage(chatId, `Нажаль ти не вгадав число, DungeonMaster загадав ♂️${chats[chatId]}♂️`, againOptions)
      }
   })
}

start()