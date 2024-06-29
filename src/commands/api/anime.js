const { Subcommand } = require('@sapphire/plugin-subcommands');
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const axios = require('axios')

const config = require('../../config.json');
const color = config.chat.color
const emote = config.default
class AnimeCommand extends Subcommand {
    constructor(context, options) {
        super(context, {
            ...options,
            name: 'anime',
            subcommands: [
                {
                    name: 'search',
                    chatInputRun: 'chatInputSearch'
                },
                {
                    name: 'random',
                    chatInputRun: 'chatInputRandom'
                }
            ]
        });
    }

    registerApplicationCommands(registry) {
        registry.registerChatInputCommand((builder) =>
            builder
                .setName('anime')
                .setDescription('คำสั่งเกี่ยวกับอนิเมะ !!')
                .addSubcommand((command) =>
                    command
                        .setName('search')
                        .setDescription('อยากรู้เรื่องอนิเมะหรอ ??')
                        .addStringOption((option) =>
                            option
                                .setName('query')
                                .setDescription('ค้นหาอนิเมะเรื่องอะไรดี ??')
                                .setRequired(true)
                        )
                )
                .addSubcommand((command) =>
                    command
                        .setName('random')
                        .setDescription('สุ่มอนิเมะสักเรื่องไหม ??')
                )
        );
    }

