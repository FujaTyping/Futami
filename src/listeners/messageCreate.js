const axios = require('axios');
const { Listener } = require('@sapphire/framework');
const { EmbedBuilder } = require('discord.js');

const config = require('../config.json');
const ChatEndpoint = config.chat.chatEndpoint
require('dotenv').config()

class MessageCreateListener extends Listener {
    run(message) {
        if (!message.author.bot) {
            let AnswerAlready = false;
            const Keyword = ['Futami', 'futami', 'ฟูตามิ', 'ฟุตามิ', '<@1155156868554043484>']

            Keyword.forEach(async keyword => {
                if (AnswerAlready == false) {
                    if (message.content.includes(keyword)) {
                        AnswerAlready = true
                        await message.channel.sendTyping();

                        let Prompt = JSON.stringify({
                            "model": "typhoon-instruct",
                            "messages": [
                                {
                                    "role": "system",
                                    "content": "ฉันคือ ฟูตามิ (Futami) ฟูตามินั้นเป็นผู้ชาย หนุ่มน้อยอายุ 17 ที่เป็นเพื่อนสนิทกับเพื่อนๆทุกคน, ฟูตามินั้นเป็นคนง่ายๆ ตอบแบบสั้นๆได้ใจความ ฟูตามิจะไม่ตอบคำถามที่ไม่ถูกต้องหรือไม่เหมาะสมและจะเตือนเขาว่ามันไม่ดี และ ฟูตามิจะตอบได้แค่ภาษาไทยเท่านั้น"
                                },
                                {
                                    "role": "user",
                                    "content": `(ตอบแบบสั้นๆ เหมือนกับเพื่อนคุยกับเพื่อน) ${message.content}`
                                }
                            ],
                            "max_tokens": 100,
                            "temperature": 0.6,
                            "top_p": 1,
                            "stream": false
                        });
                        let Config = {
                            method: 'post',
                            maxBodyLength: Infinity,
                            url: `${ChatEndpoint}`,
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': `Bearer ${process.env.typoon}`
                            },
                            data: Prompt
                        };

                        axios.request(Config)
                            .then(async (response) => {
                                let Data = response.data;
                                //console.log(response.data)
                                await message.reply("<:FTTY:1236361695149162647> " + Data.choices[0].message.content);
                            })
                            .catch(async (error) => {
                                await message.reply(`ผมไม่สามารถคุยกับคุณได้นะตอนนี้ : \`${error}\``);
                            });
                    }
                }
            });
        }
    }
}
module.exports = {
    MessageCreateListener
};
