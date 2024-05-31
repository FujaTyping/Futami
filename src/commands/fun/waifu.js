const { isMessageInstance } = require('@sapphire/discord.js-utilities');
const { Command } = require('@sapphire/framework');
const { EmbedBuilder } = require('discord.js');
const axios = require('axios')

const config = require('../../config.json');
const color = config.chat.color
const emote = config.default

class WaifuCommand extends Command {
    constructor(context, options) {
        super(context, { ...options });
    }

    registerApplicationCommands(registry) {
        registry.registerChatInputCommand((builder) =>
            builder.setName('waifu').setDescription('อยากได้รูป waifu หรอ ??')
                .addStringOption((option) =>
                    option
                        .setName('type')
                        .setDescription('อยากได้แบบไหนหละ !!')
                        .addChoices(
                            { name: 'Waifu', value: 'waifu' },
                            { name: 'Neko', value: 'neko' },
                            { name: 'Megumin', value: 'megumin' },
                            { name: 'Shinobu', value: 'shinobu' }
                        )
                        .setRequired(true)
                )
        );
    }

    async chatInputRun(interaction) {
        const Type = interaction.options.getString('type')

        const Content = new EmbedBuilder()
            .setColor(color)
            .setTitle('😇 คลังรูปภาพ Waifu')
            .setDescription('กำลังสุ่มรูปภาพ ..')
            .setTimestamp()

        const msg = await interaction.reply({ embeds: [Content], fetchReply: true });

        axios.get(`https://api.waifu.pics/sfw/${Type}`)
            .then(response => {
                const Response = response.data;

                const Content = new EmbedBuilder()
                    .setColor(color)
                    .setTitle('😇 คลังรูปภาพ Waifu')
                    .setDescription('ไม่ต้องห่วงภาพนี้ยังคงเป็น **SFW** 🙃')
                    .setImage(`${Response.url}`)
                    .setTimestamp()

                return interaction.editReply({ embeds: [Content] });
            })
            .catch(error => {
                const Content = new EmbedBuilder()
                    .setColor(color)
                    .setAuthor({ name: 'เกิดอะไรขึ้น ??', iconURL: 'https://futami.siraphop.me/assets/icon/error.png' })
                    .setDescription("```\n" + error + "\n```")
                    .setTimestamp()

                return interaction.editReply({ embeds: [Content] });
            });
    }
}
module.exports = {
    WaifuCommand
};