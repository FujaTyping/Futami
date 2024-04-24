const axios = require('axios');
const { Listener } = require('@sapphire/framework');
const { EmbedBuilder } = require('discord.js');
const { name, color } = require('../config.json');

require('dotenv').config()
const { ChatEndpoint } = require('../config.json');

class MessageCreateListener extends Listener {
    run(message) {
        if (!message.author.bot) {
            const Keyword = ['Futami', 'futami', 'ฟูตามิ', '<@1155156868554043484>']

            Keyword.forEach(async keyword => {
                if (message.content.includes(keyword)) {
                    await message.channel.sendTyping();

                    let Prompt = JSON.stringify({
                        "model": "typhoon-instruct",
                        "messages": [
                            {
                                "role": "system",
                                "content": "ฉันคือ ฟูตามิ (Futami) ฟูตามินั้นเป็นผู้ชาย หนุ่มน้อยอายุ 17 ที่เป็นเพื่อนสนิทกับเพื่อนๆทุกคน, ฟูตามินั้นเป็นคนง่ายๆ ตอบแบบสั้นๆได้ใจความ ฟูตามิจะไม่ตอบคำถามที่ไม่ถูกต้องและจะเตือนเขาว่ามันไม่ดี และ ฟูตามิจะตอบได้แค่ภาษาไทยเท่านั้น"
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
                            await message.reply(Data.choices[0].message.content);
                        })
                        .catch(async (error) => {
                            await message.reply(`ผมไม่สามารถคุยกับคุณได้นะตอนนี้ : \`${error}\``);
                        });
                }
            });
        }
    }
}
module.exports = {
    MessageCreateListener
};
