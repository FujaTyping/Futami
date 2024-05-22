const { isMessageInstance } = require('@sapphire/discord.js-utilities');
const { Command, err } = require('@sapphire/framework');
const { EmbedBuilder } = require('discord.js');
const axios = require('axios')

const config = require('../../config.json');
const color = config.chat.color
const emote = config.default

class LyricsCommand extends Command {
    constructor(context, options) {
        super(context, { ...options });
    }

    registerApplicationCommands(registry) {
        registry.registerChatInputCommand((builder) =>
            builder.setName('lyrics').setDescription('อยากรู้จักเนื้อเพลงจัง ??')
                .addStringOption((option) =>
                    option
                        .setName('song')
                        .setDescription('เลือกเพลงมาเลย !!')
                        .setRequired(true)
                )
                .addStringOption((option) =>
                    option
                        .setName('artist')
                        .setDescription('เพลงนี้ของใคร ??')
                )
        );
    }

    async chatInputRun(interaction) {
        const Song = interaction.options.getString('song')
        const AuthorSong = interaction.options.getString('artist') ?? false;
        let Url;

        const Content = new EmbedBuilder()
            .setColor(color)
            .setTitle('🔍 ค้นหาเนื้อเพลง')
            .setDescription('กำลังค้นหาเนื้อเพลง ..')
            .setTimestamp()

        const msg = await interaction.reply({ embeds: [Content], fetchReply: true });

        if (AuthorSong) {
            Url = `/${Song}/${AuthorSong}`
        } else {
            Url = `/${Song}`
        }

        axios.get(`https://lyrist.vercel.app/api${Url}`)
            .then(response => {
                const Response = response.data;

                const Content = new EmbedBuilder()
                    .setColor(color)
                    .setTitle(`🔍 ค้นหาเนื้อเพลง`)
                    .setDescription(`เพลง : **${Response.title}**\nผู้แต่ง : \`${Response.artist}\``)
                    .setThumbnail(Response.image)
                    .addFields(
                        { name: 'เนื้อเพลง', value: `${Response.lyrics.replaceAll("[", "**[").replaceAll("]", "]**")}` }
                    )
                    .setTimestamp()

                return interaction.editReply({ embeds: [Content] });
            })
            .catch(error => {
                const Content = new EmbedBuilder()
                    .setColor(color)
                    .setTitle(`${emote.error} เกิดอะไรขึ้น`)
                    .setDescription("**เนื้อเพลงอาจจะมีความยาวเกิน 1024 ตัวอักษร\n```\n" + error + "\n```")
                    .setTimestamp()

                return interaction.editReply({ embeds: [Content] });
            });
    }
}
module.exports = {
    LyricsCommand
};