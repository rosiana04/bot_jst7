var express = require('express');
var r = express.Router();

// load pre-trained model
const model = require('./sdk/model.js');

// Bot Setting
const TelegramBot = require('node-telegram-bot-api');
const token = '5040677518:AAHV5a_H5BccIpJtYkUSC4GlYsIMTC9hkQw'
const bot = new TelegramBot(token, {polling: true});

state = 0;
// Main Menu Bot
bot.onText(/\/start/, (msg) => { 
    bot.sendMessage(
        msg.chat.id,
        `hello ${msg.chat.first_name}, welcome...\n
        click /predict`
    );   
    state = 0;
});

// input requires x1,x2,x3
bot.onText(/\/predict/, (msg) => { 
    bot.sendMessage(
        msg.chat.id,
        `masukan nilai x1|x2|x3 contohnya 7|7|7`
    );   
    state = 1;
});

bot.on('message', (msg) => {
    if(state == 1){
        s = msg.text.split("|");
        x1 = s[0]
        x2 = s[1]
        x3 = s[2]
        model.predict(
            [
                parseFloat(s[0]), // string to float
                parseFloat(s[1]),
                parseFloat(s[2])
            ]
        ).then((jres)=>{
                bot.sendMessage(
                    msg.chat.id,
                    `Prediksi y1 nilai ${jres[0]}`
                );
                bot.sendMessage(
                    msg.chat.id,
                    `nilai yang diprediksi y2 ${jres[1]}`
                ); 
                bot.sendMessage(
                    msg.chat.id,
                    `Prediksi y3 ${jres[2]}`
                );
        })
    }else{
        state = 0;
    }
})

// routers
// use => ...../api/predict/10/20
r.get('/predict/:x1/:x2:x3', function(req, res, next) {    
    model.predict(
        [
            parseFloat(req.params.x1), // string to float
            parseFloat(req.params.x2),
            parseFloat(req.params.x3)
        ]
    ).then((jres)=>{
        res.json(jres); // to pc / arduino
    })
});
module.exports = r;
