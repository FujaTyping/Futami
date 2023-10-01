const { isMessageInstance } = require('@sapphire/discord.js-utilities');
const { Command } = require('@sapphire/framework');
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const axios = require('axios')

const { color } = require('../../config.json');

class MemeCommand extends Command {
    constructor(context, options) {
        super(context, { ...options });
    }

    registerApplicationCommands(registry) {
        registry.registerChatInputCommand((builder) =>
            builder.setName('meme').setDescription('สักมีมป่าว ??')
        );
    }

    async chatInputRun(interaction) {
        const Content = new EmbedBuilder()
            .setColor(color)
            .setTitle('🖼 ระบบมีม')
            .setDescription('กำลังเลือกมีมที่ดีที่สุด ..')
            .setTimestamp()

        const msg = await interaction.reply({ embeds: [Content], fetchReply: true });

        axios.get(`https://meme-api.com/gimme`)
            .then(response => {
                const Response = response.data;

                const Content = new EmbedBuilder()
                    .setColor(color)
                    .setTitle(`🖼 ระบบมีม`)
                    .setDescription(`คำบรรยาย : **${Response.title}**`)
                    .setImage(Response.url)
                    .setTimestamp()

                const Button = new ButtonBuilder()
                    .setLabel('ดูโพสต์ใน reddit')
                    .setURL(Response.postLink)
                    .setStyle(ButtonStyle.Link);

                const Row = new ActionRowBuilder()
                    .addComponents(Button);

                return interaction.editReply({ embeds: [Content], components: [Row] });
            })
            .catch(error => {
                const Content = new EmbedBuilder()
                    .setColor(color)
                    .setTitle(`🛑 เกิดอะไรขึ้น`)
                    .setDescription("```\n" + error + "\n```")
                    .setTimestamp()

                return interaction.editReply({ embeds: [Content] });
            });
    }
}
module.exports = {
    MemeCommand
};