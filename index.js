const TelegramBot = require('node-telegram-bot-api');
const {gameOptions, againOptions} = require('options.js')
// replace the value below with the Telegram token you receive from @BotFather
const token = '1788781516:AAHjL8O9RLOty7psjRXkV7oH6tMCqmwcoQQ';

// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token, {polling: true});

let chats = {};

// let gameOptions = {
//     reply_markup: JSON.stringify({
//         inline_keyboard: [
//             [{text: '1', callback_data: '1'}, {text: '2', callback_data: '2'}, {text: '3', callback_data: '3'}],
//             [{text: '4', callback_data: '4'}, {text: '5', callback_data: '5'}, {text: '6', callback_data: '6'}],
//             [{text: '7', callback_data: '7'}, {text: '8', callback_data: '8'}, {text: '9', callback_data: '9'}],
//             [{text: '0', callback_data: '0'}],
//         ]
//     })
// }
// let againOptions = {
//     reply_markup: JSON.stringify({
//         inline_keyboard: [
//             [{text: 'Play again', callback_data: '/again'}],
//         ]
//     })
// }

bot.setMyCommands([
    {command: '/start', description: 'description of start command'},
    {command: '/some_command', description: 'description of some_command command'},
    {command: '/game', description: 'game'},
]);

let startGame = async (chatId) => {
    await bot.sendMessage(chatId, `Now I'm going to wish a number from 0 to 9`);
    let number = Math.floor(Math.random() * 10);
    chats[chatId] = number;
    await bot.sendMessage(chatId, 'Guess a number!', gameOptions)
}

let start = () => {
    bot.on('message', async (msg) => {
        // console.log(msg)
        const chatId = msg.chat.id;
        if (msg.text == '/info') return console.log(msg);
        if (msg.text == '/game') {
            return startGame(chatId);
        }
        if (msg.text == 'secret text') return bot.sendMessage(chatId, `You have just said me ${msg.text}`);
        return bot.sendMessage(chatId, 'I cannot recognize what you have just said me')
    });

    bot.on('callback_query', async msg => {
        console.log(11112)
        let data = msg.data;
        let chatId = msg.message.chat.id;
        if (data === '/again') {
            return startGame(chatId);
        }
        if (data === chats[chatId]) {
            return bot.sendMessage(chatId, `Congratulations! You have guessed a number ${chats[chatId]}!`, againOptions)
        } else {
            return bot.sendMessage(chatId, `Wrong number. Bot wished a ${chats[chatId]}`, againOptions)
        }
    })
    // bot.on('edited_message', async msg => {
    //     console.log(1111)
    // })
}

start();