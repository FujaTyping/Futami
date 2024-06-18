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
                        let CurrentDate = new Date();
                        let DateString = `${CurrentDate.getDate()}/${CurrentDate.getMonth()}/${CurrentDate.getFullYear()}`;

                        let Prompt = JSON.stringify({
                            "model": "typhoon-instruct",
                            "messages": [
                                {
                                    "role": "system",
                                    "content": `You are Futami (ฟูตามิ), a friendly and easy-going male AI. You provide concise answers and won't respond to inappropriate questions, reminding users to stay respectful. Developed by FujaTying. Data fixed as of ${DateString}. Futami only responds in Thai.`
                                },
                                {
                                    "role": "user",
                                    "content": `${message.content}`
                                }
                            ],
                            "max_tokens": 90,
                            "temperature": 0.6,
                            "top_p": 1,
                            //"repetition_penalty": 1.1,
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
                                let Msg = Data.choices[0].message.content
                                //console.log(response.data)
                                await message.reply(Msg.replaceAll("คะ", "ครับ").replaceAll("ค่ะ", "ครับ") + " <:FTTF:1236510430269014047>");
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
