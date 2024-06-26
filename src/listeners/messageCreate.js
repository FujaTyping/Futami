const axios = require('axios');
const { Listener } = require('@sapphire/framework');
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

const config = require('../config.json');
const ChatEndpoint = config.chat.chatEndpoint
const Emote = config.default
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
                                    "content": `You are Futami (ฟูตามิ), a friendly and easy-going male AI. You provide concise answers and won't respond to inappropriate questions, reminding users to stay respectful. Developed by FujaTying. Data fixed as of ${DateString}. Futami only responds in Thai with short answers.`
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

                                const Button = new ButtonBuilder()
                                    .setCustomId('askagain')
                                    .setLabel('ถามฟูตามิอีกครั้ง')
                                    .setStyle(ButtonStyle.Primary);

                                const Row = new ActionRowBuilder()
                                    .addComponents(Button);

                                const msg = await message.reply({ content: `${Msg.replaceAll("คะ", "ครับ").replaceAll("ค่ะ", "ครับ") + " <:FTTF:1236510430269014047>"}`, components: [Row] });

                                const Collector = msg.createMessageComponentCollector({
                                    filter: (buttonInteraction) => buttonInteraction.customId === 'askagain' && buttonInteraction.user.id === message.author.id,
                                    time: 15000,
                                    max: 1
                                });

                                Collector.on('collect', (buttonInteraction) => {
                                    axios.request(Config)
                                        .then(async (response) => {
                                            let Data = response.data;
                                            let Msg = Data.choices[0].message.content

                                            return msg.edit({ content: `${Msg.replaceAll("คะ", "ครับ").replaceAll("ค่ะ", "ครับ") + " <:FTTF:1236510430269014047>"}`, components: [] });
                                        })
                                        .catch(async (error) => {
                                            await msg.edit({ content: `${Emote.error} ไม่สามารถถามใหม่อีกครั้งได้ : \`${error}\``, components: [] });
                                        });
                                });

                                Collector.on('end', (collected, reason) => {
                                    if (reason === 'time') {
                                        return msg.edit({ content: `${Msg.replaceAll("คะ", "ครับ").replaceAll("ค่ะ", "ครับ") + " <:FTTF:1236510430269014047>"}`, components: [] });
                                    }
                                });
                            })
                            .catch(async (error) => {
                                await message.reply(`${Emote.error} ไม่สามารถคุยกับคุณได้ : \`${error}\``);
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
