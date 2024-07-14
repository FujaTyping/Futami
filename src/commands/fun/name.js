const { Command, container } = require('@sapphire/framework');
const { EmbedBuilder } = require('discord.js');
const axios = require('axios')

const config = require('../../config.json');
const color = config.chat.color
const emote = config.default

class DMCommand extends Command {
    constructor(context, options) {
        super(context, {
            ...options,
            name: 'name',
            aliases: ['n'],
            description: 'nationalize name'
        });
    }

    async messageRun(message, args) {
        const Args = await args.rest('string');
        console.log(Args)

        const Content = new EmbedBuilder()
            .setColor(color)
            .setTitle('✒️  วิเคราห์ชื่อ')
            .setDescription(`กำลังวิเคราห์ชื่อ ${Args}  ..`)
            .setTimestamp()

        const msg = await message.reply({ embeds: [Content], fetchReply: true });

        axios.get(`https://api.nationalize.io/?name=${Args}`)
            .then(response => {
                const Response = response.data.country;
                let Report = '';

                Response.forEach((country, index) => {
                  const LineNumber = index + 1;
                  const CountryCode = country.country_id.toLowerCase();
                  const Probability = country.probability.toFixed(4);

                  Report += `**${LineNumber}.** :flag_${CountryCode}: (${country.country_id.toLowerCase()}) ความเป็นไปได้ : \`${Probability}\`\n`;
                });

                const Content = new EmbedBuilder()
                    .setColor(color)
                    .setTitle(`✒️ วิเคราห์ชื่อ`)
                    .setDescription(`ผลการวิเคราห์ชื่อ : **${Args}**\n` + Report)
                    .setTimestamp()

                return msg.edit({ embeds: [Content] });
            })
            .catch(error => {
                console.log(error)
                const Content = new EmbedBuilder()
                    .setColor(color)
                    .setAuthor({ name: 'เกิดอะไรขึ้น ??', iconURL: 'https://futami.siraphop.me/assets/icon/error.png' })
                    .setDescription("```\n" + error + "\n```")
                    .setTimestamp()

                return msg.edit({ embeds: [Content] });
            });
    }
}
module.exports = {
    DMCommand
};
