const { isMessageInstance } = require('@sapphire/discord.js-utilities');
const { Command } = require('@sapphire/framework');
const { AttachmentBuilder, EmbedBuilder } = require('discord.js');
const { registerFont, createCanvas, loadImage } = require('canvas')
require("canvas-webp");

const config = require('../../config.json');
const color = config.chat.color

//registerFont('./src/commands/fun/data/canvas/font/impact.ttf', { family: 'Impact' })

class CanvasCommand extends Command {
    constructor(context, options) {
        super(context, { ...options });
    }

    registerApplicationCommands(registry) {
        registry.registerChatInputCommand((builder) =>
            builder.setName('canvas').setDescription('ลองจินตนาการดูสิ ??')
                .addStringOption((option) =>
                    option
                        .setName('create')
                        .setDescription('เลือกรูปแบบมาเลย !!')
                        .addChoices(
                            { name: 'Stonks', value: 'stonks' },
                            { name: 'Change My Mind', value: 'changemymind' },
                            { name: 'UNO Draw 25 Cards', value: 'unodrawcards' },
                            { name: 'Waiting Skeleton', value: 'waitingskeleton' }
                        )
                        .setRequired(true)
                )
                .addUserOption((option) =>
                    option
                        .setName('user')
                        .setDescription('เลือกใคร ??')
                        .setRequired(true)
                )
                .addStringOption((option) =>
                    option
                        .setName('text')
                        .setDescription('เขียนข้อความว่าอะไรดี ??')
                        .setRequired(true)
                )
        );
    }