    async chatInputSearch(interaction) {
        const Search = interaction.options.getString('query')

        const Content = new EmbedBuilder()
            .setColor(color)
            .setTitle('👦🏻 ข้อมูลอนิเมะ')
            .setDescription('กำลังค้นหาข้อมูล ..')
            .setTimestamp()

        const msg = await interaction.reply({ embeds: [Content], fetchReply: true });

        axios.get(`https://api.jikan.moe/v4/anime?q=${Search}&limit=1`)
            .then(async response => {
                const Response = response.data.data[0];

                if (!Response) {
                    const Content = new EmbedBuilder()
                        .setColor(color)
                        .setTitle('👦🏻 ข้อมูลอนิเมะ')
                        .setDescription(`ไม่พบข้อมูลของอนิเมะเรื่อง : **${Search}**\nลองเช็คดูว่าใส่ชื่ออนิเมะถูกมั้ย ??`)
                        .setTimestamp()

                    await interaction.editReply({ embeds: [Content] });
                } else {
                    const Img = new EmbedBuilder()
                        .setColor(color)
                        .setImage(Response.images.jpg.large_image_url)

                    const Content = new EmbedBuilder()
                        .setColor(color)
                        .setTitle('👦🏻 ข้อมูลอนิเมะ')
                        .setDescription(`เรื่อง : **${Response.title_english}** (${Response.title_japanese})\nประเภท : **${Response.genres[0].name}**\nคะแนน : **⭐ ${IsNull(Response.score)}**\nรูปแบบ : **${Response.type}** (${Response.source})\nความรุนแรง : **${Response.rating}**\n\nทั้งหมดมี \`${Response.episodes}\` ตอน **${Response.airing ? 'ขณะนี้ กำลังดำเนินเนื้อเรื่องอยู่' : 'เนื้อเรื่องไม่ได้ออกอากาศต่อแล้ว'}** (${Response.year})`)
                        .setFooter({ text: `${Response.producers[0].name} • ${Response.studios[0].name}` })
                        .setTimestamp()

                    const MoreInfo = new ButtonBuilder()
                        .setLabel('ดูข้อมูลเพิ่มเติม')
                        .setURL(Response.url)
                        .setStyle(ButtonStyle.Link);

                    const Info = new ButtonBuilder()
                        .setCustomId('synopsis')
                        .setLabel('ดูเรื่องย่อ')
                        .setStyle(ButtonStyle.Secondary);

                    if (Response.trailer.url) {
                        const Trailer = new ButtonBuilder()
                            .setLabel('ดูวีดีโอตัวอย่าง')
                            .setURL(Response.trailer.url)
                            .setStyle(ButtonStyle.Link);

                        const Row = new ActionRowBuilder()
                            .addComponents(Info, MoreInfo, Trailer);

                        await interaction.editReply({ embeds: [Img, Content], components: [Row] });
                    } else {
                        const Row = new ActionRowBuilder()
                            .addComponents(Info, MoreInfo);

                        await interaction.editReply({ embeds: [Img, Content], components: [Row] });
                    }

                    const Collector = msg.createMessageComponentCollector({
                        filter: (buttonInteraction) => buttonInteraction.customId === 'synopsis' && buttonInteraction.user.id === interaction.user.id,
                        time: 60000,
                        max: 1
                    });

                    Collector.on('collect', (buttonInteraction) => {
                        const Content = new EmbedBuilder()
                            .setColor(color)
                            .setTitle('👦🏻 ข้อมูลอนิเมะ')
                            .setDescription(`เรื่อง : **${Response.title_english}** (${Response.title_japanese})\nประเภท : **${Response.genres[0].name}**\nคะแนน : **⭐ ${IsNull(Response.score)}**\nรูปแบบ : **${Response.type}** (${Response.source})\nความรุนแรง : **${Response.rating}**\n\n**เรื่องย่อ** : ${Response.synopsis.replace(/\[Written by MAL Rewrite\]/g, '').trim()}\n\nทั้งหมดมี \`${Response.episodes}\` ตอน **${Response.airing ? 'ขณะนี้ กำลังดำเนินเนื้อเรื่องอยู่' : 'เนื้อเรื่องไม่ได้ออกอากาศต่อแล้ว'}** (${Response.year})`)
                            .setFooter({ text: `${Response.producers[0].name} • ${Response.studios[0].name}` })
                            .setTimestamp()

                        const Info = new ButtonBuilder()
                            .setCustomId('synopsis')
                            .setLabel('ดูเรื่องย่อ')
                            .setStyle(ButtonStyle.Secondary)
                            .setDisabled(true);

                        if (Response.trailer.url) {
                            const Trailer = new ButtonBuilder()
                                .setLabel('ดูวีดีโอตัวอย่าง')
                                .setURL(Response.trailer.url)
                                .setStyle(ButtonStyle.Link);

                            const Row = new ActionRowBuilder()
                                .addComponents(Info, MoreInfo, Trailer);

                            return interaction.editReply({ embeds: [Img, Content], components: [Row] });
                        } else {
                            const Row = new ActionRowBuilder()
                                .addComponents(Info, MoreInfo);

                            return interaction.editReply({ embeds: [Img, Content], components: [Row] });
                        }
                    });

                    Collector.on('end', (collected, reason) => {
                        if (reason === 'time') {
                            const Info = new ButtonBuilder()
                                .setCustomId('synopsis')
                                .setLabel('ดูเรื่องย่อ')
                                .setStyle(ButtonStyle.Secondary)
                                .setDisabled(true);

                            if (Response.trailer.url) {
                                const Trailer = new ButtonBuilder()
                                    .setLabel('ดูวีดีโอตัวอย่าง')
                                    .setURL(Response.trailer.url)
                                    .setStyle(ButtonStyle.Link);

                                const Row = new ActionRowBuilder()
                                    .addComponents(Info, MoreInfo, Trailer);

                                return interaction.editReply({ embeds: [Img, Content], components: [Row] });
                            } else {
                                const Row = new ActionRowBuilder()
                                    .addComponents(Info, MoreInfo);

                                return interaction.editReply({ embeds: [Img, Content], components: [Row] });
                            }
                        }
                    });
                }
            })
            .catch(error => {
                const Content = new EmbedBuilder()
                    .setColor(color)
                    .setAuthor({ name: 'เกิดอะไรขึ้น ??', iconURL: 'https://futami.siraphop.me/assets/icon/error.png' })
                    .setDescription("**ลองเช็คดูว่าใส่ชื่ออนิเมะถูกไหม\n```\n" + error + "\n```")
                    .setTimestamp()

                return interaction.editReply({ embeds: [Content] });
            });
    }

