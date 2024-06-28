const axios = require('axios');
const { Listener } = require('@sapphire/framework');
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

const config = require('../config.json');
const ChatEndpoint = config.chat.chatEndpoint
const color = config.chat.color
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
                                let ContentMsg = Msg.replaceAll("คะ", "ครับ").replaceAll("ค่ะ", "ครับ")

                                const Content = new EmbedBuilder()
                                    .setColor(color)
                                    .setAuthor({ name: `${ContentMsg}`, iconURL: 'https://futami.siraphop.me/assets/icon/typoon.png' })

                                const Button = new ButtonBuilder()
                                    .setCustomId('askagain')
                                    .setLabel('ถามอีกครั้ง')
                                    .setStyle(ButtonStyle.Secondary);

                                const Row = new ActionRowBuilder()
                                    .addComponents(Button);

                                const msg = await message.reply({ embeds: [Content], components: [Row] });

                                const Collector = msg.createMessageComponentCollector({
                                    filter: (buttonInteraction) => buttonInteraction.customId === 'askagain' && buttonInteraction.user.id === message.author.id,
                                    time: 20000,
                                    max: 1
                                });

                                Collector.on('collect', (buttonInteraction) => {
                                    axios.request(Config)
                                        .then(async (response) => {
                                            let Data = response.data;
                                            let Msg = Data.choices[0].message.content
                                            let ContentMsg = Msg.replaceAll("คะ", "ครับ").replaceAll("ค่ะ", "ครับ")

                                            const Content = new EmbedBuilder()
                                                .setColor(color)
                                                .setAuthor({ name: `${ContentMsg}`, iconURL: 'https://futami.siraphop.me/assets/icon/typoon.png' })

                                            return msg.edit({ embeds: [Content], components: [] });
                                        })
                                        .catch(async (error) => {
                                            const Content = new EmbedBuilder()
                                                .setColor(color)
                                                .setAuthor({ name: `ตอนนี้ไม่สามารถคุยกับคุณได้`, iconURL: 'https://futami.siraphop.me/assets/icon/error.png' })
                                                .setDescription("```\n" + error + "\n```")

                                            await msg.edit({ embeds: [Content], components: [] });
                                        });
                                });

                                Collector.on('end', (collected, reason) => {
                                    if (reason === 'time') {
                                        return msg.edit({ embeds: [Content], components: [] });
                                    }
                                });
                            })
                            .catch(async (error) => {
                                const Content = new EmbedBuilder()
                                    .setColor(color)
                                    .setAuthor({ name: `ตอนนี้ไม่สามารถคุยกับคุณได้`, iconURL: 'https://futami.siraphop.me/assets/icon/error.png' })
                                    .setDescription("```\n" + error + "\n```")

                                await message.reply({ embeds: [Content] });
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
