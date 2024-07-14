const { isMessageInstance } = require('@sapphire/discord.js-utilities');
const { Command } = require('@sapphire/framework');
const { AttachmentBuilder, EmbedBuilder } = require('discord.js');
const { GlobalFonts, createCanvas, loadImage } = require('@napi-rs/canvas')

const config = require('../../config.json');
const color = config.chat.color

GlobalFonts.registerFromPath('./src/commands/fun/data/canvas/font/impact.ttf', 'Impact')

const Choices = [
    { name: 'Stonks', value: 'stonks' },
    { name: 'Change My Mind', value: 'changemymind' },
    { name: 'UNO Draw 25 Cards', value: 'unodrawcards' },
    { name: 'Waiting Skeleton', value: 'waitingskeleton' },
    { name: 'Unsettled Tom', value: 'unsettledtom' },
    { name: 'I Am Once Again Asking', value: 'iamonceagainasking' },
    { name: 'Surprised Pikachu', value: 'surprisedpikachu' },
    { name: 'This is Worthless', value: 'thisisworthless' },
    { name: 'Dr Evil air quotes', value: 'drevilairquotes' },
    { name: "Now That’s What I Call", value: 'nowthatswhaticall' }
];

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
                        .addChoices(Choices)
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
                .addStringOption((option) =>
                    option
                        .setName('text-bottom')
                        .setDescription('เขียนข้อความบรรทัดที่ 2 ว่าอะไรดี ??')
                )
        );
    }

    async chatInputRun(interaction) {
        const Format = interaction.options.getString('create')
        const User = interaction.options.getUser('user')
        const Text = interaction.options.getString('text')
        const Text2 = interaction.options.getString('text-bottom') ?? false;

        const Content = new EmbedBuilder()
            .setColor(color)
            .setTitle('✏️ ระบบสร้างมีม')
            .setDescription('กำลังสร้างมีม รอแปปนึง ..')
            .setTimestamp()

        const msg = await interaction.reply({ embeds: [Content], fetchReply: true });

        if (Format == 'stonks') {
            const canvas = createCanvas(666, 499)
            const ctx = canvas.getContext('2d')

            const Bg = await loadImage('./src/commands/fun/data/canvas/Stonks.jpg')
            const Avatar = await loadImage(`${User.avatarURL().replace(".webp", ".png")}`)

            ctx.drawImage(Bg, 0, 0, canvas.width, canvas.height)
            ctx.drawImage(Avatar, 75, 35, 160, 160)
            const TextWidth = ctx.measureText(Text).width;

            const x = 500;
            const y = 340;

            ctx.font = '45px Impact'
            ctx.fillStyle = 'white'
            ctx.strokeStyle = 'rgba(0,0,0,3)'
            ctx.textAlign = 'center'
            ctx.fillText(Text, x, y)
            ctx.strokeText(Text, x, y)

            const Buffer = canvas.toBuffer('image/png')
            const FinishImage = new AttachmentBuilder(Buffer, { name: 'Stonks.png' });

            const Content = new EmbedBuilder()
                .setColor(color)
                .setTitle(`✏️ ระบบสร้างมีม`)
                .setDescription(`คำบรรยาย : (${User}) **${Text}**`)
                .setImage('attachment://Stonks.png')
                .setFooter({ text: `สร้างโดย : ${interaction.user.username}`, iconURL: interaction.user.avatarURL() })
                .setTimestamp()

            return interaction.editReply({ embeds: [Content], files: [FinishImage] });
        } else if (Format == 'changemymind') {
            const canvas = createCanvas(577, 432)
            const ctx = canvas.getContext('2d')

            const Bg = await loadImage('./src/commands/fun/data/canvas/ChangeMind.jpg')
            const Avatar = await loadImage(`${User.avatarURL().replace(".webp", ".png")}`)

            ctx.drawImage(Bg, 0, 0, canvas.width, canvas.height)
            ctx.drawImage(Avatar, 195, 30, 95, 95)
            const TextWidth = ctx.measureText(Text).width;

            const x = 350;
            const y = 370;

            ctx.font = '45px Impact'
            ctx.fillStyle = 'white'
            ctx.strokeStyle = 'rgba(0,0,0,3)'
            ctx.textAlign = 'center'
            ctx.rotate(-0.1)
            ctx.fillText(Text, x, y)
            ctx.strokeText(Text, x, y)

            const Buffer = canvas.toBuffer('image/png')
            const FinishImage = new AttachmentBuilder(Buffer, { name: 'ChangeMyMind.png' });

            const Content = new EmbedBuilder()
                .setColor(color)
                .setTitle(`✏️ ระบบสร้างมีม`)
                .setDescription(`คำบรรยาย : (${User}) **${Text}**`)
                .setImage('attachment://ChangeMyMind.png')
                .setFooter({ text: `สร้างโดย : ${interaction.user.username}`, iconURL: interaction.user.avatarURL() })
                .setTimestamp()

            return interaction.editReply({ embeds: [Content], files: [FinishImage] });
        } else if (Format == 'unodrawcards') {
            const canvas = createCanvas(503, 496)
            const ctx = canvas.getContext('2d')

            const Bg = await loadImage('./src/commands/fun/data/canvas/Uno.jpg')
            const Avatar = await loadImage(`${User.avatarURL().replace(".webp", ".png")}`)

            ctx.drawImage(Bg, 0, 0, canvas.width, canvas.height)
            ctx.drawImage(Avatar, 315, 45, 100, 100)
            const TextWidth = ctx.measureText(Text).width;

            let x;
            let y;

            if (!Text2) {
                x = 150;
                y = 215;
            } else {
                x = 150 + 10;
                y = 195;
            }

            ctx.font = '35px Impact'
            ctx.fillStyle = 'white'
            ctx.strokeStyle = 'rgba(0,0,0,3)'
            ctx.textAlign = 'center'
            ctx.fillText(Text, x, y)
            ctx.strokeText(Text, x, y)
            if (Text2) {
                ctx.fillText(Text2, x - 10, y + 35)
                ctx.strokeText(Text2, x - 10, y + 35)
            }

            const Buffer = canvas.toBuffer('image/png')
            const FinishImage = new AttachmentBuilder(Buffer, { name: 'Uno.png' });

            if (Text2) {
                const Content = new EmbedBuilder()
                    .setColor(color)
                    .setTitle(`✏️ ระบบสร้างมีม`)
                    .setDescription(`คำบรรยาย : (${User}) **${Text} ${Text2}**`)
                    .setImage('attachment://Uno.png')
                    .setFooter({ text: `สร้างโดย : ${interaction.user.username}`, iconURL: interaction.user.avatarURL() })
                    .setTimestamp()

                return interaction.editReply({ embeds: [Content], files: [FinishImage] });
            } else {
                const Content = new EmbedBuilder()
                    .setColor(color)
                    .setTitle(`✏️ ระบบสร้างมีม`)
                    .setDescription(`คำบรรยาย : (${User}) **${Text}**`)
                    .setImage('attachment://Uno.png')
                    .setFooter({ text: `สร้างโดย : ${interaction.user.username}`, iconURL: interaction.user.avatarURL() })
                    .setTimestamp()

                return interaction.editReply({ embeds: [Content], files: [FinishImage] });
            }
        } else if (Format == 'waitingskeleton') {
            const canvas = createCanvas(500, 676)
            const ctx = canvas.getContext('2d')

            const Bg = await loadImage('./src/commands/fun/data/canvas/Skeleton.jpg')
            const Avatar = await loadImage(`${User.avatarURL().replace(".webp", ".png")}`)

            ctx.drawImage(Bg, 0, 0, canvas.width, canvas.height)
            ctx.drawImage(Avatar, 195, 80, 130, 130)
            const TextWidth = ctx.measureText(Text).width;

            const x = canvas.width / 2;
            const y = 640;

            ctx.font = '50px Impact'
            ctx.fillStyle = 'white'
            ctx.strokeStyle = 'rgba(0,0,0,3)'
            ctx.textAlign = 'center'
            ctx.fillText(Text, x, y)
            ctx.strokeText(Text, x, y)

            const Buffer = canvas.toBuffer('image/png')
            const FinishImage = new AttachmentBuilder(Buffer, { name: 'Skeleton.png' });

            const Content = new EmbedBuilder()
                .setColor(color)
                .setTitle(`✏️ ระบบสร้างมีม`)
                .setDescription(`คำบรรยาย : (${User}) **${Text}**`)
                .setImage('attachment://Skeleton.png')
                .setFooter({ text: `สร้างโดย : ${interaction.user.username}`, iconURL: interaction.user.avatarURL() })
                .setTimestamp()

            return interaction.editReply({ embeds: [Content], files: [FinishImage] });
        } else if (Format == 'unsettledtom') {
            const canvas = createCanvas(618, 499)
            const ctx = canvas.getContext('2d')

            const Bg = await loadImage('./src/commands/fun/data/canvas/Tom.jpg')

            ctx.drawImage(Bg, 0, 0, canvas.width, canvas.height)
            const TextWidth = ctx.measureText(Text).width;

            const x = canvas.width / 2;
            const y = 63;

            ctx.font = '53px Impact'
            ctx.fillStyle = 'white'
            ctx.strokeStyle = 'rgba(0,0,0,3)'
            ctx.textAlign = 'center'
            ctx.fillText(Text, x, y)
            ctx.strokeText(Text, x, y)

            const Buffer = canvas.toBuffer('image/png')
            const FinishImage = new AttachmentBuilder(Buffer, { name: 'Tom.png' });

            const Content = new EmbedBuilder()
                .setColor(color)
                .setTitle(`✏️ ระบบสร้างมีม`)
                .setDescription(`คำบรรยาย : (${User}) **${Text}**`)
                .setImage('attachment://Tom.png')
                .setFooter({ text: `สร้างโดย : ${interaction.user.username}`, iconURL: interaction.user.avatarURL() })
                .setTimestamp()

            return interaction.editReply({ embeds: [Content], files: [FinishImage] });
        } else if (Format == 'surprisedpikachu') {
            const canvas = createCanvas(500, 500)
            const ctx = canvas.getContext('2d')

            const Bg = await loadImage('./src/commands/fun/data/canvas/Pikachu.jpg')

            ctx.drawImage(Bg, 0, 0, canvas.width, canvas.height)
            const TextWidth = ctx.measureText(Text).width;

            let x = canvas.width / 2;
            let y;

            if (!Text2) {
                y = 120;
            } else {
                y = 90;
            }

            ctx.font = '50px Impact'
            ctx.fillStyle = 'white'
            ctx.strokeStyle = 'rgba(0,0,0,3)'
            ctx.textAlign = 'center'
            ctx.fillText(Text, x, y)
            ctx.strokeText(Text, x, y)
            if (Text2) {
                ctx.fillText(Text2, x, y + 55)
                ctx.strokeText(Text2, x, y + 55)
            }

            const Buffer = canvas.toBuffer('image/png')
            const FinishImage = new AttachmentBuilder(Buffer, { name: 'Pikachu.png' });

            if (Text2) {
                const Content = new EmbedBuilder()
                    .setColor(color)
                    .setTitle(`✏️ ระบบสร้างมีม`)
                    .setDescription(`คำบรรยาย : (${User}) **${Text} ${Text2}**`)
                    .setImage('attachment://Pikachu.png')
                    .setFooter({ text: `สร้างโดย : ${interaction.user.username}`, iconURL: interaction.user.avatarURL() })
                    .setTimestamp()

                return interaction.editReply({ embeds: [Content], files: [FinishImage] });
            } else {
                const Content = new EmbedBuilder()
                    .setColor(color)
                    .setTitle(`✏️ ระบบสร้างมีม`)
                    .setDescription(`คำบรรยาย : (${User}) **${Text}**`)
                    .setImage('attachment://Pikachu.png')
                    .setFooter({ text: `สร้างโดย : ${interaction.user.username}`, iconURL: interaction.user.avatarURL() })
                    .setTimestamp()

                return interaction.editReply({ embeds: [Content], files: [FinishImage] });
            }
        } else if (Format == 'iamonceagainasking') {
            const canvas = createCanvas(500, 500)
            const ctx = canvas.getContext('2d')

            const Bg = await loadImage('./src/commands/fun/data/canvas/Ask.jpg')
            const Avatar = await loadImage(`${User.avatarURL().replace(".webp", ".png")}`)

            ctx.drawImage(Bg, 0, 0, canvas.width, canvas.height)
            ctx.drawImage(Avatar, 205, 110, 150, 150)
            const TextWidth = ctx.measureText(Text).width;

            const x = canvas.width / 2;
            const y = 480;

            ctx.font = '50px Impact'
            ctx.fillStyle = 'white'
            ctx.strokeStyle = 'rgba(0,0,0,3)'
            ctx.textAlign = 'center'
            ctx.fillText(Text, x, y)
            ctx.strokeText(Text, x, y)

            const Buffer = canvas.toBuffer('image/png')
            const FinishImage = new AttachmentBuilder(Buffer, { name: 'Ask.png' });

            const Content = new EmbedBuilder()
                .setColor(color)
                .setTitle(`✏️ ระบบสร้างมีม`)
                .setDescription(`คำบรรยาย : (${User}) **${Text}**`)
                .setImage('attachment://Ask.png')
                .setFooter({ text: `สร้างโดย : ${interaction.user.username}`, iconURL: interaction.user.avatarURL() })
                .setTimestamp()

            return interaction.editReply({ embeds: [Content], files: [FinishImage] });
        } else if (Format == 'thisisworthless') {
            const canvas = createCanvas(500, 560)
            const ctx = canvas.getContext('2d')

            const Bg = await loadImage('./src/commands/fun/data/canvas/Worth.jpg')
            const Avatar = await loadImage(`${User.avatarURL().replace(".webp", ".png")}`)

            ctx.drawImage(Bg, 0, 0, canvas.width, canvas.height)
            ctx.drawImage(Avatar, 175, 345, 140, 140)
            const TextWidth = ctx.measureText(Text).width;

            let y;
            const x = canvas.width / 2;

            if (!Text2) {
                y = 180;
            } else {
                y = 160;
            }

            ctx.font = '50px Impact'
            ctx.fillStyle = 'white'
            ctx.strokeStyle = 'rgba(0,0,0,3)'
            ctx.textAlign = 'center'
            ctx.fillText(Text, x, y)
            ctx.strokeText(Text, x, y)
            if (Text2) {
                ctx.fillText(Text2, x, y + 50)
                ctx.strokeText(Text2, x, y + 50)
            }

            const Buffer = canvas.toBuffer('image/png')
            const FinishImage = new AttachmentBuilder(Buffer, { name: 'Worth.png' });

            if (Text2) {
                const Content = new EmbedBuilder()
                    .setColor(color)
                    .setTitle(`✏️ ระบบสร้างมีม`)
                    .setDescription(`คำบรรยาย : (${User}) **${Text} ${Text2}**`)
                    .setImage('attachment://Worth.png')
                    .setFooter({ text: `สร้างโดย : ${interaction.user.username}`, iconURL: interaction.user.avatarURL() })
                    .setTimestamp()

                return interaction.editReply({ embeds: [Content], files: [FinishImage] });
            } else {
                const Content = new EmbedBuilder()
                    .setColor(color)
                    .setTitle(`✏️ ระบบสร้างมีม`)
                    .setDescription(`คำบรรยาย : (${User}) **${Text}**`)
                    .setImage('attachment://Worth.png')
                    .setFooter({ text: `สร้างโดย : ${interaction.user.username}`, iconURL: interaction.user.avatarURL() })
                    .setTimestamp()

                return interaction.editReply({ embeds: [Content], files: [FinishImage] });
            }
        } else if (Format == 'drevilairquotes') {
            const canvas = createCanvas(667, 500)
            const ctx = canvas.getContext('2d')

            const Bg = await loadImage('./src/commands/fun/data/canvas/Dr.jpg')
            const Avatar = await loadImage(`${User.avatarURL().replace(".webp", ".png")}`)

            ctx.drawImage(Bg, 0, 0, canvas.width, canvas.height)
            ctx.drawImage(Avatar, 265, 55, 160, 160)
            const TextWidth = ctx.measureText(Text).width;

            const x = canvas.width / 2;
            const y = 480;

            ctx.font = '53px Impact'
            ctx.fillStyle = 'white'
            ctx.strokeStyle = 'rgba(0,0,0,3)'
            ctx.textAlign = 'center'
            ctx.fillText(Text, x, y)
            ctx.strokeText(Text, x, y)

            const Buffer = canvas.toBuffer('image/png')
            const FinishImage = new AttachmentBuilder(Buffer, { name: 'Dr.png' });

            const Content = new EmbedBuilder()
                .setColor(color)
                .setTitle(`✏️ ระบบสร้างมีม`)
                .setDescription(`คำบรรยาย : (${User}) **${Text}**`)
                .setImage('attachment://Dr.png')
                .setFooter({ text: `สร้างโดย : ${interaction.user.username}`, iconURL: interaction.user.avatarURL() })
                .setTimestamp()

            return interaction.editReply({ embeds: [Content], files: [FinishImage] });
        } else if (Format == 'nowthatswhaticall') {
            const canvas = createCanvas(738, 477)
            const ctx = canvas.getContext('2d')

            const Bg = await loadImage('./src/commands/fun/data/canvas/Now.jpg')

            ctx.drawImage(Bg, 0, 0, canvas.width, canvas.height)
            const TextWidth = ctx.measureText(Text).width;

            const x = canvas.width / 2;
            const y = 400;

            ctx.font = '65px Impact'
            ctx.fillStyle = 'white'
            ctx.strokeStyle = 'rgba(0,0,0,3)'
            ctx.textAlign = 'center'
            ctx.fillText(Text, x, y)
            ctx.strokeText(Text, x, y)

            const Buffer = canvas.toBuffer('image/png')
            const FinishImage = new AttachmentBuilder(Buffer, { name: 'Now.png' });

            const Content = new EmbedBuilder()
                .setColor(color)
                .setTitle(`✏️ ระบบสร้างมีม`)
                .setDescription(`คำบรรยาย : (${User}) **${Text}**`)
                .setImage('attachment://Now.png')
                .setFooter({ text: `สร้างโดย : ${interaction.user.username}`, iconURL: interaction.user.avatarURL() })
                .setTimestamp()

            return interaction.editReply({ embeds: [Content], files: [FinishImage] });
        }
    }
}
module.exports = {
    CanvasCommand
};