    async chatInputRandom(interaction) {
        const Content = new EmbedBuilder()
            .setColor(color)
            .setTitle('👦🏻 ข้อมูลอนิเมะ')
            .setDescription('กำลังสุ่มอนิเมะ ..')
            .setTimestamp()

        const msg = await interaction.reply({ embeds: [Content], fetchReply: true });

        axios.get(`https://api.jikan.moe/v4/random/anime`)
            .then(async response => {
                const Response = response.data.data;

                const Img = new EmbedBuilder()
                    .setColor(color)
                    .setImage(Response.images.jpg.large_image_url)

                const Content = new EmbedBuilder()
                    .setColor(color)
                    .setTitle('👦🏻 ข้อมูลอนิเมะ')
                    .setDescription(`เรื่อง : **${IsNull(Response.title_english)}** (${Response.title_japanese})\nประเภท : **${Response.genres[0].name}**\nคะแนน : **⭐ ${IsNull(Response.score)}**\nรูปแบบ : **${Response.type}** (${Response.source})\nความรุนแรง : **${Response.rating}**\n\nทั้งหมดมี \`${Response.episodes}\` ตอน **${Response.airing ? 'ขณะนี้ กำลังดำเนินเนื้อเรื่องอยู่' : 'เนื้อเรื่องไม่ได้ออกอากาศต่อแล้ว'}** (${IsNull(Response.year)})`)
                    .setTimestamp()

                const MoreInfo = new ButtonBuilder()
                    .setLabel('ดูข้อมูลเพิ่มเติม')
                    .setURL(Response.url)
                    .setStyle(ButtonStyle.Link);

                const Info = new ButtonBuilder()
                    .setCustomId('synopsis')
                    .setLabel('ดูเรื่องย่อ')
                    .setStyle(ButtonStyle.Secondary);

                if (Response.trailer.url) {
                    const Trailer = new ButtonBuilder()
                        .setLabel('ดูวีดีโอตัวอย่าง')
                        .setURL(Response.trailer.url)
                        .setStyle(ButtonStyle.Link);

                    const Row = new ActionRowBuilder()
                        .addComponents(Info, MoreInfo, Trailer);

                    await interaction.editReply({ embeds: [Img, Content], components: [Row] });
                } else {
                    const Row = new ActionRowBuilder()
                        .addComponents(Info, MoreInfo);

                    await interaction.editReply({ embeds: [Img, Content], components: [Row] });
                }

                const Collector = msg.createMessageComponentCollector({
                    filter: (buttonInteraction) => buttonInteraction.customId === 'synopsis' && buttonInteraction.user.id === interaction.user.id,
                    time: 60000,
                    max: 1
                });

                Collector.on('collect', (buttonInteraction) => {
                    const Content = new EmbedBuilder()
                        .setColor(color)
                        .setTitle('👦🏻 ข้อมูลอนิเมะ')
                        .setDescription(`เรื่อง : **${IsNull(Response.title_english)}** (${Response.title_japanese})\nประเภท : **${Response.genres[0].name}**\nคะแนน : **⭐ ${IsNull(Response.score)}**\nรูปแบบ : **${Response.type}** (${Response.source})\nความรุนแรง : **${Response.rating}**\n\n**เรื่องย่อ** : ${Response.synopsis.replace(/\[Written by MAL Rewrite\]/g, '').trim()}\n\nทั้งหมดมี \`${Response.episodes}\` ตอน **${Response.airing ? 'ขณะนี้ กำลังดำเนินเนื้อเรื่องอยู่' : 'เนื้อเรื่องไม่ได้ออกอากาศต่อแล้ว'}** (${IsNull(Response.year)})`)
                        .setTimestamp()

                    const Info = new ButtonBuilder()
                        .setCustomId('synopsis')
                        .setLabel('ดูเรื่องย่อ')
                        .setStyle(ButtonStyle.Secondary)
                        .setDisabled(true);

                    if (Response.trailer.url) {
                        const Trailer = new ButtonBuilder()
                            .setLabel('ดูวีดีโอตัวอย่าง')
                            .setURL(Response.trailer.url)
                            .setStyle(ButtonStyle.Link);

                        const Row = new ActionRowBuilder()
                            .addComponents(Info, MoreInfo, Trailer);

                        return interaction.editReply({ embeds: [Img, Content], components: [Row] });
                    } else {
                        const Row = new ActionRowBuilder()
                            .addComponents(Info, MoreInfo);

                        return interaction.editReply({ embeds: [Img, Content], components: [Row] });
                    }
                });

                Collector.on('end', (collected, reason) => {
                    if (reason === 'time') {
                        const Info = new ButtonBuilder()
                            .setCustomId('synopsis')
                            .setLabel('ดูเรื่องย่อ')
                            .setStyle(ButtonStyle.Secondary)
                            .setDisabled(true);

                        if (Response.trailer.url) {
                            const Trailer = new ButtonBuilder()
                                .setLabel('ดูวีดีโอตัวอย่าง')
                                .setURL(Response.trailer.url)
                                .setStyle(ButtonStyle.Link);

                            const Row = new ActionRowBuilder()
                                .addComponents(Info, MoreInfo, Trailer);

                            return interaction.editReply({ embeds: [Img, Content], components: [Row] });
                        } else {
                            const Row = new ActionRowBuilder()
                                .addComponents(Info, MoreInfo);

                            return interaction.editReply({ embeds: [Img, Content], components: [Row] });
                        }
                    }
                });
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
function IsNull(Text) {
    if (Text == null || Text == 'null' || Text == undefined || Text == 'undefined' || !Text) {
        return '-'
    }
}
module.exports = {
    AnimeCommand
};