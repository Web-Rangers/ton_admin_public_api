const { Telegraf } = require('telegraf')
let config = require('../config')
const fs = require('fs');

class TonBridgeStatusBot{

    constructor(){
        this.bot = new Telegraf(config.BOT_TOKEN)
        this.bot.command('/start', this.writeNewChatId)
        this.bot.launch()
    }

    sendAlert(alert_message){
        let result = this.getAllChatId().chats
        result.forEach(element => {this.bot.telegram.sendMessage(element.chat_id, alert_message)})
    }

    getAllChatId(){
        let rawdata = fs.readFileSync('./src/telegram_bot/chats.json')
        let result = JSON.parse(rawdata)
        return result
    }

    writeNewChatId(ctx){
        let chat = { chat_id: ctx.update.message.chat.id }
        let file_raw_data = fs.readFileSync('./src/telegram_bot/chats.json')
        let file_data = JSON.parse(file_raw_data)
        if (file_data.chats.some(e => e.chat_id == chat.chat_id)){
            ctx.reply('Your chat is already added!')
        } else {
            file_data.chats.push(chat)
            fs.writeFileSync('./src/telegram_bot/chats.json', JSON.stringify(file_data));
            ctx.reply('Your chat id added!')
        }
    }
}
const ton_bot = new TonBridgeStatusBot()
module.exports = ton_bot