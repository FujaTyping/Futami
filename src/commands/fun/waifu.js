const { isMessageInstance } = require('@sapphire/discord.js-utilities');
const { Command } = require('@sapphire/framework');
const { EmbedBuilder } = require('discord.js');
const axios = require('axios')

const config = require('../../config.json');
const color = config.chat.color
const emote = config.default

const Choices = [
    { name: 'Waifu', value: 'waifu' },
    { name: 'Neko', value: 'neko' },
    { name: 'Megumin', value: 'megumin' },
    { name: 'Shinobu', value: 'shinobu' },
    { name: 'Trap', value: 'trap' }
];
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
                            { name: 'Shinobu', value: 'shinobu' },
                            { name: 'Trap', value: 'trap' }
                        )
                        .setRequired(true)
                )
                .addStringOption((option) =>
                    option
                        .setName('mode')
                        .setDescription('ลองเลือกมาสักแบบสิ !!')
                        .addChoices(
                            { name: 'SFW', value: 'sfw' },
                            { name: 'NSFW', value: 'nsfw' }
                        )
                )
        );
    }

    async chatInputRun(interaction) {
        const Type = interaction.options.getString('type');
        const Mode = interaction.options.getString('mode') ?? 'sfw';
        const NameType = Choices.find(choice => choice.value === Type)?.name;

        if (Mode == 'sfw') {
            if (Type == 'trap') {
                const Content = new EmbedBuilder()
                    .setColor(color)
                    .setAuthor({ name: 'เตือน !!', iconURL: 'https://futami.siraphop.me/assets/icon/warning.png' })
                    .setDescription(`รูปแบบ **${NameType}** มีแค่ใน **NSFW** เท่านั้น`)
                    .setTimestamp()

                return interaction.reply({ embeds: [Content] });
            } else {
                const Content = new EmbedBuilder()
                    .setColor(color)
                    .setTitle('😇 คลังรูปภาพ Waifu')
                    .setDescription('กำลังสุ่มรูปภาพ ..')
                    .setTimestamp()

                const msg = await interaction.reply({ embeds: [Content], fetchReply: true });

                axios.get(`https://api.waifu.pics/${Mode}/${Type}`)
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
        } else {
            if (Type == 'megumin' || Type == 'shinobu') {
                const Content = new EmbedBuilder()
                    .setColor(color)
                    .setAuthor({ name: 'เตือน !!', iconURL: 'https://futami.siraphop.me/assets/icon/warning.png' })
                    .setDescription(`รูปแบบ **${NameType}** มีแค่ใน **SFW** เท่านั้น`)
                    .setTimestamp()

                return interaction.reply({ embeds: [Content] });
            } else {
                if (interaction.channel.nsfw) {
                    const Content = new EmbedBuilder()
                        .setColor(color)
                        .setTitle('🔞 คลังรูปภาพ Waifu')
                        .setDescription('กำลังสุ่มรูปภาพ ..')
                        .setTimestamp()

                    const msg = await interaction.reply({ embeds: [Content], fetchReply: true });

                    axios.get(`https://api.waifu.pics/${Mode}/${Type}`)
                        .then(response => {
                            const Response = response.data;

                            const Content = new EmbedBuilder()
                                .setColor(color)
                                .setTitle('🔞 คลังรูปภาพ Waifu')
                                .setDescription('ระวังด้วยหละภาพนี้เป็น **NSFW**')
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
                } else {
                    const Content = new EmbedBuilder()
                        .setColor(color)
                        .setAuthor({ name: 'เตือน !!', iconURL: 'https://futami.siraphop.me/assets/icon/warning.png' })
                        .setDescription(`ใช้คำสั่งนี้ด้วยโหมด **NSFW** ต้องใช้ในช่องที่จำกัดอายุเท่านั้น`)
                        .setTimestamp()

                    return interaction.reply({ embeds: [Content] });
                }
            }
        }
    }
}
module.exports = {
    WaifuCommand
};