    async chatInputRun(interaction) {
        const Format = interaction.options.getString('create')
        const User = interaction.options.getUser('user')
        const Text = interaction.options.getString('text')

        if (Format == 'stonks') {
            const canvas = createCanvas(666, 499)
            const ctx = canvas.getContext('2d')
            loadImage('./src/commands/fun/data/canvas/Stonks.jpg').then((Bg) => {
                loadImage(`${User.avatarURL().replace(".webp", ".png")}`).then((Avatar) => {
                    ctx.drawImage(Bg, 0, 0, canvas.width, canvas.height)
                    ctx.drawImage(Avatar, 75, 35, 160, 160)
                    const TextWidth = ctx.measureText(Text).width;

                    const x = 425 - TextWidth / 2;
                    const y = 340;

                    ctx.font = '45px Impact'
                    ctx.fillStyle = 'white'
                    ctx.strokeStyle = 'rgba(0,0,0,3)'
                    ctx.fillText(Text, x, y)
                    ctx.strokeText(Text, x, y)

                    const Buffer = canvas.toBuffer('image/png')
                    const FinishImage = new AttachmentBuilder(Buffer, { name: 'Stonks.png' });

                    const Content = new EmbedBuilder()
                        .setColor(color)
                        .setTitle(`✏️ ระบบสร้างมีม`)
                        .setDescription(`คำบรรยาย : **${Text}**`)
                        .setImage('attachment://Stonks.png')
                        .setFooter({ text: `สร้างโดย : ${interaction.user.username}`, iconURL: interaction.user.avatarURL() })
                        .setTimestamp()

                    return interaction.reply({ embeds: [Content], files: [FinishImage] });
                })
            })
        } else if (Format == 'changemymind') {
            const canvas = createCanvas(577, 432)
            const ctx = canvas.getContext('2d')
            loadImage('./src/commands/fun/data/canvas/ChangeMind.jpg').then((Bg) => {
                loadImage(`${User.avatarURL().replace(".webp", ".png")}`).then((Avatar) => {
                    ctx.drawImage(Bg, 0, 0, canvas.width, canvas.height)
                    ctx.drawImage(Avatar, 195, 30, 95, 95)
                    const TextWidth = ctx.measureText(Text).width;

                    const x = 300 - TextWidth / 2;
                    const y = 365;

                    ctx.font = '45px Impact'
                    ctx.fillStyle = 'white'
                    ctx.strokeStyle = 'rgba(0,0,0,3)'
                    ctx.rotate(-0.1)
                    ctx.fillText(Text, x, y)
                    ctx.strokeText(Text, x, y)

                    const Buffer = canvas.toBuffer('image/png')
                    const FinishImage = new AttachmentBuilder(Buffer, { name: 'ChangeMyMind.png' });

                    const Content = new EmbedBuilder()
                        .setColor(color)
                        .setTitle(`✏️ ระบบสร้างมีม`)
                        .setDescription(`คำบรรยาย : **${Text}**`)
                        .setImage('attachment://ChangeMyMind.png')
                        .setFooter({ text: `สร้างโดย : ${interaction.user.username}`, iconURL: interaction.user.avatarURL() })
                        .setTimestamp()

                    return interaction.reply({ embeds: [Content], files: [FinishImage] });
                })
            })
        } else if (Format == 'unodrawcards') {
            const canvas = createCanvas(503, 496)
            const ctx = canvas.getContext('2d')
            loadImage('./src/commands/fun/data/canvas/Uno.jpg').then((Bg) => {
                loadImage(`${User.avatarURL().replace(".webp", ".png")}`).then((Avatar) => {
                    ctx.drawImage(Bg, 0, 0, canvas.width, canvas.height)
                    ctx.drawImage(Avatar, 315, 45, 100, 100)
                    const TextWidth = ctx.measureText(Text).width;

                    const x = 100 - TextWidth / 2;
                    const y = 215;

                    ctx.font = '35px Impact'
                    ctx.fillStyle = 'white'
                    ctx.strokeStyle = 'rgba(0,0,0,3)'
                    ctx.fillText(Text, x, y)
                    ctx.strokeText(Text, x, y)

                    const Buffer = canvas.toBuffer('image/png')
                    const FinishImage = new AttachmentBuilder(Buffer, { name: 'Uno.png' });

                    const Content = new EmbedBuilder()
                        .setColor(color)
                        .setTitle(`✏️ ระบบสร้างมีม`)
                        .setDescription(`คำบรรยาย : **${Text}**`)
                        .setImage('attachment://Uno.png')
                        .setFooter({ text: `สร้างโดย : ${interaction.user.username}`, iconURL: interaction.user.avatarURL() })
                        .setTimestamp()

                    return interaction.reply({ embeds: [Content], files: [FinishImage] });
                })
            })
        } else if (Format == 'waitingskeleton') {
            const canvas = createCanvas(500, 676)
            const ctx = canvas.getContext('2d')
            loadImage('./src/commands/fun/data/canvas/Skeleton.jpg').then((Bg) => {
                loadImage(`${User.avatarURL().replace(".webp", ".png")}`).then((Avatar) => {
                    ctx.drawImage(Bg, 0, 0, canvas.width, canvas.height)
                    ctx.drawImage(Avatar, 195, 80, 130, 130)
                    const TextWidth = ctx.measureText(Text).width;

                    const x = 185 - TextWidth / 2;
                    const y = 640;

                    ctx.font = '50px Impact'
                    ctx.fillStyle = 'white'
                    ctx.strokeStyle = 'rgba(0,0,0,3)'
                    ctx.fillText(Text, x, y)
                    ctx.strokeText(Text, x, y)

                    const Buffer = canvas.toBuffer('image/png')
                    const FinishImage = new AttachmentBuilder(Buffer, { name: 'Skeleton.png' });

                    const Content = new EmbedBuilder()
                        .setColor(color)
                        .setTitle(`✏️ ระบบสร้างมีม`)
                        .setDescription(`คำบรรยาย : **${Text}**`)
                        .setImage('attachment://Skeleton.png')
                        .setFooter({ text: `สร้างโดย : ${interaction.user.username}`, iconURL: interaction.user.avatarURL() })
                        .setTimestamp()

                    return interaction.reply({ embeds: [Content], files: [FinishImage] });
                })
            })
        }
    }
}
module.exports = {
    CanvasCommand
};